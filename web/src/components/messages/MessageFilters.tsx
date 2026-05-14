import type { MessageStatus } from "../../types";

type FilterValue = MessageStatus | "all";

type Props = {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
};

export const MessageFilters = ({ value, onChange }: Props) => (
  <div className="flex gap-2">
    {(["all", "scheduled", "sent"] as const).map((filter) => (
      <button
        key={filter}
        onClick={() => onChange(filter)}
        className={`px-3 py-1 text-sm font-medium rounded-full ${
          value === filter
            ? "bg-primary text-white"
            : "bg-surface-container text-on-surface-variant"
        }`}
      >
        {filter === "all" ? "Todas" : filter === "scheduled" ? "Agendadas" : "Enviadas"}
      </button>
    ))}
  </div>
);
