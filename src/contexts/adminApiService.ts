

// import { API_BASE_URL } from "@/lib/api";

// // Types
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   contact?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // In your adminApiService file - change this:
// export interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   type: 'info' | 'success' | 'warning' | 'error';
//   read: boolean;
//   userId?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // In your adminApiService file - update the AppNotification interface:
// export interface AppNotification {
//   id: string;
//   title: string;
//   message: string;
//   type: 'order' | 'booking' | 'contact' | 'product' | 'system' | 'info' | 'success' | 'warning' | 'error';
//   read: boolean;
//   userId?: string;
//   createdAt: string;
//   updatedAt: string;
// }
// // Add to your existing types in the API service file
// export interface ContactMessage {
//   id: string;
//   name: string;
//   email: string;
//   message: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface ContactFormData {
//   name: string;
//   email: string;
//   message: string;
// }
// // In your adminApiService file - CORRECT TYPES:

// // Service interface (for cleaning services)
// export interface CleaningService {
//   id: string;
//   name: string;
//   displayName: string;
//   description: string;
//   price: number;
//   duration: number;
//   features: string[];
//   icon?: string;
//   category: 'residential' | 'commercial' | 'specialized';
//   status: 'active' | 'inactive';
//   displayOrder: number;
//   createdAt: string;
//   updatedAt: string;
// }

// // Booking interface (separate from services)
// export interface CleaningBooking {
//   id: string;
//   customerName: string;
//   customerEmail: string;
//   customerPhone: string;
//   serviceType: string;
//   address: string;
//   date: string;
//   time: string;
//   duration: number;
//   price: number;
//   status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
//   notes?: string;
//   specialInstructions?: string;
//   bookingReference?: string;
//   createdAt: string;
//   updatedAt: string;
// }
// // In src/types/product.ts
// // In your product types
// export interface Product {
//   id: string;
//   name: string;
//   slug: string;
//   description: string | null;
//   price: string;
//   categoryLevel1: string;
//   categoryLevel2: string;
//   categoryLevel3: string;
//   serviceType: 'physical' | 'digital';
//   serviceDuration: string | null;
//   unit: string;
//   stock: number;
//   images: string[];
//   isActive: boolean;
//   tags: string[];
//   brand: string | null;
//   createdAt: string;
//   updatedAt: string;
  
//   // NEW FIELDS FOR SPECIAL CATEGORIES
//   isFeatured: boolean;
//   isTrending: boolean;
//   isNewArrival: boolean;
//   featuredOrder: number;
//   trendingOrder: number;
//   newArrivalOrder: number;
// }

// // Add these new interfaces for special products
// export interface SpecialProductsResponse {
//   products: Product[];
//   analytics?: {
//     totalFeatured: number;
//     totalTrending: number;
//     totalNewArrivals: number;
//     activeFeatured: number;
//     activeTrending: number;
//     activeNewArrivals: number;
//   };
//   pagination?: {
//     currentPage: number;
//     totalPages: number;
//     totalProducts: number;
//     hasNext: boolean;
//     hasPrev: boolean;
//   };
// }

// export interface BulkSpecialUpdate {
//   products: Array<{
//     productId: string;
//     updates: {
//       isFeatured?: boolean;
//       isTrending?: boolean;
//       isNewArrival?: boolean;
//       featuredOrder?: number;
//       trendingOrder?: number;
//       newArrivalOrder?: number;
//     };
//   }>;
// }

// export interface BulkUpdateResponse {
//   results: Array<{ productId: string; success: boolean }>;
//   errors: Array<{ productId: string; error: string }>;
//   message: string;
// }


// interface Order {
//   id: string;
//   customerName: string;
//   customerEmail: string;
//   status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'shipped' | 'delivered';
//   paymentStatus: 'paid' | 'unpaid' | 'refunded';
//   total: number;
//   items: OrderItem[];
//   createdAt: string;
//   updatedAt: string;
// }
// export interface OrderItem {
//   id: string;
//   productId: string;
//   quantity: number;
//   price: number;
// }

// export interface Category {
//   id: string;
//   name: string;
//   slug: string;
//   level: number;
//   parentId?: string;
//   description?: string;
//   image?: string;
//   sortOrder: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface SubCategory {
//   id: string;
//   name: string;
//   slug: string;
//   description?: string;
//   categoryId: string;
//   image?: string;
//   isActive: boolean;
//   sortOrder: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   contact?: string;
//   address?: string;
//   createdAt: string;
//   updatedAt: string;
// }



// export interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   type: 'info' | 'success' | 'warning' | 'error';
//   read: boolean;
//   userId?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface AuthResponse {
//   token: string;
//   user: User;
//   admin?: User;
// }

// export interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   orders?: Order[];
// }

// export interface OrdersResponse {
//   orders: Order[];
//   data?: Order[]; // Make data optional
// }

// class AdminApiService {
//   private baseUrl: string;
//   private token: string | null = null;

//   constructor(baseUrl: string) {
//     this.baseUrl = baseUrl;
//     this.token = localStorage.getItem('e-commerce-admin-token');
//   }


  
//   setToken(token: string) {
//     this.token = token;
//     localStorage.setItem('e-commerce-admin-token', token);
//   }

//   clearToken() {
//     this.token = null;
//     localStorage.removeItem('e-commerce-admin-token');
//   }

//   private async request(endpoint: string, options: RequestInit = {}) {
//     const url = `${this.baseUrl}${endpoint}`;
//     const headers = {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     };

//     if (this.token) {
//       headers['Authorization'] = `Bearer ${this.token}`;
//     }

//     const config = {
//       headers,
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);
      
//       if (response.status === 401) {
//         this.clearToken();
//         localStorage.removeItem('e-commerce-admin-user');
//         throw new Error('Authentication failed. Please login again.');
//       }

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//       }
      
//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         return await response.json();
//       }
      
//       return {};
//     } catch (error) {
//       console.error('API request failed:', error);
//       throw error;
//     }
//   }

// // Fix the getOrders method to use the correct endpoint
// async getOrders(): Promise<Order[]> {
//   try {
//     const response = await this.request('/api/admin/orders');
//     return response.orders || response.data || [];
//   } catch (error) {
//     console.warn('Orders endpoint not available, using fallback data:', error);
//     return this.getFallbackOrders();
//   }
// }

// // Add fallback orders data
// private getFallbackOrders(): Order[] {
//   return [
//     {
//       id: 'order-1',
//       customerName: 'John Doe',
//       customerEmail: 'john.doe@example.com',
//       status: 'pending',
//       paymentStatus: 'unpaid',
//       total: 150.00,
//       items: [
//         { id: 'item-1', productId: 'prod-1', quantity: 2, price: 75.00 }
//       ],
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     },
//     {
//       id: 'order-2',
//       customerName: 'Jane Smith',
//       customerEmail: 'jane.smith@example.com',
//       status: 'completed',
//       paymentStatus: 'paid',
//       total: 89.99,
//       items: [
//         { id: 'item-2', productId: 'prod-2', quantity: 1, price: 89.99 }
//       ],
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     }
//   ];
// }


// // 📧 CONTACT MESSAGES MANAGEMENT
// async submitContactForm(contactData: ContactFormData) {
//   return this.request('/api/contact', {
//     method: 'POST',
//     body: JSON.stringify(contactData),
//   });
// }

// async getAllContactMessages(): Promise<ContactMessage[]> {
//   const response = await this.request('/api/admin/contact/messages');
//   return response || [];
// }

// async getContactMessageById(id: string): Promise<ContactMessage> {
//   return this.request(`/api/admin/contact/messages/${id}`);
// }

// async deleteContactMessage(id: string) {
//   return this.request(`/api/admin/contact/messages/${id}`, {
//     method: 'DELETE',
//   });
// }
//   private async requestWithFormData(endpoint: string, formData: FormData, method = 'POST') {
//     const url = `${this.baseUrl}${endpoint}`;
//     const headers = {};

//     if (this.token) {
//       headers['Authorization'] = `Bearer ${this.token}`;
//     }

//     try {
//       const response = await fetch(url, {
//         method,
//         headers,
//         body: formData,
//       });

//       if (response.status === 401) {
//         this.clearToken();
//         localStorage.removeItem('e-commerce-admin-user');
//         throw new Error('Authentication failed. Please login again.');
//       }

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//       }

//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         return await response.json();
//       }

//       return {};
//     } catch (error) {
//       console.error('API request failed:', error);
//       throw error;
//     }
//   }

//   // 🔐 AUTHENTICATION
//   async login(email, password) {
//     const data = await this.request('/api/auth/admin/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     });
    
//     if (data.token) {
//       this.setToken(data.token);
//     }
    
//     return data;
//   }

//   async register(name, email, password, contact) {
//     return this.request('/api/auth/admin/register', {
//       method: 'POST',
//       body: JSON.stringify({ name, email, password, contact }),
//     });
//   }

//   async getUserInfo(userId) {
//     return this.request(`/api/auth/userinfo/${userId}`);
//   }

//   // 👥 USER MANAGEMENT
//   async getUsers() {
//     return this.request('/api/user/getUsers');
//   }

//   async getUserById(id) {
//     return this.request(`/api/user/getUser/${id}`);
//   }

//   async createUser(userData) {
//     return this.request('/api/user/create', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     });
//   }

//   async updateUser(id, userData) {
//     return this.request(`/api/user/update/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(userData),
//     });
//   }

//   async deleteUser(id) {
//     return this.request(`/api/user/delete/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   // 🛍️ PRODUCT MANAGEMENT
//   async getProducts() {
//     const response = await this.request('/api/admin/products');
//     return response.products || [];
//   }

//   async getProductById(id) {
//     return this.request(`/api/admin/products/${id}`);
//   }

//   async createProduct(productData) {
//     return this.requestWithFormData('/api/admin/products', productData, 'POST');
//   }

//   async updateProduct(id, productData) {
//     return this.requestWithFormData(`/api/admin/products/${id}`, productData, 'PUT');
//   }

//   async deleteProduct(id) {
//     return this.request(`/api/admin/products/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   async toggleProductStatus(id) {
//     return this.request(`/api/admin/products/${id}/toggle-status`, {
//       method: 'PATCH',
//     });
//   }

  

// // 📦 CATEGORY MANAGEMENT
//   async getCategories() {
//     return this.request('/api/categories');
//   }

//   async getCategoryById(id) {
//     return this.request(`/api/categories/${id}`);
//   }

//   async getCategoryTree() {
//     return this.request('/api/categories-tree');
//   }

//   // ✅ FIXED: Use regular request for categories (JSON, not FormData)
//   async createCategory(categoryData) {
//     return this.request('/api/admin/categories', {
//       method: 'POST',
//       body: JSON.stringify(categoryData),
//     });
//   }

//   // ✅ FIXED: Use regular request for categories (JSON, not FormData)
//   async updateCategory(id, categoryData) {
//     return this.request(`/api/admin/categories/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(categoryData),
//     });
//   }

//   async deleteCategory(id) {
//     return this.request(`/api/admin/categories/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   // Additional utility methods for your category routes
//   async getCategoriesByLevel(level) {
//     return this.request(`/api/categories/level/${level}`);
//   }

//   async getCategoriesByParent(parentId) {
//     return this.request(`/api/categories/parent/${parentId}`);
//   }

//   async getCategoryChildren(id) {
//     return this.request(`/api/categories/${id}/children`);
//   }

//   // Bulk create categories
//   async bulkCreateCategories(categoriesData) {
//     return this.request('/api/admin/categories/bulk', {
//       method: 'POST',
//       body: JSON.stringify(categoriesData),
//     });
//   }

 

//   async getOrderItems() {
//     return this.request('/api/admin/order-items');
//   }

//   async getOrderItemById(id) {
//     return this.request(`/api/admin/order-items/${id}`);
//   }

//   async createOrderItem(orderItemData) {
//     return this.request('/api/admin/order-items', {
//       method: 'POST',
//       body: JSON.stringify(orderItemData),
//     });
//   }

//   async updateOrderItem(id, orderItemData) {
//     return this.request(`/api/admin/order-items/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(orderItemData),
//     });
//   }

//   async deleteOrderItem(id) {
//     return this.request(`/api/admin/order-items/${id}`, {
//       method: 'DELETE',
//     });
//   }


//   // In your adminApiService - ensure getAdminOrders returns proper data
// async getAdminOrders(): Promise<{ orders: Order[] }> {
//   const response = await this.request('/api/admin/orders');
//   return response;
// }




//   // Get all bookings (admin only)
//   async getAdminCleaningBookings() {
//     return this.request('/api/admin/bookings');
//   }

//   // Create booking as admin
//   async createAdminCleaningBooking(bookingData: any) {
//     return this.request('/api/admin/bookings', {
//       method: 'POST',
//       body: JSON.stringify(bookingData),
//     });
//   }

//   // Update any booking (admin only)
// // In your adminApiService - FIXED VERSION
// async updateAdminCleaningBooking(id: string | number, bookingData: any) {
//   // Convert to number if it's a string, otherwise use as-is
//   const bookingId = typeof id === 'string' ? parseInt(id, 10) : id;
  
//   return this.request(`/api/admin/bookings/${bookingId}`, {
//     method: 'PUT',
//     body: JSON.stringify(bookingData),
//   });
// }

//   // Delete any booking (admin only)
//   async deleteAdminCleaningBooking(id: string) {
//     return this.request(`/api/admin/bookings/${id}`, {
//       method: 'DELETE',
//     });
//   }




//   // User views their specific booking
//   // 👤 CUSTOMERS

//   async getCustomerById(id) {
//     return this.request(`/api/customers/${id}`);
//   }

//   async createCustomer(customerData) {
//     return this.request('/api/customers', {
//       method: 'POST',
//       body: JSON.stringify(customerData),
//     });
//   }

//   async updateCustomer(id, customerData) {
//     return this.request(`/api/customers/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(customerData),
//     });
//   }

//   async deleteCustomer(id) {
//     return this.request(`/api/customers/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   // 🔔 NOTIFI


//   // 💰 PAYMENTS
//   async createPaymentIntent(paymentData) {
//     return this.request('/api/payment', {
//       method: 'POST',
//       body: JSON.stringify(paymentData),
//     });
//   }

//   async confirmPayment(confirmationData) {
//     return this.request('/api/confirm-payment', {
//       method: 'POST',
//       body: JSON.stringify(confirmationData),
//     });
//   }





//   // Create booking (customer) - matches your backend route
//   async createUserCleaningBooking(bookingData: any) {
//     return this.request('/api/bookings', {
//       method: 'POST',
//       body: JSON.stringify(bookingData),
//     });
//   }



//   // Updated getCustomers method with fallback
// async getCustomers(): Promise<Customer[]> {
//   try {
//     const response = await this.request('/api/customers');
//     return response.data || response || [];
//   } catch (error) {
//     console.warn('Customers endpoint not available, using fallback data:', error);
//     // Return fallback data for development
//     return this.getFallbackCustomers();
//   }
// }

// // Add fallback customers data
// private getFallbackCustomers(): Customer[] {
//   return [
//     {
//       id: '1',
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       contact: '+1234567890',
//       address: '123 Main St, City, State',
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     },
//     {
//       id: '2', 
//       name: 'Jane Smith',
//       email: 'jane.smith@example.com',
//       contact: '+0987654321',
//       address: '456 Oak Ave, City, State',
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     },
//     {
//       id: '3',
//       name: 'Bob Johnson',
//       email: 'bob.johnson@example.com',
//       contact: '+1122334455',
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     }
//   ];
// }

//   async getDashboardStats() {
//     return this.request('/api/admin/analytics/dashboard-stats');
//   }

//   async getSalesReport(startDate: string, endDate: string) {
//     return this.request(`/api/admin/analytics/sales-report?startDate=${startDate}&endDate=${endDate}`);
//   }


// // 🔔 NOTIFICATION METHODS
// async getUnreadNotifications(): Promise<AppNotification[]> {
//   const response = await this.request('/api/notifications/unread');
//   return response || [];
// }

// async getNotificationStats() {
//   return this.request('/api/notifications/stats');
// }

// async markNotificationAsRead(id: string) {
//   return this.request(`/api/notifications/${id}/read`, {
//     method: 'PATCH',
//   });
// }

// async markAllNotificationsAsRead() {
//   return this.request('/api/notifications/mark-all-read', {
//     method: 'PATCH',
//   });
// }

// // Also update any other notification methods to use AppNotification
// async getNotifications(): Promise<AppNotification[]> {
//   const response = await this.request('/api/notifications');
//   return response || [];
// }

// async getNotificationById(id: string): Promise<AppNotification> {
//   return this.request(`/api/notifications/${id}`);
// }

// async createNotification(notificationData: Partial<AppNotification>) {
//   return this.request('/api/notifications', {
//     method: 'POST',
//     body: JSON.stringify(notificationData),
//   });
// }

// async updateNotification(id: string, notificationData: Partial<AppNotification>) {
//   return this.request(`/api/notifications/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(notificationData),
//   });
// }

// async deleteNotification(id: string) {
//   return this.request(`/api/notifications/${id}`, {
//     method: 'DELETE',
//   });
// }




// // In your adminApiService class - CORRECTED SERVICE METHODS:

// // Get all services (admin only) - CORRECTED
// async getCleaningServices(): Promise<CleaningService[]> {
//   const response = await this.request('/api/admin/services');
//   // Handle different response structures
//   if (response.data && response.data.services) {
//     return response.data.services;
//   } else if (response.services) {
//     return response.services;
//   } else if (Array.isArray(response)) {
//     return response;
//   } else if (response.data && Array.isArray(response.data)) {
//     return response.data;
//   }
//   return [];
// }

// // Create new service (admin only) - CORRECTED
// async createCleaningService(serviceData: any): Promise<{ data: CleaningService }> {
//   return this.request('/api/admin/services', {
//     method: 'POST',
//     body: JSON.stringify(serviceData),
//   });
// }

// // Update service (admin only) - CORRECTED
// async updateCleaningService(id: string, serviceData: any): Promise<{ data: CleaningService }> {
//   return this.request(`/api/admin/services/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(serviceData),
//   });
// }

// // Update service status (admin only) - ADD THIS METHOD
// async updateCleaningServiceStatus(id: string, status: 'active' | 'inactive'): Promise<{ data: CleaningService }> {
//   return this.request(`/api/admin/services/${id}/status`, {
//     method: 'PATCH',
//     body: JSON.stringify({ status }),
//   });
// }

// // Delete service (admin only) - CORRECTED
// async deleteCleaningService(id: string): Promise<{ message: string }> {
//   return this.request(`/api/admin/services/${id}`, {
//     method: 'DELETE',
//   });
// }

// // Get active services for users to select from - CORRECTED
// async getActiveCleaningServices(): Promise<CleaningService[]> {
//   const response = await this.request('/api/admin/services/active');
//   // Handle different response structures
//   if (response.data && response.data.services) {
//     return response.data.services;
//   } else if (response.services) {
//     return response.services;
//   } else if (Array.isArray(response)) {
//     return response;
//   } else if (response.data && Array.isArray(response.data)) {
//     return response.data;
//   }
//   return [];
// }

// // Get service by ID (admin only) - ADD THIS METHOD
// async getCleaningServiceById(id: string): Promise<{ data: CleaningService }> {
//   return this.request(`/api/admin/services/${id}`);
// }

// // Get service statistics (admin only) - ADD THIS METHOD
// async getServiceStats(): Promise<any> {
//   return this.request('/api/admin/services/stats');
// }

// // Reorder services (admin only) - ADD THIS METHOD
// async reorderServices(orderUpdates: Array<{ id: string; displayOrder: number }>): Promise<{ message: string }> {
//   return this.request('/api/admin/services/reorder', {
//     method: 'PATCH',
//     body: JSON.stringify({ orderUpdates }),
//   });
// }
// }




 


// export const adminApiService = new AdminApiService(API_BASE_URL);
// export default adminApiService;


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
  icon?: string;
  category: 'residential' | 'commercial' | 'specialized';
  status: 'active' | 'inactive';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CleaningBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  address: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  specialInstructions?: string;
  bookingReference?: string;
  createdAt: string;
  updatedAt: string;
}

// In your types file (e.g., src/types/index.ts or src/types/product.ts)
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
  
  // ADD THESE NEW FIELDS:
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  featuredOrder: number;
  trendingOrder: number;
  newArrivalOrder: number;
}

export interface SpecialProductsResponse {
  products: Product[];
  analytics?: {
    totalFeatured: number;
    totalTrending: number;
    totalNewArrivals: number;
    activeFeatured: number;
    activeTrending: number;
    activeNewArrivals: number;
  };
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BulkSpecialUpdate {
  products: Array<{
    productId: string;
    updates: {
      isFeatured?: boolean;
      isTrending?: boolean;
      isNewArrival?: boolean;
      featuredOrder?: number;
      trendingOrder?: number;
      newArrivalOrder?: number;
    };
  }>;
}

export interface BulkUpdateResponse {
  results: Array<{ productId: string; success: boolean }>;
  errors: Array<{ productId: string; error: string }>;
  message: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'shipped' | 'delivered';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  total: number;
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

export interface AuthResponse {
  token: string;
  user: User;
  admin?: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  orders?: Order[];
}

export interface OrdersResponse {
  orders: Order[];
  data?: Order[];
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

  // 🆕 SPECIAL PRODUCTS ENDPOINTS

  /**
   * Get featured products (public endpoint)
   */
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const endpoint = `/api/products/special/featured${limit ? `?limit=${limit}` : ''}`;
    const response = await this.request(endpoint);
    return response.products || [];
  }

  /**
   * Get trending products (public endpoint)
   */
  async getTrendingProducts(limit?: number): Promise<Product[]> {
    const endpoint = `/api/products/special/trending${limit ? `?limit=${limit}` : ''}`;
    const response = await this.request(endpoint);
    return response.products || [];
  }

  /**
   * Get new arrivals (public endpoint)
   */
  async getNewArrivals(params?: { limit?: number; days?: number }): Promise<Product[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.days) queryParams.append('days', params.days.toString());

    const queryString = queryParams.toString();
    const endpoint = `/api/products/special/new-arrivals${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.request(endpoint);
    return response.products || [];
  }

  /**
   * Get all special products for admin with analytics
   */
  async getAdminSpecialProducts(params?: {
    type?: 'featured' | 'trending' | 'new-arrivals';
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<SpecialProductsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.type) queryParams.append('type', params.type);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `/api/admin/products/special${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  /**
   * Get products not in any special categories (for adding new ones)
   */
  async getProductsNotInSpecialCategories(params?: {
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<{ products: Product[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `/api/admin/products/special/available-products${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  /**
   * Update a product's special categories
   */
  async updateProductSpecialCategories(
    productId: string, 
    updates: {
      isFeatured?: boolean;
      isTrending?: boolean;
      isNewArrival?: boolean;
      featuredOrder?: number;
      trendingOrder?: number;
      newArrivalOrder?: number;
    }
  ): Promise<{ product: Product; message: string }> {
    return this.request(`/api/admin/products/special/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Bulk update special categories for multiple products
   */
  async bulkUpdateSpecialCategories(
    updates: BulkSpecialUpdate
  ): Promise<BulkUpdateResponse> {
    return this.request('/api/admin/products/special/bulk/update', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Bulk add products to featured category
   */
  async bulkAddToFeatured(productIds: string[]): Promise<BulkUpdateResponse> {
    const updates = {
      products: productIds.map(id => ({
        productId: id,
        updates: { isFeatured: true }
      }))
    };
    return this.bulkUpdateSpecialCategories(updates);
  }

  /**
   * Bulk add products to trending category
   */
  async bulkAddToTrending(productIds: string[]): Promise<BulkUpdateResponse> {
    const updates = {
      products: productIds.map(id => ({
        productId: id,
        updates: { isTrending: true }
      }))
    };
    return this.bulkUpdateSpecialCategories(updates);
  }

  /**
   * Bulk add products to new arrivals category
   */
  async bulkAddToNewArrivals(productIds: string[]): Promise<BulkUpdateResponse> {
    const updates = {
      products: productIds.map(id => ({
        productId: id,
        updates: { isNewArrival: true }
      }))
    };
    return this.bulkUpdateSpecialCategories(updates);
  }

  /**
   * Bulk remove products from all special categories
   */
  async bulkRemoveFromSpecialCategories(productIds: string[]): Promise<BulkUpdateResponse> {
    const updates = {
      products: productIds.map(id => ({
        productId: id,
        updates: { 
          isFeatured: false,
          isTrending: false, 
          isNewArrival: false 
        }
      }))
    };
    return this.bulkUpdateSpecialCategories(updates);
  }

  // 🔐 AUTHENTICATION
  async login(email: string, password: string) {
    const data = await this.request('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async register(name: string, email: string, password: string, contact: string) {
    return this.request('/api/auth/admin/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, contact }),
    });
  }

  async getUserInfo(userId: string) {
    return this.request(`/api/auth/userinfo/${userId}`);
  }

  // 👥 USER MANAGEMENT
  async getUsers() {
    return this.request('/api/user/getUsers');
  }

  async getUserById(id: string) {
    return this.request(`/api/user/getUser/${id}`);
  }

  async createUser(userData: any) {
    return this.request('/api/user/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/api/user/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/api/user/delete/${id}`, {
      method: 'DELETE',
    });
  }

  // 🛍️ PRODUCT MANAGEMENT
  async getProducts() {
    const response = await this.request('/api/admin/products');
    return response.products || [];
  }

  async getProductById(id: string) {
    return this.request(`/api/admin/products/${id}`);
  }

  async createProduct(productData: FormData) {
    return this.requestWithFormData('/api/admin/products', productData, 'POST');
  }

  async updateProduct(id: string, productData: FormData) {
    return this.requestWithFormData(`/api/admin/products/${id}`, productData, 'PUT');
  }

  async deleteProduct(id: string) {
    return this.request(`/api/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleProductStatus(id: string) {
    return this.request(`/api/admin/products/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }

  // 📦 CATEGORY MANAGEMENT
  async getCategories() {
    return this.request('/api/categories');
  }

  async getCategoryById(id: string) {
    return this.request(`/api/categories/${id}`);
  }

  async getCategoryTree() {
    return this.request('/api/categories-tree');
  }

  async createCategory(categoryData: any) {
    return this.request('/api/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: any) {
    return this.request(`/api/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/api/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async getCategoriesByLevel(level: number) {
    return this.request(`/api/categories/level/${level}`);
  }

  async getCategoriesByParent(parentId: string) {
    return this.request(`/api/categories/parent/${parentId}`);
  }

  async getCategoryChildren(id: string) {
    return this.request(`/api/categories/${id}/children`);
  }

  async bulkCreateCategories(categoriesData: any) {
    return this.request('/api/admin/categories/bulk', {
      method: 'POST',
      body: JSON.stringify(categoriesData),
    });
  }

  // 📊 ORDERS
  async getOrders(): Promise<Order[]> {
    try {
      const response = await this.request('/api/admin/orders');
      return response.orders || response.data || [];
    } catch (error) {
      console.warn('Orders endpoint not available, using fallback data:', error);
      return this.getFallbackOrders();
    }
  }

  async getAdminOrders(): Promise<{ orders: Order[] }> {
    const response = await this.request('/api/admin/orders');
    return response;
  }

  async getOrderItems() {
    return this.request('/api/admin/order-items');
  }

  async getOrderItemById(id: string) {
    return this.request(`/api/admin/order-items/${id}`);
  }

  async createOrderItem(orderItemData: any) {
    return this.request('/api/admin/order-items', {
      method: 'POST',
      body: JSON.stringify(orderItemData),
    });
  }

  async updateOrderItem(id: string, orderItemData: any) {
    return this.request(`/api/admin/order-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderItemData),
    });
  }

  async deleteOrderItem(id: string) {
    return this.request(`/api/admin/order-items/${id}`, {
      method: 'DELETE',
    });
  }

  // 🧹 CLEANING SERVICES
  async getAdminCleaningBookings() {
    return this.request('/api/admin/bookings');
  }

  async createAdminCleaningBooking(bookingData: any) {
    return this.request('/api/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateAdminCleaningBooking(id: string | number, bookingData: any) {
    const bookingId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    return this.request(`/api/admin/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  }

  async deleteAdminCleaningBooking(id: string) {
    return this.request(`/api/admin/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  async createUserCleaningBooking(bookingData: any) {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // 👤 CUSTOMERS
  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await this.request('/api/customers');
      return response.data || response || [];
    } catch (error) {
      console.warn('Customers endpoint not available, using fallback data:', error);
      return this.getFallbackCustomers();
    }
  }

  async getCustomerById(id: string) {
    return this.request(`/api/customers/${id}`);
  }

  async createCustomer(customerData: any) {
    return this.request('/api/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async updateCustomer(id: string, customerData: any) {
    return this.request(`/api/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(id: string) {
    return this.request(`/api/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // 💰 PAYMENTS
  async createPaymentIntent(paymentData: any) {
    return this.request('/api/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async confirmPayment(confirmationData: any) {
    return this.request('/api/confirm-payment', {
      method: 'POST',
      body: JSON.stringify(confirmationData),
    });
  }

  // 📊 ANALYTICS
  async getDashboardStats() {
    return this.request('/api/admin/analytics/dashboard-stats');
  }

  async getSalesReport(startDate: string, endDate: string) {
    return this.request(`/api/admin/analytics/sales-report?startDate=${startDate}&endDate=${endDate}`);
  }

  // 📧 CONTACT MESSAGES
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

  // 🔔 NOTIFICATIONS
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

  // 🧹 CLEANING SERVICES
  async getCleaningServices(): Promise<CleaningService[]> {
    const response = await this.request('/api/admin/services');
    if (response.data && response.data.services) {
      return response.data.services;
    } else if (response.services) {
      return response.services;
    } else if (Array.isArray(response)) {
      return response;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  async createCleaningService(serviceData: any): Promise<{ data: CleaningService }> {
    return this.request('/api/admin/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateCleaningService(id: string, serviceData: any): Promise<{ data: CleaningService }> {
    return this.request(`/api/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  }

  async updateCleaningServiceStatus(id: string, status: 'active' | 'inactive'): Promise<{ data: CleaningService }> {
    return this.request(`/api/admin/services/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteCleaningService(id: string): Promise<{ message: string }> {
    return this.request(`/api/admin/services/${id}`, {
      method: 'DELETE',
    });
  }

  async getActiveCleaningServices(): Promise<CleaningService[]> {
    const response = await this.request('/api/admin/services/active');
    if (response.data && response.data.services) {
      return response.data.services;
    } else if (response.services) {
      return response.services;
    } else if (Array.isArray(response)) {
      return response;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  async getCleaningServiceById(id: string): Promise<{ data: CleaningService }> {
    return this.request(`/api/admin/services/${id}`);
  }

  async getServiceStats(): Promise<any> {
    return this.request('/api/admin/services/stats');
  }

  async reorderServices(orderUpdates: Array<{ id: string; displayOrder: number }>): Promise<{ message: string }> {
    return this.request('/api/admin/services/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ orderUpdates }),
    });
  }

  // Fallback data methods
  private getFallbackOrders(): Order[] {
    return [
      {
        id: 'order-1',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        status: 'pending',
        paymentStatus: 'unpaid',
        total: 150.00,
        items: [
          { id: 'item-1', productId: 'prod-1', quantity: 2, price: 75.00 }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'order-2',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@example.com',
        status: 'completed',
        paymentStatus: 'paid',
        total: 89.99,
        items: [
          { id: 'item-2', productId: 'prod-2', quantity: 1, price: 89.99 }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  private getFallbackCustomers(): Customer[] {
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '+1234567890',
        address: '123 Main St, City, State',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2', 
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        contact: '+0987654321',
        address: '456 Oak Ave, City, State',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        contact: '+1122334455',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
}

export const adminApiService = new AdminApiService(API_BASE_URL);
export default adminApiService;