'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  code: string;
  className?: string;
}

export function CopyButton({ code, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        absolute top-0 right-0
        flex items-center justify-center
        w-8 h-8
        bg-phosphor-primary/20
        border border-phosphor-primary/30
        rounded
        text-phosphor-primary
        hover:bg-phosphor-primary/30
        hover:border-phosphor-primary/50
        transition-all duration-200
        opacity-0 group-hover:opacity-100
        focus:opacity-100
        focus:outline-none
        focus:ring-2
        focus:ring-phosphor-primary/50
        ${className}
      `}
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}