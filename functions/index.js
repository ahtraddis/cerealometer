'use strict';

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const nodemailer = require('nodemailer');

const PRESENCE_THRESHOLD_KG = 0.03

async function getItemDefinitionByUpc(upc) {
  //const snap = await firebase.database().ref(`/item_definitions`).orderByChild('upc').equalTo(upc).once('value');
  console.log("getItemDefinitionByUpc(): upc: ", upc);
  const snap = await admin.database().ref(`/item_definitions`).orderByChild('upc').equalTo(upc).once('value');
  //const snap = await admin.database().ref(`/item_definitions`).once('value');
  console.log("getItemDefinitionByUpc(): snap: ", snap.val());
  return snap.val()
}

exports.getUpcData = functions.https.onRequest(async (req, res) => {
  // Grab the upc parameter (GET)
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



// Log event when cereal scale status changes, e.g. box is removed or returned
exports.slotStatusChanged = functions.database.ref('/ports/{deviceId}/{slotId}/weight_kg')
  .onUpdate(async (change, context) => {
    console.log("change: ", JSON.stringify(change, null, 2))
    const device_id = context.params.deviceId
    const slot_id = context.params.slotId

    const weightKgBefore = change.before.val()
    // get all current values for the changed port
    const portSnap = await change.after.ref.parent.once('value')
    const port = portSnap.val()
    console.log(`port for device '${device_id}' slot '${slot_id}':`, JSON.stringify(port, null, 2))

    const item_id = port.item_id
    let item = {}
    let item_definition_id = "";
    let new_status = "unknown"

    const rootRef = change.before.ref.root
    const epoch = Math.floor(new Date().getTime() / 1000)

    if (item_id) {
      const itemSnap = await rootRef.child(`/items/${item_id}`).once('value')
      item = itemSnap.val()
      //console.log(`item:`, JSON.stringify(item, null, 2))
      if (!item) {
        console.log(`ERROR: item_id '${item_id}' not found in /items`)
        return null
      }
      item_definition_id = item.item_definition_id
    }

    // get all item_definitions since we need weight values to compute metrics
    const itemDefinitionSnap = await rootRef.child(`/item_definitions`).once('value')
    const itemDefinitions = itemDefinitionSnap.val()
    //console.log(`itemDefinitions:`, JSON.stringify(itemDefinitions, null, 2))

    // Determine new slot status (state) based on changes and item presence.
    // Slot States:
    // LOADABLE = no assigned item
    // LOADED = known item present
    // UNLOADED = known item, currently not on scale
    // LOADING = known/expected item, waiting to be put on scale
    // UNLOADING = known item, waiting to be removed
    if (item_id && (port.weight_kg >= PRESENCE_THRESHOLD_KG)) {
      new_status = "present"
    } else if (item_id) {
      new_status = "absent"
    } else {
      new_status = "vacant"
    }

    if (new_status != port.status) {
      const updateStatusSnap = await rootRef.child(`/ports/${device_id}/${slot_id}/status`).set(new_status)
      console.log(`updated status from prev_status '${port.status}' to new_status '${new_status}'`);
    }

    if ((port.weight_kg != weightKgBefore)
        && item
        && (port.weight_kg >= PRESENCE_THRESHOLD_KG)) {
      const newItem = item
      item.last_known_weight_kg = port.weight_kg
      item.last_checkin = epoch
      const updateItemSnap = await rootRef.child(`/items/${item_id}`).set(newItem)
      console.log(`updated item:`, JSON.stringify(newItem, null, 2))
    }

    const deviceSnap = await rootRef.child(`/devices/${device_id}`).once('value')
    const device = deviceSnap.val()
    //console.log("device:", JSON.stringify(device, null, 2))
    const user_id = device.user_id

    const itemsSnap = await rootRef.child('/items').orderByChild('user_id').equalTo(user_id).once('value')
    const items = itemsSnap.val()
    //console.log("items:", JSON.stringify(items, null, 2))

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
    const updateMeterSnap = await rootRef.child(`/users/${user_id}/meter`).set(pctRemaining)
    const updateMetricsSnap = await rootRef.child(`/users/${user_id}/metrics`).set(metrics)
    console.log(`updated metrics:`, JSON.stringify(metrics, null, 2))
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

// [START sendWelcomeEmail]
/**
 * Sends a welcome email to new user.
 */
// [START onCreateTrigger]
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
// [END onCreateTrigger]
  // [START eventAttributes]
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.
  // [END eventAttributes]

  return sendWelcomeEmail(email, displayName);
});
// [END sendWelcomeEmail]

// [START sendByeEmail]
/**
 * Send an account deleted email confirmation to users who delete their accounts.
 */
// [START onDeleteTrigger]
exports.sendByeEmail = functions.auth.user().onDelete((user) => {
// [END onDeleteTrigger]
  const email = user.email;
  const displayName = user.displayName;

  return sendGoodbyeEmail(email, displayName);
});
// [END sendByeEmail]

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
