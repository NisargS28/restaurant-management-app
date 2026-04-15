import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-4 text-gray-900 dark:text-white font-black">404</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-4 bg-blue-600 dark:bg-indigo-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-indigo-500 font-semibold text-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
