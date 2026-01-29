import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-nav-toggle"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <>
          <div 
            className="mobile-nav-overlay" 
            onClick={() => setIsOpen(false)}
          />
          <div className="mobile-nav-drawer">
            <nav className="mobile-nav-links">
              <a href="/" onClick={() => setIsOpen(false)}>Home</a>
              <a href="/blog" onClick={() => setIsOpen(false)}>Blog</a>
              <a href="/experiments" onClick={() => setIsOpen(false)}>Experiments</a>
            </nav>
          </div>
        </>
      )}

      <style>{`
        .mobile-nav-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 0.5rem;
          margin-left: 0.5rem;
        }

        @media (max-width: 768px) {
          .mobile-nav-toggle {
            display: block;
          }
        }

        .mobile-nav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mobile-nav-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 280px;
          background: var(--surface);
          border-left: 1px solid var(--border);
          z-index: 999;
          padding: 2rem;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .mobile-nav-links a {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--text);
          text-decoration: none;
          transition: color 0.2s;
        }

        .mobile-nav-links a:hover {
          color: var(--accent);
        }
      `}</style>
    </>
  );
}
