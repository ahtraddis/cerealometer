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
  .onUpdate((change, context) => {
    const prev_weight_kg = change.before.val();
    const new_weight_kg = change.after.val();
    let prev_status = "";
    let new_status = "";
    let item_key = "";
    let item_snapshot = {}
    let item_definition_key = "";
    let item_definition_snapshot = {}
    let user_key = ""
    let user_snapshot = {}

    console.log(`device '${context.params.deviceId}' slot ${context.params.slotId}: weight_kg changed from '${prev_weight_kg}' to '${new_weight_kg}'`);

    const rootRef = change.before.ref.root
    const epoch = Math.floor(new Date().getTime() / 1000)

    return change.before.ref.parent.child('status').once('value')
      .then(snap => {
        prev_status = snap.val()
        //console.log("prev_status: ", prev_status);
      }).then(() => {
        return change.after.ref.parent.child('item_id').once('value')
          .then(snap => {
            item_key = snap.val()
            //console.log("item_key: ", item_key);
          })
      }).then(() => {
        return rootRef.child(`/items/${item_key}`).once('value')
          .then(snap => {
            item_snapshot = snap.val()
            item_definition_key = item_snapshot.item_definition_id
            user_key = item_snapshot.user_id
            //console.log("item_snapshot: ", item_snapshot)
          })
      }).then(() => {
        return rootRef.child(`/item_definitions/${item_definition_key}`).once('value')
          .then(snap => {
            item_definition_snapshot = snap.val()
            //console.log("item_definition_snapshot: ", item_definition_snapshot)
          })
      }).then(() => {
        // update status
        if (item_key && (new_weight_kg >= PRESENCE_THRESHOLD_KG)) {
          new_status = "present"
        } else if (item_key) {
          new_status = "absent"
        } else {
          new_status = "vacant"
        }

        //console.log(`updating status from prev_status '${prev_status}' to new_status '${new_status}'`)
        return change.after.ref.parent.child('status').set(new_status)
          .then(snap => {
            console.log(`updated status from prev_status '${prev_status}' to new_status '${new_status}'`);
          }).then(() => {
            if (new_status == "present") {
              //console.log("known item present, copying weight to item node")
              return rootRef.child(`/items/${item_key}/last_known_weight_kg`).set(new_weight_kg)
                .then(snap => {
                  console.log(`copied new_weight_kg '${new_weight_kg}' to /items entry`)
                  return rootRef.child(`/items/${item_key}/last_checkin`).set(epoch)
                }).then(() => {
                  console.log(`updated last_checkin epoch time to ${epoch}`)
                  // recompute stats
                  // for now, update the main 'meter' percentage based on percentage remaining for this item only
                  // get item_definition (for weight_grams)
                  let pct_remaining = (100000 * new_weight_kg / item_definition_snapshot.weight_grams)
                  return rootRef.child(`/users/${user_key}/meter`).set(pct_remaining)
                    .then(snap => {
                      console.log(`set meter to ${pct_remaining}`)
                    })
                })
            }
          })
    })
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
