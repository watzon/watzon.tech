'use client';

import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { usePhosphorColor, PhosphorColor, PHOSPHOR_COLORS } from '@/contexts/PhosphorContext';

interface ColorOption {
  value: PhosphorColor;
  label: string;
  preview: string;
}

const colorOptions: ColorOption[] = [
  { value: 'green', label: 'GRN', preview: PHOSPHOR_COLORS.green.primary },
  { value: 'cyan', label: 'CYN', preview: PHOSPHOR_COLORS.cyan.primary },
  { value: 'yellow', label: 'YEL', preview: PHOSPHOR_COLORS.yellow.primary },
  { value: 'white', label: 'WHT', preview: PHOSPHOR_COLORS.white.primary },
];

export function PhosphorColorPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const { phosphorColor, setPhosphorColor } = usePhosphorColor();

  const handleColorSelect = (color: PhosphorColor) => {
    setPhosphorColor(color);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-1 px-2 py-1 border rounded
          transition-all duration-200
          ${isOpen
            ? 'bg-phosphor-primary/20 border-phosphor-primary text-phosphor-text'
            : 'border-phosphor-primary/30 hover:border-phosphor-primary hover:bg-phosphor-primary/10'
          }
        `}
        style={{
          borderColor: isOpen ? PHOSPHOR_COLORS[phosphorColor].primary : undefined,
        }}
      >
        <Palette size={12} />
        <span className="text-xs font-mono uppercase tracking-wider">
          {colorOptions.find(opt => opt.value === phosphorColor)?.label}
        </span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Color options */}
          <div className="
            absolute top-full right-0 mt-1 z-50
            bg-neutral-900 border border-phosphor-primary/30 rounded
            shadow-lg backdrop-blur
            min-w-[120px]
          ">
            <div className="p-1">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleColorSelect(option.value)}
                  className={`
                    w-full flex items-center gap-2 px-2 py-1.5 rounded
                    text-xs font-mono uppercase tracking-wider
                    transition-all duration-150
                    ${phosphorColor === option.value
                      ? 'bg-phosphor-primary/20 text-phosphor-text'
                      : 'hover:bg-phosphor-primary/10 text-neutral-400 hover:text-phosphor-text'
                    }
                  `}
                  style={{
                    backgroundColor: phosphorColor === option.value
                      ? `${option.preview}20`
                      : undefined,
                  }}
                >
                  {/* Color preview circle */}
                  <div
                    className="w-2 h-2 rounded-full border border-current/30"
                    style={{ backgroundColor: option.preview }}
                  />
                  <span>{option.label}</span>

                  {/* Active indicator */}
                  {phosphorColor === option.value && (
                    <div className="ml-auto">
                      <div
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: option.preview }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}