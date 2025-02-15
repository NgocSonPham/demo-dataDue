import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import appReducer from "./slice";
import { getFromDB, saveToDB, deleteFromDB } from "../storages/indexedDB";
import postDetailReducer from "@/modules/admin/pages/post/postDetailSlice";
const reduxPersistIndexedDB = {
  async getItem(key: string): Promise<string | null> {
    const value = await getFromDB(key);
    return value !== undefined ? JSON.stringify(value) : null;
  },
  async setItem(key: string, value: string): Promise<void> {
    await saveToDB(key, JSON.parse(value));
  },
  async removeItem(key: string): Promise<void> {
    await deleteFromDB(key);
  }
};

const appPersistConfig = {
  key: "app",
  storage: reduxPersistIndexedDB,
  whitelist: ["user", "config"]
};

const persistedAppReducer = persistReducer(appPersistConfig, appReducer);

export const store = configureStore({
  reducer: {
    app: persistedAppReducer,
    postDetail: postDetailReducer
  }
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
