'use strict';

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
var moment = require('moment');

const PRESENCE_THRESHOLD_KG = 0.001
const BARCODE_API_KEY = 'j1r1wmbrrx75nqiyyy0eh54az8sezh'

/**
 * Get current Unix epoch
 */
const getEpoch = () => Math.floor(new Date().getTime() / 1000)

exports.setWeight = functions.https.onRequest(async (req, res) => {
  if (req.method != "POST") {
    return res.status(405).end()
  }
  try {
    const { device_id, slot, weight_kg } = req.body
    console.log(`device_id: '${device_id}', slot='${slot}', weight_kg=${weight_kg}`)
    await admin.database().ref(`/ports/${device_id}/${slot}/weight_kg`).set(weight_kg)
    await admin.database().ref(`/ports/${device_id}/${slot}/last_update_time`).set(getEpoch())
    res.status(200).send("OK")
  } catch(error) {
    console.log("error: ", error)
    res.status(400).send(error)
  }
});

exports.getUpcData = functions.https.onRequest(async (req, res) => {
  const upc = req.query.upc;
  const snap = await admin.database().ref(`/item_definitions`).orderByChild('upc').equalTo(upc).once('value');
  const data = snap.val()
  console.log("getUpcData(): data: ", data)
  let response = {}
  if (data) {
    let key = Object.keys(data)[0] // in case of multiple
    console.log("item_definition: ", data[key])
    data[key].id = key
    response.item_definition = data[key]
    res.status(200).send(response);
  } else {
    console.log(`getUpcData(): upc '${upc}' not found in item_definitions, querying barcodelookup.com`)
    try {
      const url = `https://api.barcodelookup.com/v2/products?barcode=${upc}&key=${BARCODE_API_KEY}`

      fetch(url)
        .then(res => res.json())
        .then(json => {
          console.log("json: ", json)
          let product = json.products[0]
          let brand = product.brand || null
          let name = product.product_name || null
          let description = product.description || null
          let image_url = product.images[0] || null
          let size = product.size // "17 oz"
          
          let result = {
            brand: brand,
            name: name,
            description: description,
            image_url: image_url,
            upc: upc,
            net_weight_kg: 0, // TODO: find me
            tare_weight_kg: 0, // TODO: find me
          }

          // Create new item def if all essential fields are here
          const createSnap = admin.database().ref(`/item_definitions`).push(result)
          const key = createSnap.key
          result.key = key // add newly created key
          response.item_definition = result
          res.status(200).send(response)
        })


    } catch(error) {
      console.log("error: ", error)
      res.status(400).send(error)
    }
    
  }
});

exports.setPortItem = functions.https.onRequest(async (req, res) => {
  if (req.method != "POST") return res.status(405).end()
  const { device_id, slot, item_id } = req.body
  const portSnap = await admin.database().ref(`/ports/${device_id}/${slot}`).once('value')
  const port = portSnap.val()
  if (port.item_id) {
    console.log(`item_id is already set to '${item_id}'`)
    let response = { error: "item_id is already set" }
    res.status(400).send(response)
  } else {
    const itemSnap = await admin.database().ref(`/ports/${device_id}/${slot}/item_id`).set(item_id)
    // If something is already on scale, set status to CLEARING to disregard weight updates until scale is cleared, otherwise UNLOADED so next weight change updates the new item.
    const newStatus = (port.weight_kg >= PRESENCE_THRESHOLD_KG) ? "CLEARING" : "UNLOADED"
    await admin.database().ref(`/ports/${device_id}/${slot}/status`).set(newStatus)
    await admin.database().ref(`/ports/${device_id}/${slot}/last_update_time`).set(getEpoch())
    const resultPortSnap = await admin.database().ref(`/ports/${device_id}/${slot}`).once('value')
    const resultPort = resultPortSnap.val()
    let response = resultPort

    res.status(200).send(response);
  }
});

exports.clearPortItem = functions.https.onRequest(async (req, res) => {
  if (req.method != "POST") return res.status(405).end()

  const { device_id, slot } = req.body
  console.log(`method: ${req.method}, device_id: ${device_id}, slot=${slot}`)

  const portSnap = await admin.database().ref(`/ports/${device_id}/${slot}`).once('value')
  const port = portSnap.val()

  const itemSnap = await admin.database().ref(`/ports/${device_id}/${slot}/item_id`).set('')

  // Set status to CLEARING if something is on the scale, otherwise VACANT
  const newStatus = (port.weight_kg >= PRESENCE_THRESHOLD_KG) ? "CLEARING" : "VACANT"
  const statusSnap = await admin.database().ref(`/ports/${device_id}/${slot}/status`).set(newStatus)

  const resultPortSnap = await admin.database().ref(`/ports/${device_id}/${slot}`).once('value')
  const resultPort = resultPortSnap.val()
  let response = resultPort
  res.status(200).send(response);
});

exports.portCreated = functions.database.ref('/ports/{device_id}/{slot_id}')
  .onCreate(async (snap, context) => {
    const { device_id, slot_id } = context.params
    const rootRef = snap.ref.root

    await rootRef.child(`/ports/${device_id}/${slot_id}/status`).set('VACANT')
    await rootRef.child(`/ports/${device_id}/${slot_id}/item_id`).set('')
    const portSnap = await rootRef.child(`/ports/${device_id}/${slot_id}`).once('value')
    const port = portSnap.val()
  }
);

async function updateMetricsForUserId(user_id) {
  const itemsSnap = await admin.database().ref('/items').orderByChild('user_id').equalTo(user_id).once('value')
  const items = itemsSnap.val()

  // [eschwartz-TODO] Get only item_definitions relevant for this user (getting all for now)
  const itemDefinitionSnap = await admin.database().ref('/item_definitions').once('value')
  const itemDefinitions = itemDefinitionSnap.val()

  let totalKg = 0
  let totalNetWeightKg = 0

  if (items) {
    Object.keys(items).forEach(key => {
      let item = items[key]
      if (item.last_known_weight_kg > 0) {
        totalNetWeightKg += item.last_known_weight_kg - (itemDefinitions[item.item_definition_id].tare_weight_kg ? itemDefinitions[item.item_definition_id].tare_weight_kg : 0)
        totalKg += itemDefinitions[item.item_definition_id].net_weight_kg
      }
    })
  }
  let metrics = {
    totalKg: totalKg,
    totalNetWeightKg: totalNetWeightKg,
    overallPercentage: totalKg ? (100 * totalNetWeightKg / totalKg) : 0,
  }
  await admin.database().ref(`/users/${user_id}/metrics`).set(metrics)
  console.log(`updated metrics for user_id '${user_id}':`, JSON.stringify(metrics, null, 2))

  // add message
  let data = {
    title: "Title",
    message: moment().format('LLL')
  }
  const snap = admin.database().ref(`/messages/${user_id}`).push(data)
  const messageKey = snap.key
  console.log(`message key '${messageKey}' has been created:`, data)
}

// Log event when cereal scale status changes, e.g. box is removed or returned
exports.slotWeightChanged = functions.database.ref('/ports/{device_id}/{slot_id}/weight_kg')
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
    if ((port.status == "CLEARING") && (port.weight_kg < PRESENCE_THRESHOLD_KG)) {
      // scale is now clear
      new_status = item_id ? "UNLOADED" : "VACANT"
    } else if ((port.status == "CLEARING") && (port.weight_kg >= PRESENCE_THRESHOLD_KG)) {
      // still waiting for load to clear, no change
    }
    else if (port.status == "VACANT") {
      // do nothing
    }
    else if (port.status != "VACANT") {
      // LOADED or UNLOADED
      new_status = (port.weight_kg > PRESENCE_THRESHOLD_KG) ? "LOADED" : "UNLOADED"
    }

    if (new_status != port.status) {
      const updateStatusSnap = await rootRef.child(`/ports/${device_id}/${slot_id}/status`).set(new_status)
      console.log(`updated status from prev_status '${port.status}' to new_status '${new_status}'`);
    }

    if ((port.weight_kg != weightKgBefore)
        && item && item_id
        && (port.weight_kg >= PRESENCE_THRESHOLD_KG)
        && (new_status != "CLEARING")) {
      const newItem = item
      item.last_known_weight_kg = port.weight_kg
      item.last_update_time = getEpoch()
      const updateItemSnap = await rootRef.child(`/items/${item_id}`).set(newItem)
      console.log('updated item:', JSON.stringify(newItem, null, 2))
    }

    const deviceSnap = await rootRef.child(`/devices/${device_id}`).once('value')
    const device = deviceSnap.val()
    const user_id = device.user_id

    await updateMetricsForUserId(user_id)
    console.log("done updating metrics")
  }
);

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
      let deviceData = ports[device_id]
      Object.keys(deviceData).map(async slot => {
        let slotData = deviceData[slot]
        if (slotData.item_id == item_id) {
          await admin.database().ref(`/ports/${device_id}/${slot}/item_id`).set("")
          await admin.database().ref(`/ports/${device_id}/${slot}/status`).set("VACANT")
          await admin.database().ref(`/ports/${device_id}/${slot}/last_update_time`).set(getEpoch())
        }
      })
    })
  }

  await updateMetricsForUserId(user_id)

  return null // [eschwartz-TODO] Is this valid to return?
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

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Cerealometer';

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
    from: `${APP_NAME} <noreply@firebase.com>`,
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
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  // The user unsubscribed to the newsletter.
  mailOptions.subject = `Bye!`;
  mailOptions.text = `Hey ${displayName || ''}!, We confirm that we have deleted your ${APP_NAME} account.`;
  await mailTransport.sendMail(mailOptions);
  console.log('Account deletion confirmation email sent to:', email);
  return null;
}
