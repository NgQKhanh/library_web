// firebaseService.js

var admin = require("firebase-admin");
var serviceAccount = require("../middlewares/library-notification-e422f-firebase-adminsdk-e8pxz-aab4940024.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendNotification = async (registrationToken, title, message) => {
  const messageSend = {
    token: registrationToken,
    notification: {
      title: title,
      body: message
    },
    data: {
      key1: "value1",
      key2: "value2"
    },
    android: {
      priority: "high"
    },
    apns: {
      payload: {
        aps: {
          badge: 42
        }
      }
    }
  };

  admin
    .messaging()
    .send(messageSend)
    .then(response => {
      console.log("Successfully sent message: ", response);
    })
    .catch(error => {
      console.log("Error sending message: ", error);
    });
};

module.exports = { sendNotification };
