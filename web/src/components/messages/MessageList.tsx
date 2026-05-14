import { useState } from "react";
import type { Message, MessageFormData, Contact } from "../../types";
import { MessageForm } from "./MessageForm";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { updateMessage, deleteMessage } from "../../services/messages";

type Props = { messages: Message[]; contacts: Contact[] };

const formatDate = (ts: any | null) => {
  if (!ts) return "";
  return ts.toDate().toLocaleString("pt-BR");
};

export const MessageList = ({ messages, contacts }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const contactMap = Object.fromEntries(contacts.map((c) => [c.id, c.name]));

  const handleUpdate = async (id: string, data: MessageFormData) => {
    await updateMessage(id, data);
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteMessage(deletingId);
    setDeletingId(null);
  };

  if (messages.length === 0) {
    return <p className="text-on-surface-variant mt-4">Nenhuma mensagem encontrada.</p>;
  }

  return (
    <>
      <div className="space-y-4">
        {messages.map((msg) =>
          editingId === msg.id ? (
            <MessageForm
              key={msg.id}
              contacts={contacts}
              initial={msg}
              onSubmit={(data) => handleUpdate(msg.id, data)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={msg.id} className="bg-surface-container-low p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        msg.status === "sent"
                          ? "bg-success-green/20 text-success-green"
                          : "bg-tertiary-container text-on-tertiary-container"
                      }`}
                    >
                      {msg.status === "sent" ? "Enviada" : "Agendada"}
                    </span>
                    <p className="text-sm text-on-surface-variant">
                      {msg.status === "sent"
                        ? `Enviada: ${formatDate(msg.sentAt)}`
                        : `Agendada: ${formatDate(msg.scheduledAt)}`}
                    </p>
                  </div>
                  <p className="text-on-surface mb-1">{msg.content}</p>
                  <p className="text-sm text-on-surface-variant">
                    Contatos: {msg.contactIds.map((id) => contactMap[id] ?? id).join(", ")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(msg.id)}
                    className="p-2 rounded-full hover:bg-surface-container"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  </button>
                  <button
                    onClick={() => setDeletingId(msg.id)}
                    className="p-2 rounded-full hover:bg-surface-container text-error"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <ConfirmDialog
        open={!!deletingId}
        title="Excluir mensagem"
        description="Tem certeza que deseja excluir esta mensagem?"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
};
