import { ReactNode, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  role?: 'CASHIER' | 'KITCHEN';
  title?: string;
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('restpos-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('restpos-theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('restpos-theme', 'light');
    }
  }, [isDark]);

  // Initialize on mount
  useEffect(() => {
    const saved = localStorage.getItem('restpos-theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative w-11 h-11 rounded-xl flex items-center justify-center
        bg-white/80 dark:bg-white/10 
        border border-gray-200 dark:border-white/10 
        shadow-sm hover:shadow-md dark:shadow-none
        hover:scale-105 active:scale-95
        transition-all duration-300 group"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Sun Icon */}
      <svg
        className={`w-5 h-5 absolute transition-all duration-500 ${
          isDark
            ? 'opacity-0 rotate-90 scale-0'
            : 'opacity-100 rotate-0 scale-100 text-amber-500'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 6.343l-.707-.707m12.728 12.728l-.707-.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      {/* Moon Icon */}
      <svg
        className={`w-5 h-5 absolute transition-all duration-500 ${
          isDark
            ? 'opacity-100 rotate-0 scale-100 text-indigo-300'
            : 'opacity-0 -rotate-90 scale-0'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}

export default function Layout({ children, role, title }: LayoutProps) {
  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 overflow-x-clip">
      {/* Header */}
      <header className="sticky top-0 z-50 glass !rounded-none border-b border-gray-200/50 dark:border-white/5 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-400 dark:to-purple-400 hover:opacity-80 transition-opacity">
                RestoPOS
              </Link>
              {title && (
                <div className="hidden sm:flex items-center">
                  <div className="h-6 w-px bg-gray-300 dark:bg-white/10 mx-4"></div>
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-300 tracking-wide">{title}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {role && (
                <span className="px-4 py-1.5 text-xs font-bold tracking-wider text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-500 dark:to-purple-500 rounded-full shadow-md shadow-blue-500/20 dark:shadow-indigo-500/20">
                  {role}
                </span>
              )}
              <ThemeToggle />
              {role && (
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Switch Role
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>
      
      {/* Background decoration */}
      <div className="fixed top-0 -z-10 h-full w-full bg-[var(--bg)]">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full opacity-50 blur-[100px]"
          style={{ background: 'var(--bg-glow-1)' }}></div>
        <div className="absolute top-0 right-auto left-0 h-[500px] w-[500px] translate-x-[10%] translate-y-[10%] rounded-full opacity-50 blur-[100px]"
          style={{ background: 'var(--bg-glow-2)' }}></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full opacity-30 blur-[120px]"
          style={{ background: 'var(--bg-glow-3)' }}></div>
      </div>
    </div>
  );
}
