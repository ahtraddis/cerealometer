'use strict';

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const nodemailer = require('nodemailer');

const PRESENCE_THRESHOLD_KG = 0.03

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  const snapshot = await admin.database().ref('/messages').push({original: original});
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  res.redirect(303, snapshot.ref.toString());
});

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.val();
    console.log('Uppercasing', context.params.pushId, original);
    const uppercase = original.toUpperCase();
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return snapshot.ref.parent.child('uppercase').set(uppercase);
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

    return change.before.ref.parent.child('status').once('value')
      .then(snap => {
        prev_status = snap.val()
        //console.log("prev_status: ", prev_status);
      }).then(() => {
        return change.after.ref.parent.child('item').once('value')
          .then(snap => {
            item_key = snap.val()
            //console.log("item_key: ", item_key);
          })
      }).then(() => {
        return rootRef.child(`/items/${item_key}`).once('value')
          .then(snap => {
            item_snapshot = snap.val()
            item_definition_key = item_snapshot.item_definition
            user_key = item_snapshot.user
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
  })

// exports.slotStatusChanged = functions.database.ref('/ports/{deviceId}/{slotId}/weight_kg')
//   .onUpdate((change, context) => {
//     const prev_weight_kg = change.before.val();
//     const new_weight_kg = change.after.val();
//     console.log("Device '" + context.params.deviceId + "' Slot '" + context.params.slotId +
//       "' weight_kg changed from " + prev_weight_kg + " to " + new_weight_kg);
//     return change.after.ref.parent.child('item').once('value').then(item_snapshot => {
//       console.log("item_snapshot: '" + item_snapshot.val() + "'");


//       return change.after.ref.parent.child('status').once('value').then(status_snapshot => {
//         console.log("status_snapshot.val(): ", status_snapshot.val());

//         if (item_snapshot.val() == "") {
//           console.log("setting status to vacant");
//           return change.after.ref.parent.child('status').set("vacant").then(snapshot => {
//             console.log("snapshot after setting status to vacant: ", snapshot);
//           });
          
//         } else {


//           if (status_snapshot.val() == "present") {
//             console.log("setting weight on item ", item_snapshot.val());
//             return change.after.ref.parent.parent.parent.parent.child('items/' + item_snapshot.val() + '/last_known_weight_kg').set(new_weight_kg);
//           }


//         }

//       })


        
//     });




//     if (new_weight_kg < PRESENCE_THRESHOLD_KG) {
//       return change.after.ref.parent.child('status').set("absent");
//     } else {
//       return change.after.ref.parent.child('status').set("present");
//     }
//     // Next line is redundant, placeholder to return a promise
//     //return change.after.ref.parent.child('weight_kg').set(new_weight_kg);
//   });

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