// Format currency in INR
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₹${num.toFixed(2)}`;
}

// Format date and time
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format date only
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Format time only
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Calculate cart total
export function calculateCartTotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Status badge color helper
export function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300';
    case 'APPROVED':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300';
    case 'PREPARING':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300';
    case 'READY':
      return 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300';
    case 'COMPLETED':
      return 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300';
  }
}

// Payment mode badge color helper
export function getPaymentModeColor(paymentMode: string): string {
  switch (paymentMode) {
    case 'CASH':
      return 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300';
    case 'UPI':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-300';
    case 'CARD':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300';
  }
}

// Validate product form data
export function validateProductData(data: {
  name: string;
  price: number;
  category: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!data.price || data.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push('Category is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Generate real food images based on product name/category
export function getProductImage(category: string | null, name: string): string {
  const c = (category || '').toLowerCase();
  const n = (name || '').toLowerCase();
  
  // ── Locally Generated Images (Fallback for previously blocked Unsplash images) ──
  if (n.includes('cold coffee') || n.includes('iced coffee'))
    return '/images/cold_coffee.png';
  if (n.includes('gulab jamun'))
    return '/images/gulab_jamun.png';
  if (n.includes('idli'))
    return '/images/idli.png';
  if (n.includes('uttapam') || n.includes('uttappam'))
    return '/images/uttapam.png';
  if (n.includes('spring roll') || n.includes('springroll'))
    return '/images/springroll.png';

  // ── Indian dishes ──
  if (n.includes('dosa') || n.includes('masala dosa'))
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80';
  if (n.includes('paneer'))
    return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80';
  if (n.includes('biryani'))
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80';
  if (n.includes('butter chicken') || n.includes('murgh'))
    return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80';
  if (n.includes('naan') || n.includes('roti') || n.includes('paratha'))
    return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80';
  if (n.includes('dal') || n.includes('daal') || n.includes('lentil'))
    return 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80';
  if (n.includes('samosa'))
    return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80';
  if (n.includes('chaat') || n.includes('pani puri') || n.includes('gol gappa'))
    return 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=800&q=80';
  if (n.includes('tandoori'))
    return 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80';
  if (n.includes('tikka'))
    return 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80';
  if (n.includes('thali'))
    return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80';
  if (n.includes('chole') || n.includes('chana'))
    return 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80';
  if (n.includes('curry'))
    return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80';
  if (n.includes('vada'))
    return 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=800&q=80';
  if (n.includes('pav bhaji'))
    return 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80';

  // ── Beverages ──
  if (n.includes('cappuccino'))
    return 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80';
  if (n.includes('latte'))
    return 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80';
  if (n.includes('espresso'))
    return 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=800&q=80';
  if (n.includes('coffee') || c.includes('coffee'))
    return 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80';
  if (n.includes('tea') || n.includes('chai'))
    return 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80';
  if (n.includes('lassi'))
    return 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=800&q=80';
  if (n.includes('smoothie'))
    return 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80';
  if (n.includes('milkshake') || n.includes('shake'))
    return 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80';
  if (n.includes('lemonade') || n.includes('lime'))
    return 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80';
  if (n.includes('mojito'))
    return 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80';
  if (n.includes('juice') || n.includes('drink') || n.includes('beverage') || c.includes('drink') || c.includes('beverage'))
    return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80';

  // ── Western / International ──
  if (n.includes('sandwich'))
    return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80';
  if (n.includes('burger') || c.includes('burger'))
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
  if (n.includes('pizza') || c.includes('pizza'))
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
  if (n.includes('fries') || n.includes('french fries'))
    return 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80';
  if (n.includes('wrap') || n.includes('burrito'))
    return 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80';
  if (n.includes('soup'))
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80';
  if (n.includes('steak'))
    return 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80';
  if (n.includes('chicken') || n.includes('wings'))
    return 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80';
  if (n.includes('fish') || n.includes('seafood'))
    return 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=800&q=80';

  // ── Desserts & Sweets ──
  if (n.includes('gulab jamun'))
    return 'https://images.unsplash.com/photo-1666190066824-4d45529a8e15?auto=format&fit=crop&w=800&q=80';
  if (n.includes('ice cream') || n.includes('gelato'))
    return 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80';
  if (n.includes('brownie'))
    return 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80';
  if (n.includes('cake'))
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80';
  if (n.includes('dessert') || n.includes('sweet') || c.includes('dessert'))
    return 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80';

  // ── Pasta / Noodles ──
  if (n.includes('pasta') || c.includes('pasta') || n.includes('spaghetti'))
    return 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80';
  if (n.includes('noodle') || n.includes('chow'))
    return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80';

  // ── Salad / Healthy ──
  if (n.includes('salad') || c.includes('salad'))
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80';

  // ── Rice ──
  if (n.includes('rice') || n.includes('fried rice') || n.includes('pulao'))
    return 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80';

  // ── Category-level fallbacks ──
  if (c.includes('starter') || c.includes('appetizer'))
    return 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80';
  if (c.includes('main') || c.includes('course'))
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80';
  if (c.includes('tea') || c.includes('coffee'))
    return 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80';
  if (c.includes('snack'))
    return 'https://images.unsplash.com/photo-1599490659213-e2b9527b711e?auto=format&fit=crop&w=800&q=80';

  // Default fallback — elegant restaurant dish
  return 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80';
}
