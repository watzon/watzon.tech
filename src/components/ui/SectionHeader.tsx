import React from 'react';

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
}

export default function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8 md:mb-12 pb-4 border-b border-phosphor-secondary/30">
       <span className="p-2 bg-phosphor-primary/10 border border-phosphor-primary/30 rounded-sm text-phosphor-accent">
         {icon}
       </span>
       <h2 className="text-2xl md:text-4xl font-black tracking-tight">{title}</h2>
    </div>
  );
}