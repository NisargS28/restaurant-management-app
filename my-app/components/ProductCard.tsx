import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  showStatus?: boolean;
  onToggleStatus?: (product: Product) => void;
  onEdit?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onSelect,
  showStatus = false,
  onToggleStatus,
  onEdit,
}: ProductCardProps) {
  const isActive = product.isActive;

  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border-2 p-4 transition-all
        ${isActive ? 'border-gray-200 hover:border-blue-400' : 'border-gray-300 opacity-60'}
        ${onSelect && isActive ? 'cursor-pointer' : ''}
      `}
      onClick={() => onSelect && isActive && onSelect(product)}
    >
      <div className="flex flex-col h-full">
        {/* Product Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
            {showStatus && (
              <span
                className={`
                  px-2 py-1 text-xs font-medium rounded
                  ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}
              >
                {isActive ? 'Active' : 'Inactive'}
              </span>
            )}
          </div>

          {product.category && (
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          )}

          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(Number(product.price))}
          </p>
        </div>

        {/* Actions for Cashier */}
        {(onToggleStatus || onEdit) && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
              >
                Edit
              </button>
            )}
            {onToggleStatus && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus(product);
                }}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded
                  ${
                    isActive
                      ? 'text-red-600 bg-red-50 hover:bg-red-100'
                      : 'text-green-600 bg-green-50 hover:bg-green-100'
                  }
                `}
              >
                {isActive ? 'Disable' : 'Enable'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
