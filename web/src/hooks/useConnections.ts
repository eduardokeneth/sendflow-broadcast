import { useState, useEffect } from "react";
import { subscribeToConnections } from "../services/connections";
import type { Connection } from "../types";
import { useAuth } from "../context/AuthContext";

export const useConnections = () => {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToConnections(currentUser.uid, (data) => {
      setConnections(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [currentUser]);

  return { connections, loading };
};
