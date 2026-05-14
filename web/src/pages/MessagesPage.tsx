import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMessages } from "../hooks/useMessages";
import { useContacts } from "../hooks/useContacts";
import { MessageList } from "../components/messages/MessageList";
import { MessageForm } from "../components/messages/MessageForm";
import { MessageFilters } from "../components/messages/MessageFilters";
import { createMessage } from "../services/messages";
import { useAuth } from "../context/AuthContext";
import type { MessageStatus, MessageFormData } from "../types";

type FilterValue = MessageStatus | "all";

export const MessagesPage = () => {
  const { connectionId = "" } = useParams<{ connectionId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterValue>("all");
  const { messages, loading: loadingMessages } = useMessages(connectionId, filter);
  const { contacts, loading: loadingContacts } = useContacts(connectionId);
  const [creating, setCreating] = useState(false);

  const handleCreate = async (data: MessageFormData) => {
    if (!currentUser) return;
    await createMessage(currentUser.uid, connectionId, data);
    setCreating(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/connections")} className="p-2 rounded-full hover:bg-surface-container">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-on-surface">Mensagens</h1>
        </div>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 text-sm font-medium text-on-primary-container bg-primary rounded-md shadow-sm hover:bg-yellow-500"
          >
            Nova Mensagem
          </button>
        )}
      </div>

      {creating && (
        <div className="mb-6">
          <MessageForm
            contacts={contacts}
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      <div className="mb-4">
        <MessageFilters value={filter} onChange={setFilter} />
      </div>

      {loadingMessages || loadingContacts ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <MessageList messages={messages} contacts={contacts} />
      )}
    </div>
  );
};
