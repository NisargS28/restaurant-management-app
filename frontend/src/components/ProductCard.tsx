import { Product } from '../services/types';
import { formatCurrency, getProductImage } from '../services/utils';

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
  const imageUrl = getProductImage(product.category, product.name);

  return (
    <div
      className={`
        bg-white dark:bg-slate-800/60 rounded-xl overflow-hidden shadow-sm 
        border border-gray-100 dark:border-white/8
        transition-all duration-300
        ${isActive
          ? 'hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 hover:-translate-y-1 hover:scale-[1.02] hover:border-blue-300 dark:hover:border-indigo-500/30 cursor-pointer'
          : 'opacity-70 grayscale-[30%]'
        }
      `}
      onClick={() => onSelect && isActive && onSelect(product)}
    >
      {/* Product Image */}
      <div className="relative h-32 w-full overflow-hidden bg-gray-100 dark:bg-slate-700/50 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors duration-500">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="object-cover w-full h-full animated-food animated-food-shadow hover:scale-105 transition-transform duration-500"
        />
        {/* Dark mode image overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40 pointer-events-none"></div>
        {showStatus && (
          <div className="absolute top-3 right-3">
            <span
              className={`
                px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm backdrop-blur-md
                ${isActive ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}
              `}
            >
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col p-4">
        {/* Product Info */}
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
          
          <div className="flex items-center justify-between mb-3">
            {product.category ? (
              <span className="text-xs font-semibold text-blue-600 dark:text-indigo-400 bg-blue-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md border border-transparent dark:border-indigo-500/20">
                {product.category}
              </span>
            ) : <span className="h-5"></span>}
          </div>

          <p className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {formatCurrency(Number(product.price))}
          </p>
        </div>

        {/* Actions for Cashier */}
        {(onToggleStatus || onEdit) && (
          <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-white/8">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="flex-1 px-3 py-2 text-sm font-semibold text-blue-600 dark:text-indigo-400 bg-blue-50/50 dark:bg-indigo-500/10 backdrop-blur-sm rounded-xl hover:bg-blue-100 dark:hover:bg-indigo-500/20 hover:shadow-inner transition-all"
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
                  flex-1 px-3 py-2 text-sm font-semibold backdrop-blur-sm rounded-xl transition-all hover:shadow-inner
                  ${
                    isActive
                      ? 'text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20'
                      : 'text-green-600 dark:text-green-400 bg-green-50/50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20'
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
