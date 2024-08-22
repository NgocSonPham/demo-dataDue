import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "../utils/types";
import { RootState } from "./store";

type AppState = {
  user: User;
  config: any;
};

const initialState = {
  user: {},
} as AppState;

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setConfig: (state, action: PayloadAction<any>) => {
      state.config = action.payload;
    },
  },
});

export const { setUser, setConfig } = appSlice.actions;
export const selectUser = (state: RootState) => state.app.user;
export const selectConfig = (state: RootState) => state.app.config;
export default appSlice.reducer;
