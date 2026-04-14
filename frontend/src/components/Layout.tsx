import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  role?: 'CASHIER' | 'KITCHEN';
  title?: string;
}

export default function Layout({ children, role, title }: LayoutProps) {
  return (
    <div className="min-h-screen text-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-80 transition-opacity">
                RestoPOS
              </Link>
              {title && (
                <div className="hidden sm:flex items-center">
                  <div className="h-6 w-px bg-gray-300 mx-4"></div>
                  <span className="text-lg font-medium text-gray-600 tracking-wide">{title}</span>
                </div>
              )}
            </div>
            {role && (
              <div className="flex items-center space-x-5">
                <span className="px-4 py-1.5 text-xs font-bold tracking-wider text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-md shadow-blue-500/20">
                  {role}
                </span>
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200"
                >
                  Switch Role
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>
      
      {/* Background decoration */}
      <div className="fixed top-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.1)] opacity-50 blur-[80px]"></div>
        <div className="absolute top-0 right-auto left-0 h-[500px] w-[500px] translate-x-[10%] translate-y-[10%] rounded-full bg-[rgba(56,189,248,0.1)] opacity-50 blur-[80px]"></div>
      </div>
    </div>
  );
}
