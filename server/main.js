// Import required modules
const admin = require("firebase-admin"); // Firebase Admin SDK for managing FCM
const express = require("express"); // Express framework for building web applications
const bodyParser = require("body-parser"); // Middleware for parsing incoming request bodies

// Firebase service account credentials for authentication
const serviceAccount = require("./oppo-mexico-staff-tools-firebase-adminsdk-s2lga-c9cdb92044.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount) // Authenticate using service account
});

// Initialize Express application
const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.json({ limit: "500mb" })); // Handle JSON payloads with a size limit
app.use(express.urlencoded({ limit: "500mb", extended: true })); // Handle URL-encoded payloads

// Define a route for FCM auto notifications
app.post("/fcm/auto", (req, res) => {
  if (req.body.staffList) sendMulti(req, res); // Send notifications to multiple devices
  else sendSingle(req, res); // Send notification to a single device
});

// Send notification to multiple devices via topic
async function sendMulti(req, res) {
  const registrationToken = req.body.message.token; // Individual token for direct notification
  const registrationTokens = req.body.staffList; // List of device tokens to subscribe to a topic
  const topic = `topic${req.body.push_insert}`; // Topic name dynamically generated
  const req_mes = req.body.message; // Extract message details from the request

  // Prepare subscription data
  const subscriptionTokens = {
    status: "send subscription",
    tokens: registrationTokens,
    topic: topic
  };

  // Subscribe tokens to the topic
  var sub = await subscribe(subscriptionTokens, res);
  if (sub != 200) return; // Stop if subscription fails

  // Define notification content
  const notification = {
    title: req_mes.title,
    body: req_mes.content
  };

  // Define FCM message payload
  const message = {
    topic: topic,
    apns: { // APNs (iOS) specific configuration
      payload: {
        aps: {
          alert: {
            title: req_mes.notification.title,
            body: req_mes.notification.body
          },
          sound: "default"
        }
      },
      fcm_options: {
        image: req_mes.notification.image // Optional notification image
      }
    },
    data: req_mes.data, // Custom data payload
    notification: req_mes.notification // Notification details
  };

  // Send the message to the topic
  sendToTopic({ req: subscriptionTokens, message: message }, res);
}

// Send notification to a single device
function sendSingle(req, res) {
  const registrationToken = req.body.message.token; // Device token
  const req_mes = req.body.message; // Extract message details

  // Define FCM message payload for a single device
  const message = {
    token: registrationToken, // Target device token
    apns: { // APNs (iOS) specific configuration
      payload: {
        aps: {
          alert: {
            title: req_mes.notification.title,
            body: req_mes.notification.body
          },
          sound: "default"
        }
      },
      fcm_options: {
        image: req_mes.notification.image // Optional notification image
      }
    },
    data: req_mes.data, // Custom data payload
    notification: req_mes.notification // Notification details
  };

  // Send the message
  send(message, res);
}

// Send a message via Firebase Messaging
function send(message, res) {
  admin
    .messaging()
    .send(message) // Send the message using Firebase Admin SDK
    .then(response => {
      res.status(200).send(response); // Respond with success
    })
    .catch(error => {
      console.log("Error sending message:", error);
      res.status(500).send("Error sending notification"); // Respond with error
    });
}

// Subscribe device tokens to a topic
function subscribe(req, res) {
  const { tokens, topic } = req;

  return admin
    .messaging()
    .subscribeToTopic(tokens, topic) // Subscribe tokens to the topic
    .then(response => {
      console.log(`subscribe topic:${topic} ${tokens.length}`);
      return 200; // Return success status
    })
    .catch(error => {
      console.log("Error subscribing to topic:", error);
      res.status(500).send("Error subscribing to topic"); // Respond with error
    });
}

// Unsubscribe device tokens from a topic
function unsubscribe(req, res) {
  const { tokens, topic } = req;

  admin
    .messaging()
    .unsubscribeFromTopic(tokens, topic) // Unsubscribe tokens from the topic
    .then(response => {
      console.log("Successfully unsubscribed to topic:", response);
      res.status(200).send("Successfully subscribed to topic"); // Respond with success
    })
    .catch(error => {
      console.log("Error subscribing to topic:", error);
      res.status(500).send("Error subscribing to topic"); // Respond with error
    });
}

// Send a message to a topic
function sendToTopic(message, res) {
  message.status = "send to topic"; // Update status for logging
  admin
    .messaging()
    .send(message.message) // Send the message to the topic
    .then(response => {
      console.log("Successfully sent to topic message:", JSON.stringify(message, 2, null), response);
      unsubscribe(message.req, res); // Unsubscribe tokens after message is sent
    })
    .catch(error => {
      console.log("Error sending message:", error);
      unsubscribe(message.req, res); // Unsubscribe tokens if sending fails
    });
}

// Start the Express server
const port = 888; // Define the port for the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`); // Log server start
});