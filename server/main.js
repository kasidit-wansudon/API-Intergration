const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");

const serviceAccount = require("./keys/oppo-colombia-staff-tools-firebase-adminsdk-tw03d-3cfecba1a4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(bodyParser.json());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

app.post("/fcm/send", (req, res) => {
  const registrationToken = req.body.token;
  const message = {
    notification: {
      title: "Test Message",
      body: "This is a test message from Node.js server"
    },
    token: registrationToken
  };

  admin
    .messaging()
    .send(message)
    .then(response => {
      console.log("Successfully sent message:", response);
      res.status(200).send("Message sent");
    })
    .catch(error => {
      console.log("Error sending message:", error);
      res.status(500).send("Error sending message");
    });
});

app.post("/fcm/auto", (req, res) => {
  if (req.body.staffList) sendMulti(req, res);
  else sendSingle(req, res);
});

async function sendMulti(req, res) {
  const registrationTokens = req.body.staffList;
  const topic = `topic${req.body.push_insert}`;
  const req_mes = req.body;
  const subscriptionTokens = {
    status: "send subscription",
    tokens: registrationTokens,
    topic: topic
  };

  var sub = await subscribe(subscriptionTokens, res);
  if (sub != 200) return;
  const notification = {
    title: req_mes.title,
    body: req_mes.content
  };
  const message = {
    topic: topic,
    apns: {
      payload: {
        aps: {
          alert: notification,
          sound: "default"
        }
      },
      fcm_options: {
        image: req_mes.image
      }
    },
    // data: req_mes.data,
    notification: notification
  };

  sendToTopic({ req: subscriptionTokens, message: message }, res);
}

function sendSingle(req, res) {
  const registrationToken = req.body.message.token;
  const req_mes = req.body.message;

  const message = {
    token: registrationToken,
    apns: {
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
        image: req_mes.notification.image
      }
    },
    data: req_mes.data,
    notification: req_mes.notification
  };

  send(message, res);
}

function send(message, res) {
  admin
    .messaging()
    .send(message)
    .then(response => {
      console.log(JSON.stringify(message, null, 2));
      res.status(200).send(response);
    })
    .catch(error => {
      console.log("Error sending message:", error);
      res.status(500).send("Error sending notification");
    });
}

function subscribe(req, res) {
  const { tokens, topic } = req;

  // Subscribe the device token to the topic
  return admin
    .messaging()
    .subscribeToTopic(tokens, topic)
    .then(response => {
      return 200;
    })
    .catch(error => {
      // return error;
      console.log("Error subscribing to topic:", error);
      res.status(500).send("Error subscribing to topic");
    });
}

function unsubscribe(req, res) {
  const { tokens, topic } = req;
  admin
    .messaging()
    .unsubscribeFromTopic(tokens, topic)
    .then(response => {
      console.log("Successfully subscribed to topic:", response);
      res.status(200).send("Successfully subscribed to topic");
    })
    .catch(error => {
      console.log("Error subscribing to topic:", error);
      res.status(500).send("Error subscribing to topic");
    });
}

function sendToTopic(message, res) {
  message.status = "send to topic";
  admin
    .messaging()
    .send(message.message)
    .then(response => {
      unsubscribe(message.req, res);
    })
    .catch(error => {
      unsubscribe(message.req, res);
    });
}

app.post("/subscribe-to-topic", (req, res) => {
  const { tokens, topic } = req.body;

  admin
    .messaging()
    .subscribeToTopic(tokens, topic)
    .then(response => {
      console.log("Successfully subscribed to topic:", response);
      res.status(200).send("Successfully subscribed to topic");
    })
    .catch(error => {
      console.log("Error subscribing to topic:", error);
      res.status(500).send("Error subscribing to topic");
    });
});

app.post("/unsubscribe-to-topic", (req, res) => {
  const { tokens, topic } = req.body;

  admin
    .messaging()
    .unsubscribeFromTopic(tokens, topic)
    .then(response => {
      console.log("Successfully subscribed to topic:", response);
      res.status(200).send("Successfully subscribed to topic");
    })
    .catch(error => {
      console.log("Error subscribing to topic:", error);
      res.status(500).send("Error subscribing to topic");
    });
});

app.post("/send-to-topic", (req, res) => {
  const { topic } = req.body;

  const message = {
    notification: {
      title: "Breaking News From Webhook",
      body: 'This is a message to all subscribers of the "news" topic.'
    },
    topic: topic
  };

  admin
    .messaging()
    .send(message)
    .then(response => {
      console.log("Successfully sent message:", response);
      res.status(200).send("Successfully sent message to topic");
    })
    .catch(error => {
      console.log("Error sending message:", error);
      res.status(500).send("Error sending to topic");
    });
});

const port = process.env.PORT || 3039;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
