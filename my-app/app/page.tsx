import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to RestoPOS
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Select your role to continue
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Cashier Card */}
            <Link
              href="/cashier"
              className="group bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all p-8"
            >
              <div className="text-6xl mb-4">💰</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                CASHIER
              </h2>
              <p className="text-gray-600">
                Manage products, create orders, and view reports
              </p>
              <ul className="mt-4 text-sm text-gray-500 text-left space-y-1">
                <li>✓ Product management</li>
                <li>✓ Place orders & billing</li>
                <li>✓ Sales reports</li>
                <li>✓ Payment processing</li>
              </ul>
            </Link>

            {/* Kitchen Card */}
            <Link
              href="/kitchen"
              className="group bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all p-8"
            >
              <div className="text-6xl mb-4">👨‍🍳</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-green-600">
                KITCHEN
              </h2>
              <p className="text-gray-600">
                View incoming orders and update status
              </p>
              <ul className="mt-4 text-sm text-gray-500 text-left space-y-1">
                <li>✓ View incoming orders</li>
                <li>✓ Update order status</li>
                <li>✓ Track preparation</li>
                <li>✓ Mark orders ready</li>
              </ul>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
