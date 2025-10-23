import React from 'react';

interface TerminalButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export default function TerminalButton({ icon, label, onClick }: TerminalButtonProps) {
    return (
        <button
          onClick={onClick}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-phosphor-primary/30 hover:border-phosphor-primary hover:bg-phosphor-primary/10 transition-all text-xs font-bold"
        >
            {icon}
            <span>{label}</span>
        </button>
    )
}