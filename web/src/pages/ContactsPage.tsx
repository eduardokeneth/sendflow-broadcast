import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContacts } from "../hooks/useContacts";
import { ContactList } from "../components/contacts/ContactList";
import { ContactForm } from "../components/contacts/ContactForm";
import { createContact } from "../services/contacts";
import { useAuth } from "../context/AuthContext";

export const ContactsPage = () => {
  const { connectionId = "" } = useParams<{ connectionId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { contacts, loading } = useContacts(connectionId);
  const [creating, setCreating] = useState(false);

  const handleCreate = async (data: { name: string; phone: string }) => {
    if (!currentUser) return;
    await createContact(currentUser.uid, connectionId, data);
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
          <h1 className="text-3xl font-bold text-on-surface">Contatos</h1>
        </div>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 text-sm font-medium text-on-primary-container bg-primary rounded-md shadow-sm hover:bg-yellow-500"
          >
            Novo Contato
          </button>
        )}
      </div>

      {creating && (
        <div className="mb-6">
          <ContactForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ContactList contacts={contacts} />
      )}
    </div>
  );
};
