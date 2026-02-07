'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import Cart from '@/components/Cart';
import ProductForm from '@/components/ProductForm';
import Toast from '@/components/Toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product, CartItem, PaymentMode, ProductFormData } from '@/lib/types';
import { api } from '@/lib/api';
import { generateOrderNumber } from '@/lib/utils';

type ToastType = { message: string; type: 'success' | 'error' | 'info' } | null;

export default function CashierPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'order' | 'manage'>('order');
  const [toast, setToast] = useState<ToastType>(null);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const response = await api.getProducts();
    if (response.success && response.data) {
      setProducts(response.data);
    } else {
      showToast('Failed to load products', 'error');
    }
    setIsLoading(false);
  };

  // Add product to cart
  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: parseFloat(product.price.toString()),
          quantity: 1,
        },
      ]);
    }
  };

  // Update quantity
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Remove item from cart
  const handleRemoveItem = (productId: number) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);

    const orderData = {
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      paymentMode,
    };

    const response = await api.createOrder(orderData);

    if (response.success) {
      showToast(`Order placed successfully! Order #${response.data.orderNumber}`, 'success');
      setCart([]);
      setPaymentMode('CASH');
    } else {
      showToast(`Failed to place order: ${response.error}`, 'error');
    }

    setIsProcessing(false);
  };

  // Toggle product status
  const handleToggleStatus = async (product: Product) => {
    const response = await api.toggleProductStatus(product.id, !product.isActive);
    if (response.success) {
      fetchProducts();
      showToast(`Product ${!product.isActive ? 'enabled' : 'disabled'} successfully`, 'success');
    } else {
      showToast(`Failed to update product: ${response.error}`, 'error');
    }
  };

  // Create/Update product
  const handleProductSubmit = async (data: ProductFormData) => {
    setIsProcessing(true);

    const response = editingProduct
      ? await api.updateProduct(editingProduct.id, data)
      : await api.createProduct(data);

    if (response.success) {
      fetchProducts();
      setShowProductForm(false);
      showToast(`Product ${editingProduct ? 'updated' : 'created'} successfully`, 'success');
    } else {
      showToast(`Failed to save product: ${response.error}`, 'error');
    }

    setIsProcessing(false);
  };

  const activeProducts = products.filter((p) => p.isActive);
  const groupedProducts = activeProducts.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <Layout role="CASHIER" title="Cashier Dashboard">
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
          <span className="ml-4 text-xl text-gray-600">Loading products...</span>
        </div>
      ) : (
        <div className="flex gap-6">
        {/* Left Side - Products */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('order')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'order'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Place Order
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'manage'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Manage Products
            </button>
            <a
              href="/reports"
              className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              View Reports
            </a>
          </div>

          {/* Place Order Tab */}
          {activeTab === 'order' && (
            <div className="space-y-6">
              {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(categoryProducts as Product[]).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Manage Products Tab */}
          {activeTab === 'manage' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductForm(true);
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                >
                  + Add Product
                </button>
              </div>

              {showProductForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <ProductForm
                    product={editingProduct || undefined}
                    onSubmit={handleProductSubmit}
                    onCancel={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                    }}
                    isSubmitting={isProcessing}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showStatus
                    onToggleStatus={handleToggleStatus}
                    onEdit={(product) => {
                      setEditingProduct(product);
                      setShowProductForm(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Cart (only show on order tab) */}
        {activeTab === 'order' && (
          <div className="w-96">
            <Cart
              items={cart}
              paymentMode={paymentMode}
              onPaymentModeChange={setPaymentMode}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onPlaceOrder={handlePlaceOrder}
              isProcessing={isProcessing}
            />
          </div>
        )}
        </div>
      )}
    </Layout>
  );
}
