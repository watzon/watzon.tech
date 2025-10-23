'use client';

import { useState } from 'react';
import StatusBar from './StatusBar';
import Navigation from './Navigation';
import CRTShader from './CRTShader';
import BootScreen from './BootScreen';
import { useBootState } from '@/hooks/useBootState';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [crtShaderEnabled, setCrtShaderEnabled] = useState(true);
  const { isBooting, isHydrated } = useBootState();

  // Show loading screen during hydration to prevent flash
  if (!isHydrated) {
    return (
      <div className="fixed inset-0 bg-neutral-950 text-phosphor-primary font-mono flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-pulse">LOADING...</div>
        </div>
      </div>
    );
  }

  if (isBooting) {
    return <BootScreen />;
  }

  return (
    <div className="h-screen bg-neutral-950 text-phosphor-primary font-mono selection:bg-phosphor-primary/30 selection:text-phosphor-accent overflow-hidden">
      {/* CRT Overlay Effects */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_1px,transparent_1px,transparent_3px)] bg-[size:100%_3px] mix-blend-overlay opacity-50"></div>
      <div className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,10,0,0.4)_100%)]"></div>

      {/* TOP STATUS BAR - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <StatusBar
          crtShaderEnabled={crtShaderEnabled}
          onToggleCRT={() => setCrtShaderEnabled(!crtShaderEnabled)}
        />
      </div>

      {/* SIDE NAVIGATION - Fixed */}
      <div className="fixed left-0 top-[43px] bottom-0 z-30 hidden md:block">
        <Navigation />
      </div>

      {/* CONTENT AREA - Scrollable */}
      <div className="pt-[130px] pb-[30px] md:pt-[80px] md:pl-64 h-screen overflow-y-auto">
        <div className="relative p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </div>

      {/* Mobile Navigation - Top nav */}
      <div className="fixed top-[43px] left-0 right-0 z-30 md:hidden">
        <Navigation />
      </div>

      {/* CRT Shader Overlay */}
      <CRTShader enabled={crtShaderEnabled} />
    </div>
  );
}