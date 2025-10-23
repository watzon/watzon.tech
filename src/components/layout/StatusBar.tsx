'use client';

import { useState, useEffect } from 'react';
import {
  Terminal,
  Monitor
} from 'lucide-react';
import { PhosphorColorPicker } from '@/components/ui/PhosphorColorPicker';
import { usePhosphorColor } from '@/contexts/PhosphorContext';

// Calculate uptime since April 20, 1993
function calculateUptime(): string {
  const birthday = new Date('1993-04-20');
  const now = new Date();

  const years = now.getFullYear() - birthday.getFullYear();
  const months = now.getMonth() - birthday.getMonth();
  const days = now.getDate() - birthday.getDate();

  let yearCount = years;
  let monthCount = months;
  let dayCount = days;

  if (monthCount < 0) {
    yearCount--;
    monthCount += 12;
  }

  if (dayCount < 0) {
    monthCount--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    dayCount += lastMonth.getDate();
  }

  return `${yearCount}Y ${monthCount}M ${dayCount}D`;
}

interface StatusBarProps {
  crtShaderEnabled: boolean;
  onToggleCRT: () => void;
}

export default function StatusBar({ crtShaderEnabled, onToggleCRT }: StatusBarProps) {
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState<string>('');
  usePhosphorColor(); // Use the context to trigger re-renders when color changes

  // Clock and uptime update
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setUptime(calculateUptime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-phosphor-primary/20 bg-neutral-950/80 backdrop-blur text-xs uppercase tracking-widest sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-phosphor-text animate-pulse" />
          <span className="font-bold text-phosphor-text">WATZON_OS v2.2</span>
        </div>
        <span className="hidden md:inline opacity-50">|</span>
        <span className="hidden md:inline opacity-70">UPTIME: {uptime}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="opacity-70">{time.toLocaleTimeString([], { hour12: false })}</span>
        <PhosphorColorPicker />
        <button
          onClick={onToggleCRT}
          className={`flex items-center gap-1 px-2 text-xs font-bold transition-all h-6 ${
            crtShaderEnabled
              ? 'bg-phosphor-primary/20 text-phosphor-accent border border-phosphor-primary/50'
              : 'opacity-60 hover:opacity-80'
          }`}
        >
          <Monitor size={14} />
          <span className="hidden sm:inline">CRT</span>
        </button>
      </div>
    </header>
  );
}