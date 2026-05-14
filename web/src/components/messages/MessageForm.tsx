import { useState, type FormEvent, useRef } from "react";
import type { Contact, Message, MessageFormData } from "../../types";

type Props = {
  contacts: Contact[];
  initial?: Message;
  onSubmit: (data: MessageFormData) => Promise<void>;
  onCancel: () => void;
};

const formatDateTimeLocal = (date: Date | null): string => {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const MessageForm = ({
  contacts,
  initial,
  onSubmit,
  onCancel,
}: Props) => {
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(
    initial?.contactIds ?? [],
  );
  const [content, setContent] = useState(initial?.content ?? "");
  const [scheduledAt, setScheduledAt] = useState<Date | null>(
    initial?.scheduledAt?.toDate() ?? null,
  );
  const scheduledAtRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || selectedContactIds.length === 0) return;
    setLoading(true);
    try {
      await onSubmit({
        contactIds: selectedContactIds,
        content: content.trim(),
        scheduledAt,
      });
    } finally {
      setLoading(false);
    }
  };

  const contactMap = Object.fromEntries(contacts.map((c) => [c.id, c.name]));

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-surface-container rounded-lg"
    >
      <h3 className="text-lg font-semibold text-on-surface mb-4">
        {initial ? "Editar Mensagem" : "Nova Mensagem"}
      </h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label
            htmlFor="contacts"
            className="block text-sm font-medium text-on-surface-variant mb-1"
          >
            Contatos
          </label>
          <div className="flex flex-wrap gap-2">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`contact-${contact.id}`}
                  value={contact.id}
                  checked={selectedContactIds.includes(contact.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedContactIds([
                        ...selectedContactIds,
                        contact.id,
                      ]);
                    } else {
                      setSelectedContactIds(
                        selectedContactIds.filter((id) => id !== contact.id),
                      );
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`contact-${contact.id}`}>{contact.name}</label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-on-surface-variant mb-1"
          >
            Mensagem
          </label>
          <textarea
            id="content"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label
            htmlFor="scheduledAt"
            className="block text-sm font-medium text-on-surface-variant mb-1"
          >
            Agendar para (opcional)
          </label>
          <div
            className="relative"
            onClick={() => scheduledAtRef.current?.showPicker()}
          >
            <input
              id="scheduledAt"
              ref={scheduledAtRef}
              type="datetime-local"
              value={formatDateTimeLocal(scheduledAt)}
              onChange={(e) =>
                setScheduledAt(e.target.value ? new Date(e.target.value) : null)
              }
              min={formatDateTimeLocal(new Date())}
              className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container rounded-md hover:bg-surface-container-high"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-on-primary-container bg-primary rounded-md shadow-sm hover:bg-yellow-500 disabled:opacity-50"
        >
          {loading ? "Salvando..." : initial ? "Atualizar" : "Enviar"}
        </button>
      </div>
    </form>
  );
};
