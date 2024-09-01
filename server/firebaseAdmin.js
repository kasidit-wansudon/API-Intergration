const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");

// คุณต้องมีไฟล์ serviceAccountKey.json ที่ดาวน์โหลดจาก Firebase Console
const serviceAccount = require("./oppo-80086-fe15da6e828d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(bodyParser.json());

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

const registrationTokens = [
  "cG2jvlK8pzanBCYTx96x5-:APA91bE8NtiUya9SWwBvvZcIG1DL392fgWFpY0Y1r2cPsnSXl1sf07R-dqdbnJRsaSo6GRbiaMPY6k8jrWsp2XrF9EQi5xjTOFIJDnvVY8mBp_FOUTzpHDj73kWqmUZPzaGH6hPUSlAg",
  "dwj41V_QPCWPzpYLpQ6M8x:APA91bG2ZRX6leZ5Jq5aOC0eykKG-JN4mhdryQwN_VjQacTvbCmJhcHjNPSSBqtnbKgpkIVdqghe5uoqfZ-Scc6b4rgPJMm8u2JXGZDBw3jpj9M6uc-16U2HK4YyAmGEQxtdaC26SUv6"
]; // ใส่โทเค็นที่ต้องการสมัครสมาชิก
const topic = "news"; // ชื่อหัวข้อที่ต้องการสมัครสมาชิก

// Subscribe the devices corresponding to the registration tokens to the topic.
admin
  .messaging()
  .unsubscribeFromTopic(registrationTokens, topic)
  .then(response => {
    console.log("Successfully  unsubscribed to topic:", response);
  })
  .catch(error => {
    console.log("Error subscribing to topic:", error);
  });

app.post("/subscribe-to-topic", (req, res) => {
  const { tokens, topic } = req.body;

  // Subscribe the device token to the topic
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

app.post("/subscribe-to-topic", (req, res) => {
  const { tokens, topic } = req.body;

  // Subscribe the device token to the topic
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

  // Subscribe the device token to the topic
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

  // Subscribe the device token to the topic

  const message = {
    notification: {
      title: "Breaking News From Webhook",
      body: 'This is a message to all subscribers of the "news" topic.'
    },
    topic: topic
  };

  // ส่งข้อความไปยัง Topic
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
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
