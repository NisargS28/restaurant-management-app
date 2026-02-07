import { ApiResponse } from './types';

// Base API fetch wrapper
export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Request failed',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Specific API methods
export const api = {
  // Products
  getProducts: () => apiRequest<any>('/api/products'),
  getProduct: (id: number) => apiRequest<any>(`/api/products/${id}`),
  createProduct: (data: any) =>
    apiRequest<any>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id: number, data: any) =>
    apiRequest<any>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  toggleProductStatus: (id: number, isActive: boolean) =>
    apiRequest<any>(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),

  // Orders
  getOrders: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest<any>(`/api/orders${query}`);
  },
  getOrder: (id: number) => apiRequest<any>(`/api/orders/${id}`),
  createOrder: (data: any) =>
    apiRequest<any>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateOrderStatus: (id: number, status: string) =>
    apiRequest<any>(`/api/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Reports
  getDailySales: (date?: string) => {
    const query = date ? `?date=${date}` : '';
    return apiRequest<any>(`/api/reports/daily-sales${query}`);
  },
  getItemSales: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<any>(`/api/reports/item-sales${query}`);
  },
  getPaymentSummary: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<any>(`/api/reports/payment-summary${query}`);
  },

  // Users
  getUsers: () => apiRequest<any>('/api/users'),
};
