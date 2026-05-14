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
import type { Contact, ContactFormData } from "../types";

const COLLECTION = "contacts";

export const createContact = (
  userId: string,
  connectionId: string,
  data: ContactFormData,
) =>
  addDoc(collection(db, COLLECTION), {
    userId,
    connectionId,
    name: data.name,
    phone: data.phone,
    createdAt: serverTimestamp(),
  });

export const updateContact = (id: string, data: ContactFormData) =>
  updateDoc(doc(db, COLLECTION, id), { name: data.name, phone: data.phone });

export const deleteContact = (id: string) => deleteDoc(doc(db, COLLECTION, id));

export const subscribeToContacts = (
  userId: string,
  connectionId: string,
  callback: (contacts: Contact[]) => void,
): Unsubscribe => {
  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    where("connectionId", "==", connectionId),
  );
  return onSnapshot(q, (snapshot) => {
    const contacts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Contact[];
    callback(contacts);
  });
};
