import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Connection, ConnectionFormData } from "../types";

const COLLECTION = "connections";

export const createConnection = (userId: string, data: ConnectionFormData) =>
  addDoc(collection(db, COLLECTION), {
    userId,
    name: data.name,
    createdAt: serverTimestamp(),
  });

export const updateConnection = (id: string, data: ConnectionFormData) =>
  updateDoc(doc(db, COLLECTION, id), { name: data.name });

export const deleteConnection = (id: string) =>
  deleteDoc(doc(db, COLLECTION, id));

export const subscribeToConnections = (
  userId: string,
  callback: (connections: Connection[]) => void,
): Unsubscribe => {
  const q = query(collection(db, COLLECTION), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const connections = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Connection[];
    callback(connections);
  });
};
