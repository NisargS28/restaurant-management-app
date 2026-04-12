import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import ProductForm from '../components/ProductForm';
import OrderCard from '../components/OrderCard';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Product, CartItem, PaymentMode, ProductFormData, OrderWithItems, TableWithSession } from '../services/types';
import { api } from '../services/api';
import { formatCurrency } from '../services/utils';

type ToastType = { message: string; type: 'success' | 'error' | 'info' } | null;

export default function CashierPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'order' | 'manage' | 'pending'>('order');
  const [toast, setToast] = useState<ToastType>(null);

  // Pending orders state
  const [pendingOrders, setPendingOrders] = useState<OrderWithItems[]>([]);
  const [approvingOrderId, setApprovingOrderId] = useState<number | null>(null);
  const [isPendingLoading, setIsPendingLoading] = useState(false);

  // Table sessions state
  const [tables, setTables] = useState<TableWithSession[]>([]);
  const [settlingTableId, setSettlingTableId] = useState<number | null>(null);

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

  // Fetch pending orders
  const fetchPendingOrders = useCallback(async () => {
    const response = await api.getPendingApproval();
    if (response.success && response.data) {
      setPendingOrders(response.data);
    }
  }, []);

  // Fetch tables with session info
  const fetchTables = useCallback(async () => {
    const response = await api.getTables();
    if (response.success && response.data) {
      setTables(response.data.filter((t: TableWithSession) => t.activeSession.orderCount > 0));
    }
  }, []);

  // Auto-refresh pending orders when tab is active
  useEffect(() => {
    if (activeTab === 'pending') {
      setIsPendingLoading(true);
      Promise.all([fetchPendingOrders(), fetchTables()]).then(() => {
        setIsPendingLoading(false);
      });

      const interval = setInterval(() => {
        fetchPendingOrders();
        fetchTables();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, fetchPendingOrders, fetchTables]);

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

  // Approve a pending order
  const handleApproveOrder = async (orderId: number) => {
    setApprovingOrderId(orderId);
    const response = await api.approveOrder(orderId);

    if (response.success) {
      showToast('Order approved and sent to kitchen!', 'success');
      fetchPendingOrders();
      fetchTables();
    } else {
      showToast(`Failed to approve order: ${response.error}`, 'error');
    }

    setApprovingOrderId(null);
  };

  // Settle a table
  const handleSettleTable = async (tableId: number, tableNo: string) => {
    setSettlingTableId(tableId);
    const response = await api.settleTable(tableId);

    if (response.success) {
      showToast(`Table ${tableNo} settled successfully!`, 'success');
      fetchTables();
      fetchPendingOrders();
    } else {
      showToast(`Failed to settle table: ${response.error}`, 'error');
    }

    setSettlingTableId(null);
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
          <div className="flex gap-2 mb-6 flex-wrap">
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
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors relative ${
                activeTab === 'pending'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Customer Orders
              {pendingOrders.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {pendingOrders.length}
                </span>
              )}
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
            <Link
              to="/reports"
              className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              View Reports
            </Link>
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

          {/* Pending Customer Orders Tab */}
          {activeTab === 'pending' && (
            <div className="space-y-8">
              {/* Pending Approval Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ⏳ Pending Approval ({pendingOrders.length})
                </h2>

                {isPendingLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                    <span className="ml-4 text-xl text-gray-600">Loading pending orders...</span>
                  </div>
                ) : pendingOrders.length === 0 ? (
                  <EmptyState
                    icon="📱"
                    title="No pending customer orders"
                    description="Customer QR orders will appear here for approval"
                  />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {pendingOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        showPrices={true}
                        onApprove={handleApproveOrder}
                        isUpdating={approvingOrderId === order.id}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Active Table Sessions Section */}
              {tables.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    🪑 Active Table Sessions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tables.map((table) => (
                      <div
                        key={table.id}
                        className="bg-white rounded-lg shadow-md p-5 border-2 border-blue-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              Table {table.tableNo}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {table.activeSession.orderCount} order{table.activeSession.orderCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(table.activeSession.totalAmount)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleSettleTable(table.id, table.tableNo)}
                          disabled={settlingTableId === table.id}
                          className="w-full mt-2 px-4 py-3 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {settlingTableId === table.id ? 'Settling...' : '💳 Settle & Reset Table'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
