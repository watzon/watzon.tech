import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme") as Theme | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme = stored ?? (systemPrefersDark ? "dark" : "light");
    setTheme(initialTheme);
    root.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === "light" ? "dark" : "light";
    
    // Get button center for ripple origin
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const root = document.documentElement;
    root.style.setProperty("--tx", `${x}px`);
    root.style.setProperty("--ty", `${y}px`);

    if (!document.startViewTransition) {
      root.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      setTheme(newTheme);
      return;
    }

    document.startViewTransition(() => {
      root.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    });
  }, [theme]);

  return (
    <>
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        <span className="sr-only">
          Switch to {theme === "light" ? "dark" : "light"} mode
        </span>

        {theme === "light" ? (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        ) : (
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        )}
      </button>

      <style>{`
        .theme-toggle {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .theme-toggle:hover {
          border-color: var(--text-muted);
        }

        .theme-toggle svg {
          width: 18px;
          height: 18px;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </>
  );
}
