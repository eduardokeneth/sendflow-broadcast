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
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Message, MessageFormData, MessageStatus } from "../types";

const COLLECTION = "messages";

export const createMessage = (
  userId: string,
  connectionId: string,
  data: MessageFormData,
) => {
  const isScheduled =
    data.scheduledAt !== null && data.scheduledAt > new Date();
  return addDoc(collection(db, COLLECTION), {
    userId,
    connectionId,
    contactIds: data.contactIds,
    content: data.content,
    status: isScheduled ? "scheduled" : "sent",
    scheduledAt: isScheduled ? Timestamp.fromDate(data.scheduledAt!) : null,
    sentAt: isScheduled ? null : serverTimestamp(),
    createdAt: serverTimestamp(),
  });
};

export const updateMessage = (id: string, data: Partial<MessageFormData>) =>
  updateDoc(doc(db, COLLECTION, id), {
    ...(data.content !== undefined && { content: data.content }),
    ...(data.contactIds !== undefined && { contactIds: data.contactIds }),
    ...(data.scheduledAt !== undefined && {
      scheduledAt: data.scheduledAt
        ? Timestamp.fromDate(data.scheduledAt)
        : null,
    }),
  });

export const deleteMessage = (id: string) => deleteDoc(doc(db, COLLECTION, id));

export const subscribeToMessages = (
  userId: string,
  connectionId: string,
  statusFilter: MessageStatus | "all",
  callback: (messages: Message[]) => void,
): Unsubscribe => {
  const constraints = [
    where("userId", "==", userId),
    where("connectionId", "==", connectionId),
    ...(statusFilter !== "all" ? [where("status", "==", statusFilter)] : []),
  ];
  const q = query(collection(db, COLLECTION), ...constraints);
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
    callback(
      messages.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)),
    );
  });
};
