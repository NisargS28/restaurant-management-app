import { OrderWithItems } from '@/lib/types';
import { formatCurrency, formatDateTime, getPaymentModeColor } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface OrderCardProps {
  order: OrderWithItems;
  showPrices?: boolean;
  onUpdateStatus?: (orderId: number, status: string) => void;
  isUpdating?: boolean;
}

export default function OrderCard({
  order,
  showPrices = true,
  onUpdateStatus,
  isUpdating = false,
}: OrderCardProps) {
  const statusFlow = ['PENDING', 'PREPARING', 'READY', 'COMPLETED'];
  const currentIndex = statusFlow.indexOf(order.status);
  const nextStatus = currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
      {/* Order Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{order.orderNumber}</h3>
          <p className="text-sm text-gray-600">{formatDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} large />
      </div>

      {/* Order Items */}
      <div className="mb-4 space-y-2">
        {order.orderItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.product.name}</p>
              {showPrices && (
                <p className="text-sm text-gray-600">
                  {formatCurrency(Number(item.price))} × {item.quantity}
                </p>
              )}
            </div>
            {!showPrices && (
              <p className="text-lg font-semibold text-gray-900">
                Qty: {item.quantity}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Order Footer */}
      <div className="flex justify-between items-center pt-4 border-t">
        {showPrices && (
          <div>
            <p className="text-lg font-bold text-gray-900">
              Total: {formatCurrency(Number(order.totalAmount))}
            </p>
            {order.paymentMode && (
              <span
                className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${getPaymentModeColor(
                  order.paymentMode
                )}`}
              >
                {order.paymentMode}
              </span>
            )}
          </div>
        )}

        {onUpdateStatus && nextStatus && (
          <button
            onClick={() => onUpdateStatus(order.id, nextStatus)}
            disabled={isUpdating}
            className="px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdating ? 'Updating...' : `Mark as ${nextStatus}`}
          </button>
        )}
      </div>
    </div>
  );
}
