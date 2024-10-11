# API_Intergration

This project is a Node.js application that integrates with Firebase Cloud Messaging (FCM) for sending push notifications. The application allows you to send notifications to specific devices or subscribe/unsubscribe devices to/from topics.

## Features

- **Send Push Notifications**: Send notifications to specific devices using their registration tokens.
- **Subscribe to Topics**: Manage device subscriptions to specific topics for targeted notifications.
- **Unsubscribe from Topics**: Remove devices from specific topics.

## Prerequisites

- **Node.js**: Make sure you have Node.js installed on your system.
- **Firebase Project**: You need a Firebase project with Firebase Cloud Messaging enabled.
- **Service Account Key**: A service account key JSON file from Firebase.

## Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/kasidit-wansudon/API_Intergration.git
   cd API_Intergration
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Add your Firebase service account key**:

   - Place your Firebase service account key JSON file in the `server/` directory.
   - The file should be named as `oppo-80086-fe15da6e828d.json` or update the code in `index.js` to reflect the correct file name.

4. **Configure environment variables** (optional):
   - If you have any sensitive data (such as API keys), store them in a `.env` file (which should be ignored by Git).

5. **Setup Server** (optional):
   ```bash
   sudo install node
   sudo install pm2

   pm2 start npm --name "my-app" -- run dev
   ```

## Usage

- **Start the server**:

  ```bash
  npm start
  ```

- **Send Notification**:

  - Make a `POST` request to `/fcm/send` with the following payload:

  ```json
  {
    "token": "your_device_registration_token"
  }
  ```

- **Subscribe to a Topic**:

  - Make a `POST` request to `/subscribe-to-topic` with the following payload:

  ```json
  {
    "tokens": ["your_device_registration_token"],
    "topic": "your_topic_name"
  }
  ```

- **Unsubscribe from a Topic**:

  - Make a `POST` request to `/unsubscribe-to-topic` with the following payload:

  ```json
  {
    "tokens": ["your_device_registration_token"],
    "topic": "your_topic_name"
  }
  ```

- **Send Notification to a Topic**:
  - Make a `POST` request to `/send-to-topic` with the following payload:
  ```json
  {
    "topic": "your_topic_name"
  }
  ```

```json
{
  "message":{"token":"fsmgzZvbjkh4qL5FXsCbtB:APA91bEiAInj51K_zK_C7ja564A6_zswx5XLdrFiMGo3R2EDDetZxrYzdiqKh-VjWYIMH-YA1CNWSk97ChT3gqscKKvA6IE4_NmoU5i5Gijiczr4fQyM3rA3V4j4J73PPNPwYwAbZvaf"}
//   "fNqTp3f-N0Rqt9cDIqoXzY:APA91bGO3RcNqAWzT3esAgZ8i44ayBtf8UmFYFMGAOx93Lpn7Um8eHqeeALQUco6LKmyIt_ztzgfw3Nm6hGZEalKKbIr5wZ8kUgmOj_1mH95OU76BxDW2MmCpb0wnV1XINMvesEMA9at"
}
{
  "message": {
    "token": "c00kFe7xSwKAmihQORswN_:APA91bGF-guBidbNUbgJMSRBX5t1oYHIKPWKOYfs3Vkul5WdH98N3T-hLMiwS0ZyLjMAoySpSQsFyw0CYWvhMANiGSaNsxyI9u41XC_geVq3vWNGgLoPATAuhEm7ZAj48akPP0xzWz_v",
    "notification": {
      "body": "message",
      "title": "Bacode",
      "image": "https://owayx-col.s3.eu-west-3.amazonaws.com/33d27b799db2c31f9108bfc3e54108ec.jpeg"
    },
    "data": {
      "click_action": "FLUTTER_NOTIFICATION_CLICK",
      "navigation": "/post",
      "id": "72947",
      "ccid":"ccid"
    }
  }
}
```

```json
{
  "staffList": [
    "fhTaM3g-KEGKrG_ar62a0q:APA91bFUqPUVR2x1wUwiD8XhD5T0kopYVbGjU76S5TS0H3BfnmdoXLmFxbN_tnIsX8hcQtwoupgbbihykAUfuAhdOwZkbD9dXoofhw373xWvgLSyczhoSqalJSloe1gnDrUFrvsEi8lu",
    "fGjq6tsiV01UhwddcSNeU5:APA91bHhAUkK2f_v9qoPb8C1UN7Mfloq-TRcg1_baomcGpFeaUg24qV3c1gfUQBOvJYSDVAauacvJ3H5CggxgPKBa6m8vrrMOhp47rZs0FaauXMWAdj2MX1i-ETVNg8Nr7XsjncVBiK3",
    "cZUxn7P4Syatdy3TYwqsvz:APA91bFWmt8qsqTNXZL3N0HdUztAFp5O3B_ualHqVSDhWBoPilBq1JuX0zxnVUSnMFiNEp3l-XzXgQM61NTZG5FaVI4IRf6TVeiBhtX3X9zpyP5EODi2a2rmvpyLZKn86JDpx8A-WLlr"
  ],
  "content": "t",
  "title": "t",
  "image": "https://owayx-col.s3.eu-west-3.amazonaws.com/02ca1444a217a8cfd797609a45191fa8.png",
  "push_insert": 72956
}
```

```json
{
  "staffList": [
    "fhTaM3g-KEGKrG_ar62a0q:APA91bFUqPUVR2x1wUwiD8XhD5T0kopYVbGjU76S5TS0H3BfnmdoXLmFxbN_tnIsX8hcQtwoupgbbihykAUfuAhdOwZkbD9dXoofhw373xWvgLSyczhoSqalJSloe1gnDrUFrvsEi8lu",
    "fGjq6tsiV01UhwddcSNeU5:APA91bHhAUkK2f_v9qoPb8C1UN7Mfloq-TRcg1_baomcGpFeaUg24qV3c1gfUQBOvJYSDVAauacvJ3H5CggxgPKBa6m8vrrMOhp47rZs0FaauXMWAdj2MX1i-ETVNg8Nr7XsjncVBiK3",
    "cZUxn7P4Syatdy3TYwqsvz:APA91bFWmt8qsqTNXZL3N0HdUztAFp5O3B_ualHqVSDhWBoPilBq1JuX0zxnVUSnMFiNEp3l-XzXgQM61NTZG5FaVI4IRf6TVeiBhtX3X9zpyP5EODi2a2rmvpyLZKn86JDpx8A-WLlr"
  ],
  "content": "t",
  "title": "t",
  "image": "https://owayx-col.s3.eu-west-3.amazonaws.com/02ca1444a217a8cfd797609a45191fa8.png",
  "push_insert": 72956
}
```

## Notes

- Ensure your Firebase project is properly configured with FCM enabled.
- Handle secrets and API keys securely. Avoid committing sensitive information directly to the repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
