// // Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyA59yv7L4zphCY8ygCl--JgliFRkda2vZ0",
  authDomain: "datadude-2024.firebaseapp.com",
  projectId: "datadude-2024",
  storageBucket: "datadude-2024.firebasestorage.com",
  messagingSenderId: "33990125067",
  appId: "1:33990125067:web:51b2c16e2e5b937514890e"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log("Received background message ", payload);
//   const channel = new BroadcastChannel("notifications");
//   channel.postMessage(payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });
