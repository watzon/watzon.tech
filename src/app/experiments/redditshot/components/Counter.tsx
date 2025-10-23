'use client';

import { Minus, Plus } from 'lucide-react';

interface CounterProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  labelClass?: string;
  className?: string;
}

export default function Counter({
  value,
  min,
  max,
  onChange,
  label,
  labelClass = '',
  className = ''
}: CounterProps) {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {label && <label className={labelClass}>{label}</label>}

      <div className="flex items-center border border-phosphor-primary/30 rounded-md overflow-hidden">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          className="p-1 text-phosphor-primary hover:bg-phosphor-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease"
        >
          <Minus size={16} />
        </button>

        <span className="px-3 py-1 text-sm font-medium text-phosphor-primary min-w-[3rem] text-center">
          {value}
        </span>

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          className="p-1 text-phosphor-primary hover:bg-phosphor-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}