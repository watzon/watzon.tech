'use client';

import { motion } from 'framer-motion';
import { useSystemStats } from '@/hooks/useSystemStats';

export default function SystemStatus({ className = "" }: { className?: string }) {
  const { cpuUsage, memoryUsage } = useSystemStats();

  return (
    <div className={`flex flex-col gap-3 text-xs mt-auto pt-6 border-t border-phosphor-primary/20 opacity-60 ${className}`}>
      <div className="flex justify-between">
        <span>CPU USAGE</span>
        <span>{Math.round(cpuUsage)}%</span>
      </div>
      <div className="w-full bg-phosphor-primary/20 h-1.5">
        <motion.div
          className="bg-phosphor-primary h-full"
          initial={{ width: `${cpuUsage}%` }}
          animate={{ width: `${cpuUsage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span>MEMORY</span>
        <span>{Math.round(memoryUsage * 1.28)}GB / 128GB</span>
      </div>
      <div className="w-full bg-phosphor-primary/20 h-1.5">
        <motion.div
          className="bg-phosphor-primary h-full"
          initial={{ width: `${memoryUsage}%` }}
          animate={{ width: `${memoryUsage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}