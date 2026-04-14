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
      return 'bg-yellow-100 text-yellow-800';
    case 'APPROVED':
      return 'bg-orange-100 text-orange-800';
    case 'PREPARING':
      return 'bg-blue-100 text-blue-800';
    case 'READY':
      return 'bg-green-100 text-green-800';
    case 'COMPLETED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Payment mode badge color helper
export function getPaymentModeColor(paymentMode: string): string {
  switch (paymentMode) {
    case 'CASH':
      return 'bg-green-100 text-green-800';
    case 'UPI':
      return 'bg-purple-100 text-purple-800';
    case 'CARD':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
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

// Generate fallback aesthetic images for products
export function getProductImage(category: string | null, name: string): string {
  const c = (category || '').toLowerCase();
  const n = (name || '').toLowerCase();
  
  // Specific Indian/Menu item mappings
  if (n.includes('dosa')) return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80';
  if (n.includes('idli')) return 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=800&q=80';
  if (n.includes('uttapam') || n.includes('uttappam')) return 'https://images.unsplash.com/photo-1627308595229-7830f5c9c66e?auto=format&fit=crop&w=800&q=80';
  if (n.includes('cold coffee')) return 'https://images.unsplash.com/photo-1461023058943-0708e52150fe?auto=format&fit=crop&w=800&q=80';
  if (n.includes('coffee') || c.includes('coffee') || c.includes('tea')) return 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80';
  if (n.includes('sandwich')) return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80';
  
  // Generic category mappings
  if (n.includes('burger') || c.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
  if (n.includes('pizza') || c.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
  if (n.includes('drink') || n.includes('beverage') || c.includes('drink') || c.includes('beverage') || n.includes('juice')) return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80';
  if (n.includes('dessert') || n.includes('cake') || n.includes('sweet') || c.includes('dessert')) return 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80';
  if (n.includes('pasta') || c.includes('pasta') || n.includes('spaghetti')) return 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80';
  if (n.includes('salad') || c.includes('salad')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80';
  if (c.includes('starter') || c.includes('appetizer')) return 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80';
  if (c.includes('main') || c.includes('course')) return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80';
  
  // Default fallback image
  return 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80';
}

