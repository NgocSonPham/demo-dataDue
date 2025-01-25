import dayjs from "dayjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { isEmpty } from "lodash";
import React from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import useFcmToken from "../hooks/useFcmToken";
import { selectUser, setConfig, setSpecialities, setUser } from "../redux/slice";
import authService from "../services/authService";
import specialityService from "../services/specialityService";
import userService from "../services/userService";
import { db } from "../utils/firebase";

const ReloadState = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = React.useState(false);
  const { fcmToken } = useFcmToken();

  const initSpecialities = async () => {
    const {
      data: { data: list }
    } = await specialityService.getAll();
    dispatch(setSpecialities(list.rows));
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
    initSpecialities();
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
