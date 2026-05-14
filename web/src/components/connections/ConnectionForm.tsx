import { useState, type FormEvent } from "react";
import type { Connection, ConnectionFormData } from "../../types";

type Props = {
  initial?: Connection;
  onSubmit: (data: ConnectionFormData) => Promise<void>;
  onCancel: () => void;
};

export const ConnectionForm = ({ initial, onSubmit, onCancel }: Props) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onSubmit({ name: name.trim() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-surface-container rounded-lg">
      <h3 className="text-lg font-semibold text-on-surface mb-4">
        {initial ? "Editar Conexão" : "Nova Conexão"}
      </h3>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-on-surface-variant mb-1">
          Nome da conexão
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
