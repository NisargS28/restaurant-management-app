import { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '../components/Layout';
import OrderCard from '../components/OrderCard';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { OrderWithItems, OrderStatus } from '../services/types';
import { api } from '../services/api';

type ToastType = { message: string; type: 'success' | 'error' | 'info' } | null;

export default function KitchenPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [toast, setToast] = useState<ToastType>(null);
  const isFetchingRef = useRef(false);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  // Fetch orders — preserves existing orders on failure so kitchen stays usable
  const fetchOrders = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      // Uses ?kitchen=true — backend returns only APPROVED, PREPARING, READY
      const response = await api.getKitchenOrders();
      if (response.success && response.data) {
        setOrders(response.data);
        setFetchError(null);
        setLastUpdated(new Date());
      } else {
        // On failure — keep existing orders visible, just show error banner
        setFetchError(response.error || 'Failed to load orders. Retrying…');
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial fetch and auto-refresh
  useEffect(() => {
    fetchOrders();

    if (autoRefresh) {
      const interval = setInterval(fetchOrders, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchOrders]);

  // Update order status
  const handleUpdateStatus = async (orderId: number, status: string) => {
    setUpdatingOrderId(orderId);

    const response = await api.updateOrderStatus(orderId, status);

    if (response.success) {
      fetchOrders();
      showToast(`Order updated to ${status}`, 'success');
    } else {
      showToast(`Failed to update order: ${response.error}`, 'error');
    }

    setUpdatingOrderId(null);
  };

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((order) => order.status === filter);

  // Format last-updated time
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <Layout role="KITCHEN" title="Kitchen Display">
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        {/* Error Banner — shown when fetch fails but orders may still be visible */}
        {fetchError && !isLoading && (
          <div className="mb-4 flex items-center justify-between bg-red-50 border border-red-300 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-red-700">
              <span className="text-lg">⚠️</span>
              <span className="font-medium text-sm">
                Connection issue: {fetchError}
              </span>
            </div>
            <button
              onClick={fetchOrders}
              className="text-sm font-semibold text-red-700 hover:text-red-900 underline"
            >
              Retry now
            </button>
          </div>
        )}

        {/* Header Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 flex-wrap">
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
              onClick={() => setFilter('APPROVED')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'APPROVED'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              New ({orders.filter((o) => o.status === 'APPROVED').length})
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
            {/* Last updated timestamp */}
            {lastUpdated && (
              <span className="text-xs text-gray-400">
                Updated {formatTime(lastUpdated)}
              </span>
            )}
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
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <span className="ml-4 text-xl text-gray-600">Loading orders…</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon={fetchError ? '⚠️' : '👨‍🍳'}
            title={fetchError ? 'Could not reach server' : 'No orders to display'}
            description={
              fetchError
                ? 'Check your internet connection or try refreshing'
                : filter === 'all'
                ? 'New orders from the cashier will appear here automatically'
                : `No orders in ${filter} status`
            }
          />
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
