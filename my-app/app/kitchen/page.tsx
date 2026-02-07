'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import OrderCard from '@/components/OrderCard';
import { OrderWithItems, OrderStatus } from '@/lib/types';
import { api } from '@/lib/api';

export default function KitchenPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch orders
  const fetchOrders = async () => {
    const response = await api.getOrders();
    if (response.success && response.data) {
      // Filter out completed orders, show only active ones
      const activeOrders = response.data.filter(
        (order: OrderWithItems) => order.status !== 'COMPLETED'
      );
      setOrders(activeOrders);
    }
  };

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchOrders();

    if (autoRefresh) {
      const interval = setInterval(fetchOrders, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Update order status
  const handleUpdateStatus = async (orderId: number, status: string) => {
    setUpdatingOrderId(orderId);

    const response = await api.updateOrderStatus(orderId, status);

    if (response.success) {
      fetchOrders();
    } else {
      alert(`Failed to update order: ${response.error}`);
    }

    setUpdatingOrderId(null);
  };

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((order) => order.status === filter);

  return (
    <Layout role="KITCHEN" title="Kitchen Display">
      <div>
        {/* Header Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'PENDING'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({orders.filter((o) => o.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setFilter('PREPARING')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'PREPARING'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Preparing ({orders.filter((o) => o.status === 'PREPARING').length})
            </button>
            <button
              onClick={() => setFilter('READY')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'READY'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Ready ({orders.filter((o) => o.status === 'READY').length})
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Auto-refresh (5s)</span>
            </label>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400">No orders to display</p>
            <p className="text-gray-500 mt-2">
              {filter === 'all'
                ? 'New orders will appear here'
                : `No orders in ${filter} status`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                showPrices={false}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={updatingOrderId === order.id}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
