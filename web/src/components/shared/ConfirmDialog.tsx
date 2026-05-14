type Props = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({ open, title, description, onConfirm, onCancel }: Props) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-on-surface mb-4">{title}</h2>
        <p className="text-on-surface-variant mb-6">{description}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-on-surface-variant bg-surface-container hover:bg-surface-container-high"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-white bg-error hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
