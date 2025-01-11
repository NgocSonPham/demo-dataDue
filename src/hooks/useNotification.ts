import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { selectUser } from "../redux/slice";
import { fcm } from "../utils/firebase";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";

const useNotification = () => {
  const [notification, setNotification] = useState<any>();
  const user = useAppSelector(selectUser);
  // const reloadDone = useAppSelector(selectReloadFsDone);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      try {
        const unsubscribe = onMessage(getMessaging(fcm), (payload) => {
          if (payload) {
            const { data, fcmOptions, notification } = payload;

            setNotification({ ...(data && { [data.type]: JSON.parse(data.value) }), ...fcmOptions, ...notification });
          }
        });
        return () => unsubscribe();
      } catch (error) {}
    }
  }, []);

  return { notification };
};

export default useNotification;
