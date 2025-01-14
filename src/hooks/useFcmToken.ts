import { getMessaging, getToken } from "firebase/messaging";
import { useEffect, useState } from "react";
import { fcm } from "../utils/firebase";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState("");

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined") {
          navigator.serviceWorker.register("/firebase-messaging-sw.js").then(async () => {
            // Retrieve the notification permission status
            const permission = await Notification.requestPermission();
            setNotificationPermissionStatus(permission);

            // Check if permission is granted before retrieving the token
            if (permission === "granted") {
              const currentToken = await getToken(getMessaging(fcm), {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
              });
              if (currentToken) {
                //console.log("current token for client: ", currentToken);
                setToken(currentToken);
              } else {
                console.log("No registration token available. Request permission to generate one.");
              }
            }
          });
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error);
      }
    };

    retrieveToken();
  }, []);

  return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
