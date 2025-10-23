import React from 'react';
import { SyntaxHighlighter } from './SyntaxHighlighter';

// Terminal-styled MDX components that respect phosphor color system
export const mdxComponents = {
  // Text elements
  h1: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold text-phosphor-primary mb-4 mt-6 font-mono" {...props}>
      {children}
    </h1>
  ),

  h2: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold text-phosphor-primary mb-3 mt-5 font-mono" {...props}>
      {children}
    </h2>
  ),

  h3: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => (
    <h3 className="text-xl font-bold text-phosphor-primary mb-2 mt-4 font-mono" {...props}>
      {children}
    </h3>
  ),

  p: ({ children, ...props }: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="text-phosphor-text mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),

  a: ({ children, href, ...props }: React.HTMLProps<HTMLAnchorElement>) => (
    <a
      href={href}
      className="text-phosphor-accent underline hover:bg-phosphor-primary/10 transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),

  // List elements
  ul: ({ children, ...props }: React.HTMLProps<HTMLUListElement>) => (
    <ul className="list-disc list-inside mb-4 space-y-1 text-phosphor-text" {...props}>
      {children}
    </ul>
  ),

  ol: ({ children, ...props }: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside mb-4 space-y-1 text-phosphor-text" {...props}>
      {children}
    </ol>
  ),

  li: ({ children, ...props }: React.HTMLProps<HTMLLIElement>) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),

  // Emphasis elements
  strong: ({ children, ...props }: React.HTMLProps<HTMLSpanElement>) => (
    <strong className="font-bold text-phosphor-primary" {...props}>
      {children}
    </strong>
  ),

  em: ({ children, ...props }: React.HTMLProps<HTMLElement>) => (
    <em className="italic text-phosphor-accent" {...props}>
      {children}
    </em>
  ),

  // Code elements
  code: ({ children, className, ...props }: React.HTMLProps<HTMLElement>) => {
    const isInline = !className;

    if (isInline) {
      return (
        <code className="bg-phosphor-primary/10 text-phosphor-accent px-1 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }

    // Extract language from className (e.g., "language-javascript" -> "javascript")
    const languageMatch = className?.match(/language-(\w+)/);
    const language = languageMatch ? languageMatch[1] : 'text';

    return (
      <SyntaxHighlighter language={language} className={className || ''}>
        {children?.toString() || ''}
      </SyntaxHighlighter>
    );
  },

  pre: ({ children, ...props }: React.HTMLProps<HTMLPreElement>) => (
    <pre className="bg-phosphor-primary/10 border border-phosphor-primary/30 p-4 rounded overflow-x-auto font-mono text-sm text-phosphor-text" {...props}>
      {children}
    </pre>
  ),

  // Block elements
  blockquote: ({ children, ...props }: React.HTMLProps<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-phosphor-primary/50 pl-4 py-2 my-4 bg-phosphor-primary/5 italic text-phosphor-secondary" {...props}>
      {children}
    </blockquote>
  ),

  hr: ({ ...props }: React.HTMLProps<HTMLHRElement>) => (
    <hr className="border-phosphor-primary/20 my-6" {...props} />
  ),

  // Table elements
  table: ({ children, ...props }: React.HTMLProps<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse border border-phosphor-primary/30" {...props}>
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
    <thead className="bg-phosphor-primary/10" {...props}>
      {children}
    </thead>
  ),

  tbody: ({ children, ...props }: React.HTMLProps<HTMLTableSectionElement>) => (
    <tbody {...props}>
      {children}
    </tbody>
  ),

  tr: ({ children, ...props }: React.HTMLProps<HTMLTableRowElement>) => (
    <tr className="border-b border-phosphor-primary/10 hover:bg-phosphor-primary/5" {...props}>
      {children}
    </tr>
  ),

  th: ({ children, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
    <th className="border border-phosphor-primary/20 px-4 py-2 text-left font-bold text-phosphor-primary font-mono" {...props}>
      {children}
    </th>
  ),

  td: ({ children, ...props }: React.HTMLProps<HTMLTableCellElement>) => (
    <td className="border border-phosphor-primary/20 px-4 py-2 text-phosphor-text font-mono" {...props}>
      {children}
    </td>
  ),
};

export default mdxComponents;