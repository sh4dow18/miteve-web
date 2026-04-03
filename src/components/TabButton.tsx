// components/TabButton.tsx

import React from "react";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function TabButton({ active, onClick, icon, label }: TabButtonProps) {
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
