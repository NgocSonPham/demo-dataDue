import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { fcm } from "../utils/firebase";

const useNotification = () => {
  const [notification, setNotification] = useState<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const unsubscribe = onMessage(getMessaging(fcm), (payload) => {
          if (payload) {
            const { notification } = payload;
            setNotification(notification);
          }
        });
        return () => unsubscribe();
      } catch (error) {}
    }
  }, []);

  return { notification };
};

export default useNotification;
