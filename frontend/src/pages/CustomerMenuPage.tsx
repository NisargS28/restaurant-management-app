import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Product, CartItem, Table, TableSession, OrderWithItems } from '../services/types';
import { api } from '../services/api';
import { formatCurrency } from '../services/utils';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CustomerMenuPage() {
  const { token } = useParams<{ token: string }>();

  const [table, setTable] = useState<Table | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [session, setSession] = useState<TableSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Load table and products
  useEffect(() => {
    if (!token) {
      setError('Invalid QR code');
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);

      // Fetch table info
      const tableRes = await api.getTableByToken(token);
      if (!tableRes.success || !tableRes.data) {
        setError(tableRes.error || 'Invalid or inactive table');
        setIsLoading(false);
        return;
      }
      setTable(tableRes.data);

      // Fetch products
      const productsRes = await api.getActiveProducts();
      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data);
        // Set first category as active
        const categories = [...new Set(productsRes.data.map((p: Product) => p.category || 'Other'))];
        if (categories.length > 0) {
          setActiveCategory(categories[0] as string);
        }
      }

      // Fetch session
      const sessionRes = await api.getTableSession(token);
      if (sessionRes.success && sessionRes.data) {
        setSession(sessionRes.data);
      }

      setIsLoading(false);
    };

    loadData();
  }, [token]);

  // Refresh session data
  const refreshSession = useCallback(async () => {
    if (!token) return;
    const sessionRes = await api.getTableSession(token);
    if (sessionRes.success && sessionRes.data) {
      setSession(sessionRes.data);
    }
  }, [token]);

  // Group products by category
  const categories = [...new Set(products.map((p) => p.category || 'Other'))];
  const filteredProducts = activeCategory
    ? products.filter((p) => (p.category || 'Other') === activeCategory)
    : products;

  // Cart operations
  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
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

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.productId !== productId));
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Place order
  const handlePlaceOrder = async () => {
    if (!token || cart.length === 0) return;

    setIsPlacing(true);

    const response = await api.createCustomerOrder({
      tableToken: token,
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    if (response.success) {
      setCart([]);
      setShowCart(false);
      setOrderSuccess(true);
      refreshSession();

      // Auto-dismiss success after 5 seconds
      setTimeout(() => {
        setOrderSuccess(false);
      }, 5000);
    } else {
      alert(response.error || 'Failed to place order');
    }

    setIsPlacing(false);
  };

  // Get cart quantity for a product
  const getCartQuantity = (productId: number): number => {
    return cart.find((item) => item.productId === productId)?.quantity || 0;
  };

  // Helper to get status display
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: string }> = {
      PENDING: { label: 'Waiting for approval', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      APPROVED: { label: 'Approved', color: 'bg-orange-100 text-orange-800', icon: '✅' },
      PREPARING: { label: 'Being prepared', color: 'bg-blue-100 text-blue-800', icon: '👨‍🍳' },
      READY: { label: 'Ready to serve', color: 'bg-green-100 text-green-800', icon: '🍽️' },
      COMPLETED: { label: 'Served', color: 'bg-gray-100 text-gray-700', icon: '✔️' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: '📋' };
  };

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-blue-600">RestoPOS</h1>
              {table && (
                <p className="text-sm text-gray-600">📍 Table {table.tableNo}</p>
              )}
            </div>
            {session && session.orderCount > 0 && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Session Total</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(session.totalAmount)}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Success Banner */}
      {orderSuccess && (
        <div className="bg-green-500 text-white px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-bold">Order placed successfully!</p>
              <p className="text-sm text-green-100">Waiting for cashier approval.</p>
            </div>
            <button
              onClick={() => setOrderSuccess(false)}
              className="ml-auto text-xl font-bold hover:opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Session Orders */}
        {session && session.orders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Your Orders</h2>
            <div className="space-y-3">
              {session.orders.map((order: OrderWithItems) => {
                const statusInfo = getStatusDisplay(order.status);
                return (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm text-gray-600">
                          <span>{item.product.name} × {item.quantity}</span>
                          <span>{formatCurrency(Number(item.price) * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Subtotal</span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(Number(order.totalAmount))}
                      </span>
                    </div>
                  </div>
                );
              })}
              {/* Session Grand Total */}
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Session Total ({session.orderCount} order{session.orderCount !== 1 ? 's' : ''})</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(session.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as string)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const qty = getCartQuantity(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border p-4 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      {formatCurrency(Number(product.price))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {qty > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(product.id, qty - 1)}
                          className="w-9 h-9 flex items-center justify-center text-lg font-bold text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900">{qty}</span>
                        <button
                          onClick={() => updateQuantity(product.id, qty + 1)}
                          className="w-9 h-9 flex items-center justify-center text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product)}
                        className="px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        ADD
                      </button>
                    )}
                  </div>
                </div>
                {/* Show item total if in cart */}
                {qty > 0 && (
                  <div className="mt-2 pt-2 border-t flex justify-between text-sm">
                    <span className="text-gray-500">{qty} × {formatCurrency(Number(product.price))}</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(Number(product.price) * qty)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && !showCart && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-40">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-blue-600 text-white rounded-2xl py-4 px-6 flex justify-between items-center shadow-2xl hover:bg-blue-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  {cartItemCount}
                </span>
                <span className="font-bold">View Cart</span>
              </div>
              <span className="text-lg font-bold">{formatCurrency(cartTotal)}</span>
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCart(false)}
          />

          {/* Cart Panel */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col">
            <div className="max-w-lg mx-auto w-full flex flex-col max-h-[80vh]">
              {/* Cart Header */}
              <div className="flex justify-between items-center p-5 border-b">
                <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="w-10 h-10 flex items-center justify-center text-2xl text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  ×
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="w-8 h-8 flex items-center justify-center text-lg font-bold text-white bg-red-500 rounded-full hover:bg-red-600 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="border-t p-5 space-y-4">
                {/* Bill Summary */}
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing || cart.length === 0}
                  className="w-full py-4 text-lg font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isPlacing ? 'Placing Order...' : `Place Order • ${formatCurrency(cartTotal)}`}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
