import { useState } from "react";
import { useConnections } from "../hooks/useConnections";
import { ConnectionList } from "../components/connections/ConnectionList";
import { ConnectionForm } from "../components/connections/ConnectionForm";
import { createConnection } from "../services/connections";
import { useAuth } from "../context/AuthContext";

export const ConnectionsPage = () => {
  const { currentUser } = useAuth();
  const { connections, loading } = useConnections();
  const [creating, setCreating] = useState(false);

  const handleCreate = async (data: { name: string }) => {
    if (!currentUser) return;
    await createConnection(currentUser.uid, data);
    setCreating(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-on-surface">Conexões</h1>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 text-sm font-medium text-on-primary-container bg-primary rounded-md shadow-sm hover:bg-yellow-500"
          >
            Nova Conexão
          </button>
        )}
      </div>

      {creating && (
        <div className="mb-6">
          <ConnectionForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ConnectionList connections={connections} />
      )}
    </div>
  );
};
