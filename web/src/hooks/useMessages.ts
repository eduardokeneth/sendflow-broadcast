import { useState, useEffect } from "react";
import { subscribeToMessages } from "../services/messages";
import type { Message, MessageStatus } from "../types";
import { useAuth } from "../context/AuthContext";

export const useMessages = (
  connectionId: string,
  statusFilter: MessageStatus | "all",
) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !connectionId) return;
    setLoading(true);
    const unsubscribe = subscribeToMessages(
      currentUser.uid,
      connectionId,
      statusFilter,
      (data) => {
        setMessages(data);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [currentUser, connectionId, statusFilter]);

  return { messages, loading };
};
