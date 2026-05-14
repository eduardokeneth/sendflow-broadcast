import { useState, useEffect } from "react";
import { subscribeToContacts } from "../services/contacts";
import type { Contact } from "../types";
import { useAuth } from "../context/AuthContext";

export const useContacts = (connectionId: string) => {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !connectionId) return;
    const unsubscribe = subscribeToContacts(
      currentUser.uid,
      connectionId,
      (data) => {
        setContacts(data);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [currentUser, connectionId]);

  return { contacts, loading };
};
