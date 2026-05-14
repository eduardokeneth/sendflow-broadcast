import { useState, type FormEvent } from "react";
import type { Contact, ContactFormData } from "../../types";

type Props = {
  initial?: Contact;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
};

export const ContactForm = ({ initial, onSubmit, onCancel }: Props) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), phone: phone.trim() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-surface-container rounded-lg">
      <h3 className="text-lg font-semibold text-on-surface mb-4">
        {initial ? "Editar Contato" : "Novo Contato"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-on-surface-variant mb-1">
            Nome
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-on-surface-variant mb-1">
            Telefone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="+55 11 99999-9999"
            className="w-full px-3 py-2 bg-surface border border-border-subtle rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
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
          {loading ? "Salvando..." : initial ? "Atualizar" : "Criar"}
        </button>
      </div>
    </form>
  );
};
