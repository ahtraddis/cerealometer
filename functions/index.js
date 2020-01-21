'use strict';

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const nodemailer = require('nodemailer');

const PRESENCE_THRESHOLD_KG = 0.03

async function getItemDefinitionByUpc(upc) {
  //console.log("getItemDefinitionByUpc(): upc: ", upc);
  const snap = await admin.database().ref(`/item_definitions`).orderByChild('upc').equalTo(upc).once('value');
  //console.log("getItemDefinitionByUpc(): snap: ", snap.val());
  return snap.val()
}

exports.setWeight = functions.https.onRequest(async (req, res) => {
  if (req.method != "POST") return res.status(405).end()
  try {
    const { device_id, slot, weight_kg } = req.body
    //console.log(`device_id: ${device_id}, slot=${slot}, weight_kg=${weight_kg}`)
    const snap = await admin.database().ref(`/ports/${device_id}/${slot}/weight_kg`).set(weight_kg)
    res.status(200).send("OK")
  } catch(error) {
    console.log("error: ", error)
    res.status(400).send(error)
  }
});

exports.getUpcData = functions.https.onRequest(async (req, res) => {
  const upc = req.query.upc;
  const snap = await admin.database().ref(`/item_definitions`).orderByChild('upc').equalTo(upc).once('value');
  let response = {}
  if (snap.val()) {
    let data = snap.val()
    let key = Object.keys(data)[0]
    console.log("item_definition: ", data[key])
    data[key].id = key
    response.item_definition = data[key]
  }
  res.status(200).send(response);
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
    const statusSnap = await admin.database().ref(`/ports/${device_id}/${slot}/status`).set(newStatus)
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

// Log event when cereal scale status changes, e.g. box is removed or returned
exports.slotWeightChanged = functions.database.ref('/ports/{device_id}/{slot_id}/weight_kg')
  .onUpdate(async (change, context) => {
    const { device_id, slot_id } = context.params

    const weightKgBefore = change.before.val()
    // get all current values for the changed port
    const portSnap = await change.after.ref.parent.once('value')
    const port = portSnap.val()
    console.log(`port data for device '${device_id}' slot '${slot_id}':`, JSON.stringify(port, null, 2))

    const item_id = port.item_id
    let item = {}
    let item_definition_id = "";
    let new_status = port.status // default no change

    const rootRef = change.before.ref.root
    const epoch = Math.floor(new Date().getTime() / 1000)

    if (item_id) {
      const itemSnap = await rootRef.child(`/items/${item_id}`).once('value')
      item = itemSnap.val()
      if (!item) {
        console.log(`ERROR: item_id '${item_id}' not found in /items`)
        return null
      }
      item_definition_id = item.item_definition_id
    }

    // get all item_definitions since we need weight values to compute metrics
    const itemDefinitionSnap = await rootRef.child('/item_definitions').once('value')
    const itemDefinitions = itemDefinitionSnap.val()

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
      item.last_checkin = epoch
      const updateItemSnap = await rootRef.child(`/items/${item_id}`).set(newItem)
      console.log('updated item:', JSON.stringify(newItem, null, 2))
    }

    const deviceSnap = await rootRef.child(`/devices/${device_id}`).once('value')
    const device = deviceSnap.val()
    const user_id = device.user_id

    const itemsSnap = await rootRef.child('/items').orderByChild('user_id').equalTo(user_id).once('value')
    const items = itemsSnap.val()

    let totalGrams = 0
    let totalItemWeightKg = 0
    Object.keys(items).forEach(key => {
      let item = items[key]
      let name = itemDefinitions[item.item_definition_id].name
      if (item.last_known_weight_kg > 0) {
        totalItemWeightKg += item.last_known_weight_kg
        totalGrams += itemDefinitions[item.item_definition_id].weight_grams
      }
    })
    let pctRemaining = 100000 * totalItemWeightKg / totalGrams
    let metrics = {
      totalGrams: totalGrams,
      totalItemWeightKg: totalItemWeightKg,
      overallPercentage: pctRemaining,
    }
    //const updateMeterSnap = await rootRef.child(`/users/${user_id}/meter`).set(pctRemaining)
    const updateMetricsSnap = await rootRef.child(`/users/${user_id}/metrics`).set(metrics)
    console.log('updated metrics:', JSON.stringify(metrics, null, 2))
  }
);

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
