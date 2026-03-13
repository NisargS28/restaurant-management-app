// Type definitions — replaces @prisma/client imports with inline types

export type Role = 'CASHIER' | 'KITCHEN';

export type PaymentMode = 'CASH' | 'UPI' | 'CARD';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';

export interface User {
  id: number;
  name: string;
  role: Role;
}

export interface Product {
  id: number;
  name: string;
  price: number | string;
  category: string | null;
  isActive: boolean;
}

export interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number | string;
  createdAt: string;
  paymentMode: PaymentMode | null;
  status: OrderStatus;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number | string;
  product: Product;
}

// Extended types for API responses
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderWithItems extends Order {
  orderItems: (OrderItem & {
    product: Product;
  })[];
}

export interface OrderItemCreate {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  items: OrderItemCreate[];
  totalAmount: number;
  paymentMode: PaymentMode;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface ProductFormData {
  name: string;
  price: number;
  category: string;
  isActive?: boolean;
}

// Report types
export interface DailySalesReport {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  ordersByPaymentMode: Record<string, number>;
}

export interface ItemSalesReport {
  productId: number;
  productName: string;
  category: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface PaymentModeSummary {
  paymentMode: PaymentMode;
  count: number;
  totalAmount: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
