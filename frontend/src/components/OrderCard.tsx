import { OrderWithItems } from '../services/types';
import { formatCurrency, formatDateTime, getPaymentModeColor, getProductImage } from '../services/utils';
import StatusBadge from './StatusBadge';

interface OrderCardProps {
  order: OrderWithItems;
  showPrices?: boolean;
  onUpdateStatus?: (orderId: number, status: string) => void;
  onApprove?: (orderId: number) => void;
  isUpdating?: boolean;
}

export default function OrderCard({
  order,
  showPrices = true,
  onUpdateStatus,
  onApprove,
  isUpdating = false,
}: OrderCardProps) {
  const statusFlow = ['PENDING', 'APPROVED', 'PREPARING', 'READY', 'COMPLETED'];
  
  const isPendingCashier = order.status === 'PENDING' && order.source === 'CASHIER';
  const effectiveStatus = isPendingCashier ? 'APPROVED' : order.status;
  
  const currentIndex = statusFlow.indexOf(effectiveStatus);
  const nextStatus = currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : null;

  return (
    <div className="glass rounded-2xl shadow-lg p-6 border border-white/50 dark:border-white/5 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
      {/* Subtle indicator bar on the left */}
      <div className={`absolute top-0 left-0 w-1.5 h-full ${order.status === 'PENDING' ? 'bg-yellow-400' : order.status === 'PREPARING' ? 'bg-blue-500' : order.status === 'READY' ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}></div>

      {/* Order Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 font-mono tracking-tight">{order.orderNumber}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide mt-1 uppercase">{formatDateTime(order.createdAt)}</p>
          {order.table && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-bold shadow-sm border border-transparent dark:border-indigo-500/20">
              <span className="text-base">📍</span> Table {order.table.tableNo}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-3 z-10">
          <StatusBadge status={order.status} large />
          <span
            className={`
              inline-flex items-center px-2.5 py-1 text-[10px] font-black tracking-widest uppercase rounded-full shadow-sm
              ${order.source === 'QR'
                ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20'
                : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
              }
            `}
          >
            {order.source === 'QR' ? '📱 QR Order' : '💰 Cashier'}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6 space-y-3">
        {order.orderItems.map((item) => {
          const imgUrl = getProductImage(item.product.category, item.product.name);
          return (
            <div
              key={item.id}
              className="flex items-center p-3 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-100/50 dark:border-white/5 shadow-sm transition-transform hover:-translate-x-1"
            >
              <img src={imgUrl} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover shadow-sm mr-4" />
              
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white">{item.product.name}</p>
                {showPrices && (
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                    {formatCurrency(Number(item.price))} <span className="text-gray-400 dark:text-gray-600 mx-1">×</span> <span className="text-gray-800 dark:text-gray-200">{item.quantity}</span>
                  </p>
                )}
              </div>
              
              {!showPrices && (
                <div className="bg-gray-900 dark:bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold shadow-md">
                  {item.quantity}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Order Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-5 border-t border-gray-200/60 dark:border-white/8">
        {showPrices && (
          <div className="w-full sm:w-auto">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {formatCurrency(Number(order.totalAmount))}
            </p>
            {order.paymentMode && (
              <span
                className={`inline-flex mt-2 px-2 py-0.5 text-[10px] font-bold uppercase rounded shadow-sm ${getPaymentModeColor(
                  order.paymentMode
                )}`}
              >
                {order.paymentMode}
              </span>
            )}
          </div>
        )}

        <div className="flex gap-3 w-full sm:w-auto justify-end">
          {onApprove && order.status === 'PENDING' && (
            <button
              onClick={() => onApprove(order.id)}
              disabled={isUpdating}
              className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-green-500/20 transition-all hover:-translate-y-0.5"
            >
              {isUpdating ? 'Approving...' : '✓ Approve Order'}
            </button>
          )}

          {onUpdateStatus && nextStatus && (order.status !== 'PENDING' || isPendingCashier) && (
            <button
              onClick={() => onUpdateStatus(order.id, nextStatus)}
              disabled={isUpdating}
              className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 dark:shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
            >
              {isUpdating ? 'Updating...' : `Mark as ${nextStatus}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
