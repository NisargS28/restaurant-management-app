import { useState, FormEvent } from 'react';
import { Product, ProductFormData } from '@/lib/types';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    price: product?.price || 0,
    category: product?.category || '',
    isActive: product?.isActive ?? true,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter product name"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price (₹) *
        </label>
        <input
          type="number"
          id="price"
          required
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter price"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <input
          type="text"
          id="category"
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Beverages, Snacks"
        />
      </div>

      {product && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
            Active
          </label>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : product ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
