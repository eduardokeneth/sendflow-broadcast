import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Connection, ConnectionFormData } from "../../types";
import { ConnectionForm } from "./ConnectionForm";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { updateConnection, deleteConnection } from "../../services/connections";

type Props = { connections: Connection[] };

export const ConnectionList = ({ connections }: Props) => {
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpdate = async (id: string, data: ConnectionFormData) => {
    await updateConnection(id, data);
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteConnection(deletingId);
    setDeletingId(null);
  };

  if (connections.length === 0) {
    return (
      <p className="text-on-surface-variant mt-4">
        Nenhuma conexão cadastrada.
      </p>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {connections.map((conn) =>
          editingId === conn.id ? (
            <ConnectionForm
              key={conn.id}
              initial={conn}
              onSubmit={(data) => handleUpdate(conn.id, data)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div
              key={conn.id}
              className="bg-surface-container-low p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-on-surface">{conn.name}</p>
                <span className="text-sm text-on-surface-variant">
                  {conn.status === "connected" ? "Conectado" : "Desconectado"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/connections/${conn.id}/contacts`)}
                  className="p-2 rounded-full hover:bg-surface-container"
                  title="Contatos"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate(`/connections/${conn.id}/messages`)}
                  className="p-2 rounded-full hover:bg-surface-container"
                  title="Mensagens"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                <button
                  onClick={() => setEditingId(conn.id)}
                  className="p-2 rounded-full hover:bg-surface-container"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeletingId(conn.id)}
                  className="p-2 rounded-full hover:bg-surface-container text-error"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      <ConfirmDialog
        open={!!deletingId}
        title="Excluir conexão"
        description="Tem certeza que deseja excluir esta conexão?"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
};
