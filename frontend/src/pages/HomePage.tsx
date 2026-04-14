import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function HomePage() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 max-w-lg mx-auto h-72 blur-[118px] sm:max-w-3xl sm:h-[400px] z-[-1] bg-gradient-to-tr from-blue-300 to-indigo-500 opacity-20"></div>
        
        <div className="text-center z-10 mb-16 animate-in slide-in-from-bottom-6 duration-700">
          <h1 className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-6 drop-shadow-sm tracking-tight">
            Welcome to RestoPOS
          </h1>
          <p className="text-xl sm:text-2xl text-gray-500 font-light max-w-2xl mx-auto tracking-wide">
            The next generation point of sale system. Select your role to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full px-4 animate-in slide-in-from-bottom-10 shadow-black duration-1000 delay-150">
          {/* Cashier Card */}
          <Link
            to="/cashier"
            className="group glass rounded-3xl p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border-t border-l border-white/60"
          >
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
              💰
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
              CASHIER
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6 h-12">
              Manage products, create orders, and view comprehensive reports.
            </p>
            <div className="space-y-2 border-t pt-4 border-gray-100">
              {['Product management', 'Place orders & billing', 'Approve QR orders'].map(item => (
                <div key={item} className="flex items-center text-sm font-medium text-gray-600">
                  <span className="text-blue-500 mr-2 text-lg">•</span> {item}
                </div>
              ))}
            </div>
          </Link>

          {/* Kitchen Card */}
          <Link
            to="/kitchen"
            className="group glass rounded-3xl p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 border-t border-l border-white/60"
          >
            <div className="bg-gradient-to-br from-green-100 to-green-50 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
              👨‍🍳
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
              KITCHEN
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6 h-12">
              View incoming orders, update status, and manage preparation.
            </p>
            <div className="space-y-2 border-t pt-4 border-gray-100">
              {['View approved orders', 'Update order status', 'Track preparation'].map(item => (
                <div key={item} className="flex items-center text-sm font-medium text-gray-600">
                  <span className="text-green-500 mr-2 text-lg">•</span> {item}
                </div>
              ))}
            </div>
          </Link>

          {/* Table Management Card */}
          <Link
            to="/tables"
            className="group glass rounded-3xl p-8 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 border-t border-l border-white/60"
          >
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
              🪑
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
              TABLES
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6 h-12">
              Manage tables, generate QR codes, and view active sessions.
            </p>
            <div className="space-y-2 border-t pt-4 border-gray-100">
              {['Create & manage tables', 'Generate QR codes', 'Settle & reset tables'].map(item => (
                <div key={item} className="flex items-center text-sm font-medium text-gray-600">
                  <span className="text-purple-500 mr-2 text-lg">•</span> {item}
                </div>
              ))}
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
