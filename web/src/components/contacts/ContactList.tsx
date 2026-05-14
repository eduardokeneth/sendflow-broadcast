import { useState } from "react";
import type { Contact, ContactFormData } from "../../types";
import { ContactForm } from "./ContactForm";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { updateContact, deleteContact } from "../../services/contacts";

type Props = { contacts: Contact[] };

export const ContactList = ({ contacts }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpdate = async (id: string, data: ContactFormData) => {
    await updateContact(id, data);
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deleteContact(deletingId);
    setDeletingId(null);
  };

  if (contacts.length === 0) {
    return <p className="text-on-surface-variant mt-4">Nenhum contato cadastrado.</p>;
  }

  return (
    <>
      <div className="space-y-4">
        {contacts.map((contact) =>
          editingId === contact.id ? (
            <ContactForm
              key={contact.id}
              initial={contact}
              onSubmit={(data) => handleUpdate(contact.id, data)}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div key={contact.id} className="bg-surface-container-low p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <p className="font-semibold text-on-surface">{contact.name}</p>
                <p className="text-sm text-on-surface-variant">{contact.phone}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(contact.id)}
                  className="p-2 rounded-full hover:bg-surface-container"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeletingId(contact.id)}
                  className="p-2 rounded-full hover:bg-surface-container text-error"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <ConfirmDialog
        open={!!deletingId}
        title="Excluir contato"
        description="Tem certeza que deseja excluir este contato?"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </>
  );
};
