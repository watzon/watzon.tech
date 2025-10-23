'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PhosphorColor = 'green' | 'cyan' | 'yellow' | 'white';

interface PhosphorColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  text: string;
  // Syntax highlighting variations
  keyword: string;
  string: string;
  comment: string;
  function: string;
  variable: string;
  number: string;
  operator: string;
  type: string;
}

export const PHOSPHOR_COLORS: Record<PhosphorColor, PhosphorColorConfig> = {
  green: {
    primary: '#22c55e', // green-500
    secondary: '#16a34a', // green-600
    accent: '#86efac', // green-300
    glow: 'rgba(34, 197, 94, 0.3)',
    text: '#4ade80', // green-400
    // Syntax highlighting
    keyword: '#fbbf24', // amber-400 - bold
    string: '#a3e635', // lime-400
    comment: '#6b7280', // gray-500 - italic
    function: '#60a5fa', // blue-400
    variable: '#34d399', // emerald-400
    number: '#f87171', // red-400
    operator: '#f472b6', // pink-400
    type: '#c084fc', // violet-400 - italic
  },
  cyan: {
    primary: '#06b6d4', // cyan-500
    secondary: '#0891b2', // cyan-600
    accent: '#67e8f9', // cyan-300
    glow: 'rgba(6, 182, 212, 0.3)',
    text: '#22d3ee', // cyan-400
    // Syntax highlighting
    keyword: '#fbbf24', // amber-400 - bold
    string: '#a3e635', // lime-400
    comment: '#6b7280', // gray-500 - italic
    function: '#93c5fd', // blue-300
    variable: '#2dd4bf', // teal-400
    number: '#f87171', // red-400
    operator: '#f9a8d4', // pink-300
    type: '#c4b5fd', // violet-300 - italic
  },
  yellow: {
    primary: '#eab308', // yellow-500
    secondary: '#ca8a04', // yellow-600
    accent: '#fde047', // yellow-300
    glow: 'rgba(234, 179, 8, 0.3)',
    text: '#facc15', // yellow-400
    // Syntax highlighting
    keyword: '#0ea5e9', // sky-500 - bold
    string: '#84cc16', // lime-500
    comment: '#6b7280', // gray-500 - italic
    function: '#3b82f6', // blue-500
    variable: '#10b981', // emerald-500
    number: '#ef4444', // red-500
    operator: '#ec4899', // pink-500
    type: '#8b5cf6', // violet-500 - italic
  },
  white: {
    primary: '#e5e5e5', // neutral-300
    secondary: '#d4d4d4', // neutral-400
    accent: '#f5f5f5', // neutral-100
    glow: 'rgba(229, 229, 229, 0.3)',
    text: '#fafafa', // neutral-50
    // Syntax highlighting
    keyword: '#0ea5e9', // sky-500 - bold
    string: '#84cc16', // lime-500
    comment: '#6b7280', // gray-500 - italic
    function: '#3b82f6', // blue-500
    variable: '#10b981', // emerald-500
    number: '#ef4444', // red-500
    operator: '#ec4899', // pink-500
    type: '#8b5cf6', // violet-500 - italic
  },
};

interface PhosphorContextType {
  phosphorColor: PhosphorColor;
  colorConfig: PhosphorColorConfig;
  setPhosphorColor: (color: PhosphorColor) => void;
}

const PhosphorContext = createContext<PhosphorContextType | undefined>(undefined);

export function PhosphorProvider({ children }: { children: ReactNode }) {
  const [phosphorColor, setPhosphorColorState] = useState<PhosphorColor>('green');

  // Load saved color preference from localStorage
  useEffect(() => {
    const savedColor = localStorage.getItem('phosphorColor') as PhosphorColor;
    if (savedColor && Object.keys(PHOSPHOR_COLORS).includes(savedColor)) {
      setPhosphorColorState(savedColor);
    }
  }, []);

  const setPhosphorColor = (color: PhosphorColor) => {
    setPhosphorColorState(color);
    localStorage.setItem('phosphorColor', color);

    // Update CSS variables for global use
    const root = document.documentElement;
    const config = PHOSPHOR_COLORS[color];

    root.style.setProperty('--phosphor-primary', config.primary);
    root.style.setProperty('--phosphor-secondary', config.secondary);
    root.style.setProperty('--phosphor-accent', config.accent);
    root.style.setProperty('--phosphor-glow', config.glow);
    root.style.setProperty('--phosphor-text', config.text);
    // Syntax highlighting variables
    root.style.setProperty('--phosphor-keyword', config.keyword);
    root.style.setProperty('--phosphor-string', config.string);
    root.style.setProperty('--phosphor-comment', config.comment);
    root.style.setProperty('--phosphor-function', config.function);
    root.style.setProperty('--phosphor-variable', config.variable);
    root.style.setProperty('--phosphor-number', config.number);
    root.style.setProperty('--phosphor-operator', config.operator);
    root.style.setProperty('--phosphor-type', config.type);

    // Set data attribute for CSS targeting
    document.body.setAttribute('data-phosphor-color', color);
  };

  // Apply initial color on mount
  useEffect(() => {
    setPhosphorColor(phosphorColor);
  }, [phosphorColor]);

  const contextValue: PhosphorContextType = {
    phosphorColor,
    colorConfig: PHOSPHOR_COLORS[phosphorColor],
    setPhosphorColor,
  };

  return (
    <PhosphorContext.Provider value={contextValue}>
      {children}
    </PhosphorContext.Provider>
  );
}

export function usePhosphorColor() {
  const context = useContext(PhosphorContext);
  if (context === undefined) {
    throw new Error('usePhosphorColor must be used within a PhosphorProvider');
  }
  return context;
}