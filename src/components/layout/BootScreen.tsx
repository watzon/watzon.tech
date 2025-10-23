'use client';

import { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';

export default function BootScreen() {
  const [lines, setLines] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
      // Mark as ready after a brief delay to ensure smooth animation
      const readyTimer = setTimeout(() => {
        setIsReady(true);
      }, 100);

      const bootText = [
          "INITIALIZING WATZON_OS KERNEL...",
          "LOADING MEMORY MODULES... OK",
          "MOUNTING VIRTUAL FILESYSTEM... OK",
          "CONNECTING TO NEURAL NET... OK",
          "LOADING EXPERIENCE DB (15 YEARS)...",
          "ACCESS GRANTED.",
          "WELCOME, USER."
      ];

      const timeouts: NodeJS.Timeout[] = [];

      bootText.forEach((line, i) => {
          const delay = i * 150;
          // Add extra delay for the final message to ensure it's visible
          const finalDelay = i === bootText.length - 1 ? delay + 500 : delay;
          const timeout = setTimeout(() => {
              setLines(prev => [...prev, line]);
          }, finalDelay);
          timeouts.push(timeout);
      });

      return () => {
        clearTimeout(readyTimer);
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
  }, []);

  return (
      <div className={`fixed inset-0 bg-neutral-950 text-phosphor-primary font-mono p-8 flex flex-col justify-end z-50 transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mb-4">
             <Cpu size={48} className="animate-pulse text-phosphor-secondary mb-4" />
             <h1 className="text-4xl font-bold mb-8">WATZON</h1>
          </div>
          <div className="space-y-2">
              {lines.map((line, i) => (
                  <div key={`${line}-${i}`} className="text-sm md:text-base">{'> '} {line}</div>
              ))}
              <div className="text-sm md:text-base animate-pulse">{'> _'}</div>
          </div>
      </div>
  )
}