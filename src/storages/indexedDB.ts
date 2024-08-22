import { DBSchema, IDBPDatabase, openDB } from "idb";
import { DB_STORE_NAME } from "../utils/constants";

// Define the database schema
interface MyDB extends DBSchema {
  sd: {
    key: string;
    value: any;
  };
}

const DB_NAME = "roadmap";
const DB_VERSION = 1;

// Create a database instance
export const dbPromise = openDB<MyDB>(DB_NAME, DB_VERSION, {
  upgrade(db: IDBPDatabase<MyDB>) {
    db.createObjectStore(DB_STORE_NAME);
  },
});

// Save JWT to IndexedDB
export async function saveToDB(key: string, value: any): Promise<void> {
  const db = await dbPromise;
  const tx = db.transaction(DB_STORE_NAME, "readwrite");
  tx.objectStore(DB_STORE_NAME).put(value, key);
  await tx.done;
}

// Get data from IndexedDB
export async function getFromDB(key: string): Promise<any | undefined> {
  const db = await dbPromise;
  const tx = db.transaction(DB_STORE_NAME, "readonly");
  const value = await tx.objectStore(DB_STORE_NAME).get(key);
  return value;
}

// Delete data from IndexedDB
export async function deleteFromDB(key: string): Promise<void> {
  const db = await dbPromise;
  const tx = db.transaction(DB_STORE_NAME, "readwrite");
  tx.objectStore(DB_STORE_NAME).delete(key);
  await tx.done;
}