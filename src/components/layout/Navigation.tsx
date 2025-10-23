'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SECTIONS } from '@/constants';
import SystemStatus from './SystemStatus';
import RotatingW3D from '@/components/ui/RotatingW3D';
import { useScrollPosition } from '@/hooks/useScrollPosition';

export default function Navigation() {
  const pathname = usePathname();
  const { isScrolled } = useScrollPosition();

  const getSectionFromPath = (path: string) => {
    if (path === '/') return 'HOME';
    const section = path.split('/')[1]?.toUpperCase();
    return SECTIONS.includes(section as typeof SECTIONS[number]) ? section : 'HOME';
  };

  const activeSection = getSectionFromPath(pathname);

  return (
    <nav className={`w-full md:bg-neutral-900/30 md:w-64 border-b md:border-b-0 md:border-r border-phosphor-primary/20 p-4 flex-shrink-0 md:flex md:flex-col md:h-full overflow-x-auto md:overflow-hidden transition-colors duration-200 ${
      isScrolled
        ? 'bg-neutral-900'
        : 'bg-neutral-900/30'
    }`}>
      <div className="flex md:flex-col gap-2 md:flex-1 md:overflow-y-auto md:min-h-0">
        <div className="hidden md:block mb-6">
          <div className="w-20 h-20 bg-phosphor-primary/10 border border-phosphor-primary/30 rounded-sm flex items-center justify-center overflow-hidden relative">
            <RotatingW3D size={64} />
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tighter text-phosphor-text glitch-static">WATZON</h1>
          <p className="text-xs opacity-60">Snr. Software Engineer</p>
        </div>

        <div className="text-xs opacity-40 mb-2 hidden md:block">-- NAVIGATION --</div>
        {SECTIONS.map((sec) => {
          const href = sec === 'HOME' ? '/' : `/${sec.toLowerCase()}`;
          const isActive = activeSection === sec;

          return (
            <Link
              key={sec}
              href={href}
              className={`relative text-left px-3 py-2 md:py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 group border-l-2 ${
                isActive
                  ? 'bg-phosphor-primary/10 text-phosphor-accent border-phosphor-primary'
                  : 'border-transparent hover:text-phosphor-primary hover:font-semibold text-phosphor-primary/60'
              }`}
            >
              <span className="flex items-center justify-between">
                <span>{sec}</span>
                {isActive && <ChevronRight size={14} className="animate-pulse" />}
              </span>
              {/* Hover glitch effect lines */}
              {!isActive && <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-80 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,var(--phosphor-glow)_2px,var(--phosphor-glow)_4px)]" />}
            </Link>
          );
        })}
      </div>

      <SystemStatus className='hidden md:block' />
    </nav>
  );
}