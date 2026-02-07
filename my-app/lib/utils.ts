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
