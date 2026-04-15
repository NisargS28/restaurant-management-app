import { CartItem, PaymentMode } from '../services/types';
import { formatCurrency, calculateCartTotal } from '../services/utils';

const PAYMENT_MODES: { mode: PaymentMode; icon: string; label: string }[] = [
  { mode: 'CASH', icon: '💵', label: 'Cash' },
  { mode: 'UPI', icon: '📱', label: 'UPI' },
  { mode: 'CARD', icon: '💳', label: 'Card' },
];

interface CartProps {
  items: CartItem[];
  paymentMode: PaymentMode;
  onPaymentModeChange: (mode: PaymentMode) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onPlaceOrder: () => void;
  isProcessing?: boolean;
}

export default function Cart({
  items,
  paymentMode,
  onPaymentModeChange,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  isProcessing = false,
}: CartProps) {
  const total = calculateCartTotal(items);

  return (
    <div className="bg-white dark:bg-slate-900/70 dark:backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-black/20 border border-gray-100 dark:border-white/8 p-6 sticky top-6 flex flex-col h-[calc(100vh-6rem)] relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Current Order</h2>
        <span className="bg-blue-50 dark:bg-indigo-500/15 text-blue-700 dark:text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100 dark:border-indigo-500/20">
          {items.reduce((sum, i) => sum + i.quantity, 0)} Items
        </span>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-3">
            <span className="text-4xl opacity-50">🛒</span>
            <p className="font-medium">No items added yet</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl hover:bg-gray-100/50 dark:hover:bg-white/8 transition-colors"
            >
              <div className="flex-1 pr-3">
                <p className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{item.name}</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {formatCurrency(item.price)} <span className="mx-1 text-gray-300 dark:text-gray-600">|</span> <span className="text-gray-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</span>
                </p>
              </div>
              
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/10 rounded-md hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                  disabled={isProcessing}
                >
                  −
                </button>
                <span className="w-5 text-center font-bold text-sm text-gray-900 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-white/10 rounded-md hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                  disabled={isProcessing}
                >
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/8 flex flex-col gap-6">
        {/* Payment Mode Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            {PAYMENT_MODES.map((mode) => (
              <button
                key={mode.mode}
                onClick={() => onPaymentModeChange(mode.mode)}
                disabled={isProcessing}
                className={`
                  flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all duration-200
                  ${
                    paymentMode === mode.mode
                      ? 'bg-blue-50 dark:bg-indigo-500/15 text-blue-700 dark:text-indigo-300 border-blue-500 dark:border-indigo-500/50 shadow-sm scale-[1.02]'
                      : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/8 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/8'
                  }
                `}
              >
                <span className="text-xl">{mode.icon}</span>
                <span className={`text-[11px] font-bold tracking-wide ${paymentMode === mode.mode ? 'text-blue-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  {mode.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Total and Checkout */}
        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Grand Total</span>
            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {formatCurrency(total)}
            </span>
          </div>

          <button
            onClick={onPlaceOrder}
            disabled={items.length === 0 || isProcessing}
            className="w-full py-4 px-6 text-lg font-black text-white bg-blue-600 dark:bg-indigo-600 rounded-xl hover:bg-blue-700 dark:hover:bg-indigo-500 active:scale-[0.98] disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-500 disabled:cursor-not-allowed disabled:active:scale-100 transition-all shadow-lg shadow-blue-600/20 dark:shadow-indigo-600/20 flex justify-center items-center gap-2"
          >
            {isProcessing ? 'Processing Order...' : 'Place Order →'}
          </button>
        </div>
      </div>
    </div>
  );
}
