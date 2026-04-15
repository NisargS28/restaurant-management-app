import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Product, CartItem, Table, TableSession, OrderWithItems } from '../services/types';
import { api } from '../services/api';
import { formatCurrency, getProductImage } from '../services/utils';
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

  useEffect(() => {
    if (!token) {
      setError('Invalid QR code');
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);

      const tableRes = await api.getTableByToken(token);
      if (!tableRes.success || !tableRes.data) {
        setError(tableRes.error || 'Invalid or inactive table');
        setIsLoading(false);
        return;
      }
      setTable(tableRes.data);

      const productsRes = await api.getActiveProducts();
      if (productsRes.success && productsRes.data) {
        setProducts(productsRes.data);
        const categories = [...new Set(productsRes.data.map((p: Product) => p.category || 'Other'))];
        if (categories.length > 0) {
          setActiveCategory(categories[0] as string);
        }
      }

      const sessionRes = await api.getTableSession(token);
      if (sessionRes.success && sessionRes.data) {
        setSession(sessionRes.data);
      }

      setIsLoading(false);
    };

    loadData();
  }, [token]);

  const refreshSession = useCallback(async () => {
    if (!token) return;
    const sessionRes = await api.getTableSession(token);
    if (sessionRes.success && sessionRes.data) {
      setSession(sessionRes.data);
    }
  }, [token]);

  const categories = [...new Set(products.map((p) => p.category || 'Other'))];
  const filteredProducts = activeCategory
    ? products.filter((p) => (p.category || 'Other') === activeCategory)
    : products;

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

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

      setTimeout(() => {
        setOrderSuccess(false);
      }, 5000);
    } else {
      alert(response.error || 'Failed to place order');
    }

    setIsPlacing(false);
  };

  const getCartQuantity = (productId: number): number => {
    return cart.find((item) => item.productId === productId)?.quantity || 0;
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: string }> = {
      PENDING: { label: 'Waiting for approval', color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/20', icon: '⏳' },
      APPROVED: { label: 'Approved', color: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/20', icon: '✅' },
      PREPARING: { label: 'Being prepared', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20', icon: '👨‍🍳' },
      READY: { label: 'Ready to serve', color: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-200 dark:border-green-500/20', icon: '🍽️' },
      COMPLETED: { label: 'Served', color: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10', icon: '✔️' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300', icon: '📋' };
  };

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
        <div className="text-center max-w-md p-8 glass rounded-3xl">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center">
        <div className="glass p-8 rounded-full shadow-lg mb-6">
          <LoadingSpinner size="lg" />
        </div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 animate-pulse">Prepping your menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden relative">
      {/* Background decoration */}
      <div className="fixed top-0 -z-10 h-full w-full bg-[var(--bg)]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" style={{ background: 'var(--bg-glow-1)' }}></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" style={{ background: 'var(--bg-glow-2)' }}></div>
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-30 !rounded-none border-b border-white/50 dark:border-white/5 px-4 py-4 backdrop-blur-xl">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">RestoPOS</h1>
            {table && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-1 bg-indigo-50/80 dark:bg-violet-500/15 border border-indigo-100 dark:border-violet-500/20 text-indigo-700 dark:text-violet-300 rounded-lg text-xs font-bold shadow-sm">
                <span>📍</span> Table {table.tableNo}
              </div>
            )}
          </div>
          {session && session.orderCount > 0 && (
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Session Total</span>
              <span className="text-xl font-black text-indigo-600 dark:text-violet-400 tracking-tight">
                {formatCurrency(session.totalAmount)}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Hero Banner */}
      <div className="max-w-xl mx-auto px-4 mt-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative h-40 rounded-3xl overflow-hidden shadow-lg group">
          <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Restaurant Ambiance" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
            <h2 className="text-white font-bold text-2xl tracking-tight leading-tight">Hungry?</h2>
            <p className="text-gray-200 text-sm font-medium">Order directly from your table.</p>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {orderSuccess && (
        <div className="max-w-xl mx-auto px-4 mb-6 animate-in slide-in-from-top-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-4 rounded-2xl shadow-lg shadow-green-500/30 flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <span className="text-2xl block drop-shadow-md">✅</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">Order Sent to Kitchen!</p>
              <p className="text-green-50 text-sm font-medium">Sit tight, it's pending approval.</p>
            </div>
            <button
              onClick={() => setOrderSuccess(false)}
              className="text-white/80 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto px-4">
        {/* Session Orders */}
        {session && session.orders.length > 0 && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Your Orders</h2>
              <span className="bg-gray-900 dark:bg-white/15 text-white text-xs font-bold px-2 py-1 rounded-full">{session.orderCount}</span>
            </div>
            <div className="space-y-4">
              {session.orders.map((order: OrderWithItems) => {
                const statusInfo = getStatusDisplay(order.status);
                return (
                  <div key={order.id} className="glass rounded-2xl p-5 border border-white/60 dark:border-white/5 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-black tracking-widest text-gray-400 dark:text-gray-500 mb-1">{order.orderNumber}</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xl border ${statusInfo.color}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                      </div>
                      <span className="text-lg font-black text-gray-900 dark:text-white">
                        {formatCurrency(Number(order.totalAmount))}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <span className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 rounded text-xs font-bold">{item.quantity}</span>
                            {item.product.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 font-medium">{formatCurrency(Number(item.price) * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="sticky top-[73px] z-20 py-2 -mx-4 px-4 bg-gradient-to-b from-[var(--bg)] to-[var(--bg)]/90 backdrop-blur-md mb-6">
          <div className="flex gap-3 overflow-x-auto pb-4 pt-1 items-center scrollbar-hide snap-x">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category as string)}
                className={`
                  snap-start px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 shadow-sm
                  ${activeCategory === category
                    ? 'bg-gray-900 dark:bg-white/15 text-white scale-105 shadow-md shadow-gray-900/20 dark:shadow-none'
                    : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/8 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {filteredProducts.map((product) => {
            const qty = getCartQuantity(product.id);
            const imgUrl = getProductImage(product.category, product.name);
            return (
              <div
                key={product.id}
                className="glass rounded-3xl overflow-hidden flex flex-col border border-white/60 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Product Image */}
                <div className="relative h-36 w-full overflow-hidden bg-gray-100 dark:bg-slate-800/50 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors duration-700">
                  <img src={imgUrl} alt={product.name} className="w-full h-full object-cover animated-food animated-food-shadow transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40 pointer-events-none"></div>
                  <div className="absolute top-2 right-2 z-10 transition-transform hover:scale-110">
                    {qty === 0 && (
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-white/90 dark:bg-black/50 backdrop-blur-md text-gray-900 dark:text-white p-2 rounded-full shadow-lg border border-white/50 dark:border-white/10 text-xl w-10 h-10 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs font-semibold text-indigo-600/70 dark:text-violet-400/70 uppercase tracking-wider mb-2 line-clamp-1">{product.category}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <p className="text-lg font-black text-gray-900 dark:text-white">
                      {formatCurrency(Number(product.price))}
                    </p>

                    {qty > 0 && (
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-inner">
                        <button
                          onClick={() => updateQuantity(product.id, qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-white/10 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-white/20 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-4 text-center font-bold text-sm text-gray-900 dark:text-white">{qty}</span>
                        <button
                          onClick={() => updateQuantity(product.id, qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-lg font-bold text-white bg-gray-900 dark:bg-violet-600 rounded-full shadow-sm hover:bg-gray-800 dark:hover:bg-violet-500 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && !showCart && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-40 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="max-w-xl mx-auto">
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-gray-900 dark:bg-violet-600 text-white rounded-[2rem] p-2 flex justify-between items-center shadow-2xl shadow-gray-900/30 dark:shadow-violet-600/30 hover:shadow-gray-900/40 dark:hover:shadow-violet-600/40 transition-all hover:-translate-y-1 group border border-gray-700/50 dark:border-violet-400/20"
            >
              <div className="flex items-center gap-3 pl-2">
                <div className="bg-indigo-500 dark:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner group-hover:scale-105 transition-transform relative overflow-hidden">
                  <span className="relative z-10">{cartItemCount}</span>
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-500 dark:from-violet-600 dark:to-fuchsia-500 z-0"></div>
                </div>
                <span className="font-bold tracking-wide">View Cart</span>
              </div>
              <div className="pr-6">
                <span className="text-xl font-black">{formatCurrency(cartTotal)}</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowCart(false)}
          />

          <div className="relative bg-white dark:bg-[#1e1e1e] rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] w-full max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-full duration-500 ease-out border-t border-white dark:border-white/5">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/15 rounded-full mx-auto mt-4 mb-2"></div>
            <div className="max-w-xl mx-auto w-full flex flex-col h-full overflow-hidden">
              {/* Cart Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-white/5">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Your Order</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{cartItemCount} items selected</p>
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cart.map((item) => {
                  const prod = products.find(p => p.id === item.productId);
                  const imgUrl = getProductImage(prod?.category || '', item.name);
                  return (
                    <div key={item.productId} className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-white/5 last:border-0 relative">
                      <img src={imgUrl} alt={item.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{item.name}</p>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <span className="font-black text-gray-900 dark:text-white text-right">{formatCurrency(item.price * item.quantity)}</span>
                         <div className="flex items-center gap-2 bg-gray-100/80 dark:bg-white/10 p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-inner">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-white/10 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-white/20"
                          >
                            −
                          </button>
                          <span className="w-5 text-center font-bold text-sm text-gray-900 dark:text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center font-bold text-white bg-gray-900 dark:bg-violet-600 rounded-full shadow-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Footer */}
              <div className="border-t border-gray-100 dark:border-white/5 p-6 bg-gray-50/50 dark:bg-white/3">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Total to pay</span>
                  <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{formatCurrency(cartTotal)}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing || cart.length === 0}
                  className="w-full py-4 px-6 text-lg font-black text-white bg-gray-900 dark:bg-violet-600 rounded-2xl hover:bg-gray-800 dark:hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-gray-900/20 dark:shadow-violet-600/20 active:scale-[0.98] flex justify-center items-center gap-3 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-violet-600 dark:via-violet-500 dark:to-violet-600 opacity-50"></div>
                  <span className="relative z-10">{isPlacing ? 'Sending to Kitchen...' : 'Place Order'}</span>
                  {!isPlacing && <span className="relative z-10 text-2xl leading-none">&rarr;</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
