import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { Timestamp } from "firebase-admin/firestore";

admin.initializeApp();

const db = admin.firestore();

export const dispatchScheduledMessages = onSchedule(
  "every 1 minutes",
  async () => {
    const now = Timestamp.now();

    const snapshot = await db
      .collection("messages")
      .where("status", "==", "scheduled")
      .where("scheduledAt", "<=", now)
      .get();

    if (snapshot.empty) return;

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: "sent",
        sentAt: now,
      });
    });

    await batch.commit();
    console.log(`Dispatched ${snapshot.size} scheduled message(s)`);
  },
);
