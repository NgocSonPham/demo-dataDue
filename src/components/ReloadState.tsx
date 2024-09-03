import { isEmpty } from "lodash";
import React from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectUser, setConfig, setUser } from "../redux/slice";
import configService from "../services/configService";
import userService from "../services/userService";

const ReloadState = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const initConfig = async () => {
    const {
      data: { data: config },
    } = await configService.getConfig();
    dispatch(setConfig(config));
  };

  React.useEffect(() => {
    const initUser = async () => {
      const {
        data: { data: newUser },
      } = await userService.getById(user.id);
      dispatch(setUser({ ...user, ...newUser }));
    };

    if (!isEmpty(user?.id?.toString())) {
      initUser();
    }
    // initConfig();
  }, []);

  return <></>;
};

export default ReloadState;
