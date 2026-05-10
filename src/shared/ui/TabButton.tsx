import type { ReactNode } from "react";

interface Props {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}

export function TabButton({ active, onClick, icon, label }: Props) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
        active
          ? "border-red-600 text-white"
          : "border-transparent text-gray-400 hover:text-white"
      }`}
      tabIndex={0}
    >
      <div className="flex items-center gap-2">
        {icon}
        {label}
      </div>
    </button>
  );
}
