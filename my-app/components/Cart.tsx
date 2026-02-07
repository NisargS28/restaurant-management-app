import { CartItem, PaymentMode } from '@/lib/types';
import { formatCurrency, calculateCartTotal } from '@/lib/utils';

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
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Current Order</h2>

      {/* Cart Items */}
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Cart is empty</p>
        ) : (
          items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(item.price)} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onUpdateQuantity(item.productId, item.quantity - 1)
                  }
                  className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={isProcessing}
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    onUpdateQuantity(item.productId, item.quantity + 1)
                  }
                  className="w-8 h-8 flex items-center justify-center text-lg font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  +
                </button>
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="ml-2 w-8 h-8 flex items-center justify-center text-lg font-bold text-white bg-red-600 rounded hover:bg-red-700"
                  disabled={isProcessing}
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment Mode */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['CASH', 'UPI', 'CARD'] as PaymentMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onPaymentModeChange(mode)}
              disabled={isProcessing}
              className={`
                py-3 px-4 text-sm font-medium rounded border-2 transition-colors
                ${
                  paymentMode === mode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }
              `}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center text-2xl font-bold">
          <span className="text-gray-700">Total</span>
          <span className="text-blue-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={onPlaceOrder}
        disabled={items.length === 0 || isProcessing}
        className="w-full py-4 text-lg font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}
