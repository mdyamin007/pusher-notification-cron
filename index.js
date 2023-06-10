const express = require("express");
const cron = require("node-cron");
const PushNotifications = require("@pusher/push-notifications-server");
require("dotenv").config();

// Initialize the Pusher Beams client
const beamsClient = new PushNotifications({
  instanceId: process.env.PUSHER_INSTANCE_ID,
  secretKey: process.env.PUSHER_SECRET_KEY,
});

// Initialize Express
const app = express();

// Handler function to send push notifications
function sendPushNotificationToInstances() {
  // TODO: Retrieve the specific instances/devices you want to send notifications to

  // Construct the push notification payload
  const payload = {
    notification: {
      title: "Launch time",
      body: "Hello, Innovators! It is time to launch, please check in!",
      deep_link: "https://dsi-cafeteria.vercel.app",
    },
  };

  const interestId = "cafeteria";
  console.log(interestId);
  console.log(process.env.PUSHER_INSTANCE_ID);

  // Send the notification
  beamsClient
    .publishToInterests([interestId], {
      web: payload,
    })
    .then((publishResponse) => {
      console.log("Just published:", publishResponse.publishId);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Schedule the push notification task to run at 2 pm every day
cron.schedule(
  "00 14 * * 0-5",
  () => {
    sendPushNotificationToInstances();
  },
  { timezone: "Asia/Dhaka" }
);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server started and listening on port ${port}`);
});
