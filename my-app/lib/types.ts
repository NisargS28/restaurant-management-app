// Re-export Prisma generated types
import type { User, Product, Order, OrderItem, Role, PaymentMode, OrderStatus } from '@prisma/client';
export type { User, Product, Order, OrderItem, Role, PaymentMode, OrderStatus };

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
  ordersByStatus: Record<OrderStatus, number>;
  ordersByPaymentMode: Record<PaymentMode, number>;
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
