import { ReactNode } from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
  role?: 'CASHIER' | 'KITCHEN';
  title?: string;
}

export default function Layout({ children, role, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                RestoPOS
              </Link>
              {title && (
                <div className="hidden sm:block">
                  <span className="text-gray-400">|</span>
                  <span className="ml-4 text-lg text-gray-700">{title}</span>
                </div>
              )}
            </div>
            {role && (
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full">
                  {role}
                </span>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Switch Role
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
