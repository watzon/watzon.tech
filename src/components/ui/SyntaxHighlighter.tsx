'use client';

import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import { CopyButton } from './CopyButton';
import '@/styles/phosphor-highlight.css';

interface SyntaxHighlighterProps {
  children: string;
  language?: string;
  className?: string;
}

export function SyntaxHighlighter({ children, language = 'text', className = '' }: SyntaxHighlighterProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current && language && language !== 'text') {
      hljs.highlightElement(codeRef.current);
    }
  }, [children, language]);

  const languageClass = language && language !== 'text' ? `language-${language}` : '';

  return (
    <div className="relative group">
      <code
        ref={codeRef}
        className={`block font-mono text-sm hljs ${languageClass} ${className}`}
      >
        {children}
      </code>
      <CopyButton code={children.toString()} />
    </div>
  );
}