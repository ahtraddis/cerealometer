'use strict';

const APP_NAME = 'Cerealometer';

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
var moment = require('moment');

const PRESENCE_THRESHOLD_KG = 0.001
const BARCODE_API_BASEURL = 'https://api.upcitemdb.com/prod/trial/lookup'

/**
 * Get current Unix epoch
 */
const getEpoch = () => Math.floor(new Date().getTime() / 1000)

const getBoundedPercentage = (numerator, denominator) => {
  return Math.min(Math.max(parseInt(100.0 * numerator / denominator), 0.0), 100.0);
}




/**
 * Update weight_kg and last_update_time upon POST from hardware device.
 * Returns port data including status to update LED state.
 */
exports.setWeight = functions.https.onRequest(async (req, res) => {
  // abort if unexpected method
  if (req.method != "POST") {
    return res.status(405).end()
  }
  try {
    const { device_id, slot, weight_kg } = req.body
    await admin.database().ref(`/ports/${device_id}/data/${slot}/weight_kg`).set(weight_kg)
    await admin.database().ref(`/ports/${device_id}/data/${slot}/last_update_time`).set(getEpoch())
    const portsSnap = await admin.database().ref(`/ports/${device_id}/data/${slot}`).once('value')
    // [eschwartz-TODO] Result needs to get the updated value after slotWeightChanged() has run 
    let result = portsSnap.val()
    res.status(200).send(result)
  } catch(error) {
    console.log("error: ", error)
    res.status(400).send(error)
  }
});

// [eschwartz-TODO] Merge with getPorts() below
exports.getDevice = functions.https.onRequest(async (req, res) => {
  // abort if unexpected method
  if (req.method != "GET") {
    return res.status(405).end()
  }
  try {
    const deviceId = req.query.device_id
    const statusRequested = req.query.status
    const portsSnap = await admin.database().ref(`/ports/${deviceId}`).once('value')
    let response
    if (statusRequested) {
      response = portsSnap.val().data.map(slot => slot.status)
    } else {
      response = portsSnap.val()
    }
    res.status(200).send(response)
  } catch(error) {
    console.log("error: ", error)
    res.status(400).send(error)
  }
});

/**
 * Get port data for user_id
 */
exports.getPorts = functions.https.onRequest(async (req, res) => {
  // abort if unexpected method
  if (req.method != "GET") {
    return res.status(405).end()
  }
  const user_id = req.query.user_id
  // get user's device id's
  const deviceSnap = await admin.database().ref('/devices').orderByChild('user_id').equalTo(user_id).once('value')
  const devices = deviceSnap.val()

  // get all port data associated with any of the user's devices
  const promises = Object.keys(devices).map(async (deviceId) => {
    const portsSnap = await admin.database().ref(`/ports/${deviceId}`).once('value')
    let obj = {}
    obj[deviceId] = portsSnap.val()
    return obj
  })
  const result = await Promise.all(promises)

  const arrayToObject = (array) => array.reduce((obj, item) => {
    let key = Object.keys(item)[0]
    obj[key] = item[key]
    return obj
  }, {})

  const response = arrayToObject(result)
  res.status(200).send(response)
});

/**
 * Get item definitions for user_id
 */
exports.getItemDefinitions = functions.https.onRequest(async (req, res) => {
  // abort if unexpected method
  if (req.method != "GET") {
    return res.status(405).end()
  }
  // [eschwartz-TODO] assume user_id present for now, return all items if absent
  const user_id = req.query.user_id 
  // get user's items
  const itemsSnap = await admin.database().ref('/items').orderByChild('user_id').equalTo(user_id).once('value')
  const items = itemsSnap.val()

  const arrayToObject = (array) => array.reduce((obj, item) => {
    let key = Object.keys(item)[0]
    obj[key] = item[key]
    return obj
  }, {})

  let result = []

  // get item defs for these items
  if (items) {
    const promises = Object.keys(items).map(async (itemId) => {
      const item = items[itemId]
      const itemDefinitionId = item.item_definition_id
      const itemDefSnap = await admin.database().ref(`/item_definitions/${itemDefinitionId}`).once('value')
      let obj = {}
      obj[itemDefinitionId] = itemDefSnap.val()
      return obj
    })
    result = await Promise.all(promises)
  }
  const response = arrayToObject(result)
  res.status(200).send(response)
});

/**
 * Get item definition associated with requested UPC code. If not found, query upcitemdb.com
 * and create a new item definition based on result.
 */
exports.getUpcData = functions.https.onRequest(async (req, res) => {
  // abort if unexpected method
  if (req.method != "GET") {
    return res.status(405).end()
  }
  const upc = req.query.upc;
  const snap = await admin.database().ref('/item_definitions').orderByChild('upc').equalTo(upc).once('value');
  const data = snap.val()
  let response = {}
  if (data) {
    let key = Object.keys(data)[0] // in case of multiple
    //console.log("getUpcData(): found existing entry in item_definitions: ", data[key])
    data[key].id = key
    response.item_definition = data[key]
    res.status(200).send(response);
  } else {
    console.log(`getUpcData(): UPC '${upc}' not found in item_definitions, querying upcitemdb.com`)
    const url = `${BARCODE_API_BASEURL}?upc=${upc}`

    fetch(url)
      .then(res => {
        const headers = res.headers
        // note: trial API is rate-limited, log limit stats
        const xRateLimitLimit = headers.get('x-ratelimit-limit')
        const xRateLimitRemaining = headers.get('x-ratelimit-remaining')
        const xRateLimitReset = headers.get('x-ratelimit-reset')
        const fromNow = moment.unix(xRateLimitReset).fromNow()
        console.log(`xRateLimitLimit: ${xRateLimitLimit}, xRateLimitRemaining: ${xRateLimitRemaining}, xRateLimitReset: ${xRateLimitReset} (${fromNow})`)
        return res.json()
      })
      .then(json => {
        if (json.code != "OK") {
          res.status(400).send(json)
        } else {
          // parse result
          let items = json.items
          let item = items[0]
          let ean = item.ean || null
          let title = item.title || null
          let description = item.description || null
          let upc = item.upc || null
          let brand = item.brand || null
          let model = item.model || null
          let color = item.color || null
          let size = item.size || null
          let dimension = item.dimension || null
          let weight = item.weight || null
          let currency = item.currency || null
          let lowest_recorded_price = item.lowest_recorded_price || null
          let highest_recorded_price = item.highest_recorded_price || null
          // [eschwartz-TODO] Image results are often bad URLs (503), particularly drugstore.com.
          // Pick the walmartimages.com ones when available.
          let image_url = item.images[0] || null
          let offers = item.offers || null // array

          // Scrape text fields for "1.23 oz", "1.23ounces" or similar pattern to take a best
          // guess at the correct net weight.
          // Note: weight fields sometimes indicate net weight for multi-pack items,
          // e.g. "768 grams" for Yamamotoyama tea 16-pack (16 x 48g)
          let netWeightRegex = /([\d.]+)\s*(oz|ounces|g|grams)[\s)]*(.*)$/i
          let matchStr, val, units, weightKg = 0

          if (title && title.match(netWeightRegex)) {
            [matchStr, val, units] = title.match(netWeightRegex);
          } else if (description && description.match(netWeightRegex)) {
            [matchStr, val, units] = description.match(netWeightRegex);
          } else if (offers) {
            offers.forEach(offer => {
              if (offer.title && offer.title.match(netWeightRegex)) {
                [matchStr, val, units] = offer.title.match(netWeightRegex);
                //console.log(`matched in offer.title: '${offer.title}`);
              }
            })
          }
          //console.log(`matchStr: '${matchStr}', val: '${val}', units: '${units}'`);

          // If string found for ounces or grams, convert to kilograms
          if (val && units) {
            val = parseFloat(val);
            units = units.toLowerCase();
            let divisor = 1.0;
            switch (units) {
              case 'oz':
                divisor = 35.274;
                break;
              case 'g':
                divisor = 1000.0;
                break;
              default:
                console.log(`unmatched units '${units}'`);
                divisor = 1.0;
            }
            weightKg = val / divisor;
            //console.log("weightKg: ", weightKg)
          }
          
          let result = {
            _source: 'upcitemdb',
            create_time: getEpoch(),
            // main fields to get from any db
            upc: upc,
            brand: brand,
            name: title,
            description: description,
            image_url: image_url,
            // computed fields
            net_weight_kg: weightKg,
            tare_weight_kg: 0,
            // extra non-essential fields
            ean: ean,
            title: title,
            model: model,
            //color: color,
            size: size,
            dimension: dimension,
            weight: weight,
            //currency: currency,
            //lowest_recorded_price: lowest_recorded_price,
            //highest_recorded_price: highest_recorded_price,
          }

          // Create new item def if all essential fields were found
          const createSnap = admin.database().ref(`/item_definitions`).push(result)
          const key = createSnap.key
          result.id = key // add created key to response
          response.item_definition = result
          res.status(200).send(response)
        }
      }).catch(error => {
        console.log("error: ", error)
        res.status(400).send(error)
      });
  }
});

/**
 * Set user item associated with a port
 */
exports.setPortItem = functions.https.onRequest(async (req, res) => {
  // abort if unexpected method
  if (req.method != "POST") {
    return res.status(405).end()
  }
  const { device_id, slot, item_id } = req.body
  const portSnap = await admin.database().ref(`/ports/${device_id}/data/${slot}`).once('value')
  const port = portSnap.val()
  if (port.item_id == item_id) {
    console.log(`item_id is already set (to '${item_id}')`)
    let response = { error: "item_id is already set" }
    res.status(400).send(response)
  } else {
    const itemSnap = await admin.database().ref(`/ports/${device_id}/data/${slot}/item_id`).set(item_id)
    // If something is already on scale, set status to CLEARING to disregard weight updates
    // until scale is cleared, otherwise UNLOADED so next weight change updates the new item.
    const newStatus = (port.weight_kg >= PRESENCE_THRESHOLD_KG) ? "CLEARING" : "UNLOADED"
    await admin.database().ref(`/ports/${device_id}/data/${slot}/status`).set(newStatus)
    await admin.database().ref(`/ports/${device_id}/data/${slot}/last_update_time`).set(getEpoch())
    const resultPortSnap = await admin.database().ref(`/ports/${device_id}/data/${slot}`).once('value')
    const resultPort = resultPortSnap.val()
    let response = resultPort

    res.status(200).send(response);
  }
});

/**
 * Clear user item associated with a port
 */
exports.clearPortItem = functions.https.onRequest(async (req, res) => {
  // abort if unexpected method
  // [eschwartz-TODO] Change to DELETE
  if (req.method != "POST") {
    return res.status(405).end()
  }
  const { device_id, slot } = req.body
  const portSnap = await admin.database().ref(`/ports/${device_id}/data/${slot}`).once('value')
  const port = portSnap.val()

  const itemSnap = await admin.database().ref(`/ports/${device_id}/data/${slot}/item_id`).set('')

  // Set status to CLEARING if weight is currently detected on the scale, otherwise VACANT
  const newStatus = (port.weight_kg >= PRESENCE_THRESHOLD_KG) ? "CLEARING" : "VACANT"
  const statusSnap = await admin.database().ref(`/ports/${device_id}/data/${slot}/status`).set(newStatus)

  const resultPortSnap = await admin.database().ref(`/ports/${device_id}/data/${slot}`).once('value')
  const resultPort = resultPortSnap.val()
  let response = resultPort
  res.status(200).send(response);
});

/**
 * When device first writes port data, set status on item_id initial values and add user_id
 * to sibling node. This allows us to watch all ports associated with the user_id rather than
 * doing so clumsily with ref.on() callbacks for each device.
 */
exports.portCreated = functions.database.ref('/ports/{device_id}/data/{slot_id}')
  .onCreate(async (snap, context) => {
    const { device_id, slot_id } = context.params
    const rootRef = snap.ref.root

    await rootRef.child(`/ports/${device_id}/data/${slot_id}/status`).set('VACANT')
    await rootRef.child(`/ports/${device_id}/data/${slot_id}/item_id`).set('')
    const portSnap = await rootRef.child(`/ports/data/${device_id}/${slot_id}`).once('value')
    const port = portSnap.val()
  }
);

/**
 * Add user_id back to /ports/<device_id> if ports are deleted and recreated for testing
 */
exports.portsDeviceCreated = functions.database.ref('/ports/{device_id}')
  .onCreate(async (snap, context) => {
    const { device_id, slot_id } = context.params
    const rootRef = snap.ref.root
    // find user_id for this device and add it to root node
    const deviceSnap = await rootRef.child(`/devices/${device_id}`).once('value')
    const device = deviceSnap.val()
    if (device.user_id) await rootRef.child(`/ports/${device_id}/user_id`).set(device.user_id)
    return null
  }
);

/**
 * Recalc user metrics when new item is created 
 */
exports.itemCreated = functions.database.ref('/items/{item_id}')
  .onCreate(async (snap, context) => {
    const { item_id } = context.params
    const item = snap.val()
    await updateMetricsForUserId(item.user_id)
    return null
  }
);

/**
 * Update metrics for user
 * 
 * @param {*} user_id 
 */
async function updateMetricsForUserId(user_id) {
  const itemsSnap = await admin.database().ref('/items').orderByChild('user_id').equalTo(user_id).once('value')
  const items = itemsSnap.val()

  // [eschwartz-TODO] Get only item_definitions relevant for this user (getting all for now)
  const itemDefinitionSnap = await admin.database().ref('/item_definitions').once('value')
  const itemDefinitions = itemDefinitionSnap.val()

  let totalKg = 0
  let totalNetWeightKg = 0
  let favoriteCount = 0
  // tally stats from user's items
  // [eschwartz-TODO] totalNetWeightKg is ending up negative!
  if (items) {
    Object.keys(items).forEach(key => {
      let item = items[key]
      if (item.last_known_weight_kg > 0) {
        totalNetWeightKg += item.last_known_weight_kg - (itemDefinitions[item.item_definition_id].tare_weight_kg ? itemDefinitions[item.item_definition_id].tare_weight_kg : 0)
        totalKg += itemDefinitions[item.item_definition_id].net_weight_kg
      }
      if (item.favorite) {
        favoriteCount += 1
      }
    })
  }
  let quantityScore = totalKg ? Math.min(Math.max(1.0 * totalNetWeightKg / totalKg, 0.0), 1.0) : 0.0
  let varietyScore = getVarietyScore(items ? Object.keys(items).length : 0)
  // [eschwartz-TODO] Find a meaningful measure of favoritity
  let favoritityScore = (items && favoriteCount) ? (1.0 * favoriteCount / Object.keys(items).length) : 1
  // Overall score is the weighted average of individual scores
  let overall = (0.5 * quantityScore) + (0.25 * varietyScore) + (0.25 * favoritityScore)

  let metrics = {
    itemCount: items ? Object.keys(items).length : 0,
    totalKg: totalKg,
    totalNetWeightKg: totalNetWeightKg,
    quantity: quantityScore,
    variety: varietyScore,
    favoritity: favoritityScore,
    overall: overall,
  }
  await admin.database().ref(`/users/${user_id}/metrics`).set(metrics)
  //console.log(`updated metrics for user_id '${user_id}':`, JSON.stringify(metrics, null, 2))
  //addMessage(user_id, 100.0 * overall)  
}

function getVarietyScore(itemCount) {
  if (itemCount == 0) {
    return 0
  } else if (itemCount >= 1 && itemCount < 3) {
    return 0.25
  } else if (itemCount >= 3 && itemCount < 5) {
    return 0.5
  } else if (itemCount >= 5) {
    return 1
  }
}

/**
 * Add message (alert) for user. WIP.
 */
async function addMessage(userId, overallPercentage) {
  // Placeholder thermometer image:
  // https://www.raspberrypi.org/documentation/configuration/images/over_temperature_80_85.png
  // Peanut Butter Chex:
  // https://i5.walmartimages.com/asr/f6a51049-73b0-487a-b2c0-2d8e9aeb7b22_1.3954a6f2d22eacc575662819850e9042.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff
  let data = {
    title: "Level Chex",
    create_time: getEpoch(),
    message: `Current danger level is ${overallPercentage.toFixed(0)}%. You're running a little hot.`,
    image_url: 'https://i5.walmartimages.com/asr/f6a51049-73b0-487a-b2c0-2d8e9aeb7b22_1.3954a6f2d22eacc575662819850e9042.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff',
  }
  const snap = admin.database().ref(`/messages/${userId}`).push(data)
  const messageKey = snap.key
  //console.log(`message key '${messageKey}' has been created:`, data)
}

/**
 * Update affected user metrics upon item definition change
 */
exports.itemDefinitionChanged = functions.database.ref('/item_definitions/{item_definition_id}')
  .onUpdate(async (change, context) => {
    const { item_definition_id } = context.params
    const itemDefBefore = change.before.val()
    const itemDefAfter = change.after.val()

    // Update metrics for affected users if net weight or tare weight has changed
    if ((itemDefAfter.net_weight_kg != itemDefBefore.net_weight_kg) ||
        (itemDefAfter.tare_weight_kg != itemDefBefore.tare_weight_kg)) {
      const itemsAffectedSnap = await admin.database().ref(`/items`).orderByChild('item_definition_id').equalTo(item_definition_id).once('value');
      const itemsAffected = itemsAffectedSnap.val()
      if (itemsAffected) {
        const uniqueUserIds = Array.from(new Set(Object.keys(itemsAffected).map(i => itemsAffected[i].user_id)))
        uniqueUserIds.forEach(user_id => updateMetricsForUserId(user_id))
      }
    }
    return null
  }
);

/**
 * Delete associated user items when an item definition is deleted
 */
exports.itemDefinitionDeleted = functions.database.ref('/item_definitions/{item_definition_id}').onDelete(async (snap, context) => {
  const { item_definition_id } = context.params
  
  const itemsAffectedSnap = await admin.database().ref('/items').orderByChild('item_definition_id').equalTo(item_definition_id).once('value');
  // create a map with all items to delete
  const updates = {};
  itemsAffectedSnap.forEach(item => {
    updates[item.key] = null;
  });
  // execute all updates in one go and return the result ot end the function
  return admin.database().ref('/items').update(updates);
});

/**
 * Log event when cereal scale status changes, e.g. box is removed or returned
 */
exports.slotWeightChanged = functions.database.ref('/ports/{device_id}/data/{slot_id}/weight_kg')
  .onUpdate(async (change, context) => {
    const { device_id, slot_id } = context.params

    const weightKgBefore = change.before.val()
    // get all current values for the changed port
    const portSnap = await change.after.ref.parent.once('value')
    const port = portSnap.val()

    const item_id = port.item_id
    let item = {}
    let item_definition_id = "";
    let new_status = port.status // default no change

    const rootRef = change.before.ref.root

    if (item_id) {
      const itemSnap = await rootRef.child(`/items/${item_id}`).once('value')
      item = itemSnap.val()
      if (!item) {
        console.log(`ERROR: item_id '${item_id}' not found in /items`)
        return null
      }
      item_definition_id = item.item_definition_id
    }

    // Slot States:
    // VACANT = no assigned item, available for use
    // LOADED = known item, load present
    // UNLOADED = known item, no load present
    // CLEARING = waiting for scale to clear, regardless of item

    // Determine new slot status (state) based on changes and item presence.
    if (!item_id) {
      new_status = "VACANT"
    }
    else if ((port.status == "CLEARING") && (port.weight_kg < PRESENCE_THRESHOLD_KG)) {
      // scale is now clear
      new_status = item_id ? "UNLOADED" : "VACANT"
    }
    else if ((port.status == "CLEARING") && (port.weight_kg >= PRESENCE_THRESHOLD_KG)) {
      // still waiting for load to clear, no change
    }
    else if (port.status != "VACANT") {
      // LOADED or UNLOADED
      new_status = (port.weight_kg > PRESENCE_THRESHOLD_KG) ? "LOADED" : "UNLOADED"
    }

    if (new_status != port.status) {
      const updateStatusSnap = await rootRef.child(`/ports/${device_id}/data/${slot_id}/status`).set(new_status)
      //console.log(`updated status from prev_status '${port.status}' to new_status '${new_status}'`);
    }

    if ((port.weight_kg != weightKgBefore)
        && item && item_id
        && (port.weight_kg >= PRESENCE_THRESHOLD_KG)
        && (new_status != "CLEARING")) {
      const newItem = item
      item.last_known_weight_kg = port.weight_kg
      item.last_update_time = getEpoch()
      const updateItemSnap = await rootRef.child(`/items/${item_id}`).set(newItem)
      //console.log('updated item:', JSON.stringify(newItem, null, 2))
    }

    const deviceSnap = await rootRef.child(`/devices/${device_id}`).once('value')
    const device = deviceSnap.val()
    const user_id = device.user_id

    await updateMetricsForUserId(user_id)
  }
);


/**
 * Reset port and remove item reference upon item deletion
 */
exports.resetPort = functions.database.ref('/items/{item_id}').onDelete(async (snap, context) => {
  const deletedItem = snap.val()
  const user_id = deletedItem.user_id

  const { item_id } = context.params
  console.log(`item '${item_id}' has been deleted`)
  // Unset any item_id references in /ports
  // [eschwartz-TODO] orderByChild doesn't seem to work here to query item_id in /ports, perhaps due to the <slot> param one level up?
  // Querying all ports for now.
  //const snap = await admin.database().ref(`/ports`).orderByChild('item_id').equalTo(item_id).once('value')
  const portsSnap = await admin.database().ref('/ports').once('value')
  const ports = portsSnap.val()

  if (ports) {
    Object.keys(ports).map(async device_id => {
      let deviceData = ports[device_id].data
      Object.keys(deviceData).map(async slot => {
        let slotData = deviceData[slot]
        if (slotData.item_id == item_id) {
          // Set status to CLEARING if weight is on scale, otherwise VACANT
          let newStatus = (slotData.weight_kg > PRESENCE_THRESHOLD_KG) ? "CLEARING" : "VACANT"
          await admin.database().ref(`/ports/${device_id}/data/${slot}/item_id`).set("")
          await admin.database().ref(`/ports/${device_id}/data/${slot}/status`).set(newStatus)
          await admin.database().ref(`/ports/${device_id}/data/${slot}/last_update_time`).set(getEpoch())
        }
      })
    })
  }

  await updateMetricsForUserId(user_id)
  return null // [eschwartz-TODO] Is this valid to return?
});

/**
 * Set item definition tare weight upon user's submission
 */
exports.setItemDefinitionTareWeight = functions.https.onRequest(async (req, res) => {
  // abort if unexpected method
  if (req.method != "PUT") {
    return res.status(405).end()
  }
  const { item_definition_id, tare_weight_kg } = req.body
  const itemDefSnap = await admin.database().ref(`/item_definitions/${item_definition_id}`).once('value')
  const itemDef = itemDefSnap.val()
  // update tare weight as long as reported value seems reasonable
  //if ((tare_weight_kg > PRESENCE_THRESHOLD_KG) && (tare_weight_kg < itemDef.net_weight_kg)) {
  if (tare_weight_kg > PRESENCE_THRESHOLD_KG) {
    await admin.database().ref(`/item_definitions/${item_definition_id}/tare_weight_kg`).set(tare_weight_kg)
    const finalSnap = await admin.database().ref(`/item_definitions/${item_definition_id}`).once('value')
    const response = finalSnap.val()
    res.status(200).send(response)
  } else {
    const errorMsg = `error: reported tare_weight_kg ${tare_weight_kg} was not accepted`
    console.error(errorMsg)
    const response = {
      error: errorMsg
    }
    res.status(400).send(response)
  }
});

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

/**
 * Create user profile entry upon registration
 */
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
  const newData = {
    create_time: getEpoch(),
  }
  const userId = user.uid
  await admin.database().ref(`/users/${userId}`).set(newData)
});

/**
 * Sends a welcome email to new user.
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.

  return sendWelcomeEmail(email, displayName);
});

/**
 * Send an account deleted email confirmation to users who delete their accounts.
 */
exports.sendByeEmail = functions.auth.user().onDelete((user) => {
  const email = user.email;
  const displayName = user.displayName;

  return sendGoodbyeEmail(email, displayName);
});

// Sends a welcome email to the given user.
async function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <donutreply@whyanext.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey${displayName ? " " + displayName : ''}! Welcome to ${APP_NAME}. I hope you will enjoy a more prosperous, cerealous life by using this app.`;
  await mailTransport.sendMail(mailOptions);
  console.log('New welcome email sent to:', email);
  return null;
}

// Sends a goodbye email to the given user.
async function sendGoodbyeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <donutreply@whyanext.com>`,
    to: email,
  };

  // The user unsubscribed to the newsletter.
  mailOptions.subject = `Bye!`;
  mailOptions.text = `Hey ${displayName || ''}!, We confirm that we have deleted your ${APP_NAME} account.`;
  await mailTransport.sendMail(mailOptions);
  console.log('Account deletion confirmation email sent to:', email);
  return null;
}
