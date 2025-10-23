'use client';

import { useState, useEffect } from 'react';

export function useSystemStats() {
  const [cpuUsage, setCpuUsage] = useState(12);
  const [memoryUsage, setMemoryUsage] = useState(50);

  // System monitoring with realistic fluctuations
  useEffect(() => {
    const updateSystemStats = () => {
      // Realistic CPU usage: 8-25% with gradual changes
      setCpuUsage(prev => {
        const change = (Math.random() - 0.5) * 4; // +/- 2% change
        const newValue = prev + change;
        return Math.max(8, Math.min(25, newValue));
      });

      // Realistic memory usage: 45-60% with gradual changes
      setMemoryUsage(prev => {
        const change = (Math.random() - 0.5) * 2; // +/- 1% change
        const newValue = prev + change;
        return Math.max(45, Math.min(60, newValue));
      });
    };

    const interval = setInterval(updateSystemStats, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return { cpuUsage, memoryUsage };
}