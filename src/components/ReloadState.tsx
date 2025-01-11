import { isEmpty } from "lodash";
import React from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectUser, setConfig, setUser } from "../redux/slice";
import configService from "../services/configService";
import userService from "../services/userService";
import authService from "../services/authService";
import { db } from "../utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import dayjs from "dayjs";
import useFcmToken from "../hooks/useFcmToken";

const ReloadState = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = React.useState(false);
  const { fcmToken } = useFcmToken();

  const initConfig = async () => {
    const {
      data: { data: config }
    } = await configService.getConfig();
    dispatch(setConfig(config));
  };

  React.useEffect(() => {
    const initUser = async () => {
      const {
        data: { data: newUser }
      } = await userService.getById(user.id);

      await authService.doFirebaseAuth();

      dispatch(setUser({ ...user, ...newUser }));

      setLoaded(true);
    };

    if (!isEmpty(user?.id?.toString())) {
      initUser();
    }
    // initConfig();
  }, []);

  React.useEffect(() => {
    if (loaded && !isEmpty(user?.id?.toString())) {
      initUserFromFirestore();
    }
  }, [loaded]);

  React.useEffect(() => {
    if (isEmpty(fcmToken)) return;
    updateFcmToken(fcmToken);
  }, [fcmToken]);

  const initUserFromFirestore = async () => {
    const q = query(collection(db, "user"), where("uid", "==", user.id.toString()));

    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });

    const u: any = result && result[0];
    dispatch(
      setUser({
        ...user,
        seenNotificationAt: u.seenNotificationAt
          ? u.seenNotificationAt.seconds * 1000 + Math.floor(u.seenNotificationAt.nanoseconds / 1e6)
          : dayjs().valueOf()
      })
    );
  };

  const updateFcmToken = async (fcmToken: string) => {
    if (isEmpty(user?.id?.toString())) return;

    await userService.updateFcmToken(user.id, fcmToken);
  };

  return <></>;
};

export default ReloadState;
