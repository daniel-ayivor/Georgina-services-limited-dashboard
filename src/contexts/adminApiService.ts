

import { API_BASE_URL } from "@/lib/api";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  contact?: string;
  createdAt?: string;
  updatedAt?: string;
}

// In your adminApiService file - change this:
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

// In your adminApiService file - update the AppNotification interface:
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'booking' | 'contact' | 'product' | 'system' | 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}
// Add to your existing types in the API service file
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface CleaningService {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
// In src/types/product.ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  categoryLevel1: string;
  categoryLevel2: string;
  categoryLevel3: string;
  serviceType: 'physical' | 'digital';
  serviceDuration: string | null;
  unit: string;
  stock: number;
  images: string[];
  isActive: boolean;
  tags: string[];
  brand: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  level: number;
  parentId?: string;
  description?: string;
  image?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  contact?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CleaningBooking {
  id: string;
  userId: string;
  serviceType: string;
  date: string;
  time: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  admin?: User;
}

class AdminApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('e-commerce-admin-token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('e-commerce-admin-token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('e-commerce-admin-token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        this.clearToken();
        localStorage.removeItem('e-commerce-admin-user');
        throw new Error('Authentication failed. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return {};
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }


  // Add these methods to your AdminApiService class

// 📧 CONTACT MESSAGES MANAGEMENT
async submitContactForm(contactData: ContactFormData) {
  return this.request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  });
}

async getAllContactMessages(): Promise<ContactMessage[]> {
  const response = await this.request('/api/admin/contact/messages');
  return response || [];
}

async getContactMessageById(id: string): Promise<ContactMessage> {
  return this.request(`/api/admin/contact/messages/${id}`);
}

async deleteContactMessage(id: string) {
  return this.request(`/api/admin/contact/messages/${id}`, {
    method: 'DELETE',
  });
}
  private async requestWithFormData(endpoint: string, formData: FormData, method = 'POST') {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: formData,
      });

      if (response.status === 401) {
        this.clearToken();
        localStorage.removeItem('e-commerce-admin-user');
        throw new Error('Authentication failed. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return {};
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 🔐 AUTHENTICATION
  async login(email, password) {
    const data = await this.request('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async register(name, email, password, contact) {
    return this.request('/api/auth/admin/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, contact }),
    });
  }

  async getUserInfo(userId) {
    return this.request(`/api/auth/userinfo/${userId}`);
  }

  // 👥 USER MANAGEMENT
  async getUsers() {
    return this.request('/api/user/getUsers');
  }

  async getUserById(id) {
    return this.request(`/api/user/getUser/${id}`);
  }

  async createUser(userData) {
    return this.request('/api/user/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/api/user/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/api/user/delete/${id}`, {
      method: 'DELETE',
    });
  }

  // 🛍️ PRODUCT MANAGEMENT
  async getProducts() {
    const response = await this.request('/api/admin/products');
    return response.products || [];
  }

  async getProductById(id) {
    return this.request(`/api/admin/products/${id}`);
  }

  async createProduct(productData) {
    return this.requestWithFormData('/api/admin/products', productData, 'POST');
  }

  async updateProduct(id, productData) {
    return this.requestWithFormData(`/api/admin/products/${id}`, productData, 'PUT');
  }

  async deleteProduct(id) {
    return this.request(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleProductStatus(id) {
    return this.request(`/api/admin/products/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }

  

// 📦 CATEGORY MANAGEMENT
  async getCategories() {
    return this.request('/api/categories');
  }

  async getCategoryById(id) {
    return this.request(`/api/categories/${id}`);
  }

  async getCategoryTree() {
    return this.request('/api/categories-tree');
  }

  // ✅ FIXED: Use regular request for categories (JSON, not FormData)
  async createCategory(categoryData) {
    return this.request('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // ✅ FIXED: Use regular request for categories (JSON, not FormData)
  async updateCategory(id, categoryData) {
    return this.request(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return this.request(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Additional utility methods for your category routes
  async getCategoriesByLevel(level) {
    return this.request(`/api/categories/level/${level}`);
  }

  async getCategoriesByParent(parentId) {
    return this.request(`/api/categories/parent/${parentId}`);
  }

  async getCategoryChildren(id) {
    return this.request(`/api/categories/${id}/children`);
  }

  // Bulk create categories
  async bulkCreateCategories(categoriesData) {
    return this.request('/api/admin/categories/bulk', {
      method: 'POST',
      body: JSON.stringify(categoriesData),
    });
  }

 

  async getOrderItems() {
    return this.request('/api/admin/order-items');
  }

  async getOrderItemById(id) {
    return this.request(`/api/admin/order-items/${id}`);
  }

  async createOrderItem(orderItemData) {
    return this.request('/api/admin/order-items', {
      method: 'POST',
      body: JSON.stringify(orderItemData),
    });
  }

  async updateOrderItem(id, orderItemData) {
    return this.request(`/api/admin/order-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderItemData),
    });
  }

  async deleteOrderItem(id) {
    return this.request(`/api/admin/order-items/${id}`, {
      method: 'DELETE',
    });
  }

  // Optional: If you want a dedicated orders endpoint for admin
  async getAdminOrders() {
    return this.request('/api/admin/orders');
  }

  // Get all services (admin only)
  async getCleaningServices(): Promise<CleaningService[]> {
    const response = await this.request('/api/admin/services');
    return response.services || [];
  }

  // Create new service (admin only)
  async createCleaningService(serviceData: any) {
    return this.request('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  // Update service (admin only)
  async updateCleaningService(id: string, serviceData: any) {
    return this.request(`/api/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  }

  // Delete service (admin only)
  async deleteCleaningService(id: string) {
    return this.request(`/api/admin/services/${id}`, {
      method: 'DELETE',
    });
  }

  // ========================
  // 🔵 USER SERVICE ACCESS
  // ========================

  // Get active services for users to select from
  async getActiveCleaningServices(): Promise<CleaningService[]> {
    const response = await this.request('/api/services');
    return response.services || [];
  }

  // ========================
  // 🔴 ADMIN BOOKING MANAGEMENT
  // ========================

  // Get all bookings (admin only)
  async getAdminCleaningBookings() {
    return this.request('/api/admin/bookings');
  }

  // Create booking as admin
  async createAdminCleaningBooking(bookingData: any) {
    return this.request('/api/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Update any booking (admin only)
  async updateAdminCleaningBooking(id: string, bookingData: any) {
    return this.request(`/api/admin/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  }

  // Delete any booking (admin only)
  async deleteAdminCleaningBooking(id: string) {
    return this.request(`/api/admin/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // ========================
  // 🔵 USER BOOKING ACCESS
  // ========================



  // User views their specific booking
  // 👤 CUSTOMERS
  async getCustomers() {
    return this.request('/api/customers');
  }

  async getCustomerById(id) {
    return this.request(`/api/customers/${id}`);
  }

  async createCustomer(customerData) {
    return this.request('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async updateCustomer(id, customerData) {
    return this.request(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(id) {
    return this.request(`/api/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // 🔔 NOTIFI


  // 💰 PAYMENTS
  async createPaymentIntent(paymentData) {
    return this.request('/api/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async confirmPayment(confirmationData) {
    return this.request('/api/confirm-payment', {
      method: 'POST',
      body: JSON.stringify(confirmationData),
    });
  }





  // Create booking (customer) - matches your backend route
  async createUserCleaningBooking(bookingData: any) {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }






  async getOrders(): Promise<{ orders: Order[] }> {
    return this.request('/api/admin/orders');
  }














  



  async getDashboardStats() {
    return this.request('/api/admin/analytics/dashboard-stats');
  }

  async getSalesReport(startDate: string, endDate: string) {
    return this.request(`/api/admin/analytics/sales-report?startDate=${startDate}&endDate=${endDate}`);
  }



  // In your AdminApiService class - update these methods:

// 🔔 NOTIFICATION METHODS
async getUnreadNotifications(): Promise<AppNotification[]> {
  const response = await this.request('/api/notifications/unread');
  return response || [];
}

async getNotificationStats() {
  return this.request('/api/notifications/stats');
}

async markNotificationAsRead(id: string) {
  return this.request(`/api/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

async markAllNotificationsAsRead() {
  return this.request('/api/notifications/mark-all-read', {
    method: 'PATCH',
  });
}

// Also update any other notification methods to use AppNotification
async getNotifications(): Promise<AppNotification[]> {
  const response = await this.request('/api/notifications');
  return response || [];
}

async getNotificationById(id: string): Promise<AppNotification> {
  return this.request(`/api/notifications/${id}`);
}

async createNotification(notificationData: Partial<AppNotification>) {
  return this.request('/api/notifications', {
    method: 'POST',
    body: JSON.stringify(notificationData),
  });
}

async updateNotification(id: string, notificationData: Partial<AppNotification>) {
  return this.request(`/api/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(notificationData),
  });
}

async deleteNotification(id: string) {
  return this.request(`/api/notifications/${id}`, {
    method: 'DELETE',
  });
}
}



 


export const adminApiService = new AdminApiService(API_BASE_URL);
export default adminApiService;