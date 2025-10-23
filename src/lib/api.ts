// Real API service for dashboard integration
import type { Product, Order, Customer, Category, SubCategory, CleaningBooking, User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://georgina-server-code.onrender.com';

// Helper function for simulating API delay in fallback cases
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface AuthResponse {
  token: string;
  user: User;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Try to get token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/admin/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/api/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getUserInfo(): Promise<User> {
    return this.request<User>(`/api/auth/userinfo`);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/api/categories');
  }

  async createCategory(category: FormData): Promise<Category> {
    // Special handling for FormData
    const url = `${this.baseUrl}/api/admin/categories`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: category,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async updateCategory(id: string, category: FormData): Promise<Category> {
    // Special handling for FormData
    const url = `${this.baseUrl}/api/admin/categories/${id}`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: category,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async deleteCategory(id: string): Promise<void> {
    return this.request<void>(`/api/admin/categories/${id}`, {
      method: 'DELETE'
    });
  }

  // Subcategories
  async getSubCategories(): Promise<SubCategory[]> {
    return this.request<SubCategory[]>('/api/subcategories');
  }

  async getSubCategoriesByParent(parentId: string): Promise<SubCategory[]> {
    return this.request<SubCategory[]>(`/api/subcategories/parent/${parentId}`);
  }

  async createSubCategory(subcategory: FormData): Promise<SubCategory> {
    // Special handling for FormData
    const url = `${this.baseUrl}/api/admin/subcategories`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: subcategory,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async updateSubCategory(id: string, subcategory: FormData): Promise<SubCategory> {
    // Special handling for FormData
    const url = `${this.baseUrl}/api/admin/subcategories/${id}`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: subcategory,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async deleteSubCategory(id: string): Promise<void> {
    return this.request<void>(`/api/admin/subcategories/${id}`, {
      method: 'DELETE'
    });
  }

  // Products
  async getProducts(page = 1, limit = 10, category?: string, subcategory?: string): Promise<{ products: Product[], total: number }> {
    let endpoint = `/api/products?page=${page}&limit=${limit}`;
    if (category) endpoint += `&category=${category}`;
    if (subcategory) endpoint += `&subcategory=${subcategory}`;
    return this.request<{ products: Product[], total: number }>(endpoint);
  }

  async getProductById(id: string): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`);
  }

  async createProduct(product: FormData): Promise<Product> {
    // Special handling for FormData
    const url = `${this.baseUrl}/api/admin/products`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: product,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async updateProduct(id: string, product: FormData): Promise<Product> {
    // Special handling for FormData
    const url = `${this.baseUrl}/api/admin/products/${id}`;
    const headers: HeadersInit = {};
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: product,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/api/admin/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/api/admin/orders');
  }

  async getOrderById(id: string): Promise<Order> {
    return this.request<Order>(`/api/admin/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return this.request<Order>(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return this.request<Customer[]>('/api/admin/customers');
  }

  async getCustomerById(id: string): Promise<Customer> {
    return this.request<Customer>(`/api/admin/customers/${id}`);
  }

  // Cleaning Bookings
  async getCleaningBookings(): Promise<CleaningBooking[]> {
    return this.request<CleaningBooking[]>('/api/admin/cleaning/bookings');
  }

  async getCleaningBookingById(id: string): Promise<CleaningBooking> {
    return this.request<CleaningBooking>(`/api/admin/cleaning/bookings/${id}`);
  }

  async updateCleaningBookingStatus(id: string, status: string): Promise<CleaningBooking> {
    return this.request<CleaningBooking>(`/api/admin/cleaning/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    return this.request<any>('/api/admin/analytics');
  }
}

export const apiService = new ApiService(API_BASE_URL);

// Import mock data for fallback
import { mockProducts, mockOrders, mockCustomers } from "@/data/mock-data";

// Product Management with API integration
export const getProducts = async (): Promise<Product[]> => {
  try {
    const result = await apiService.getProducts();
    return result.products;
  } catch (error) {
    console.error('Failed to fetch products from API, using mock data:', error);
  await delay(300);
  return mockProducts;
  }
};

export const createProduct = async (product: FormData): Promise<Product> => {
  try {
    return await apiService.createProduct(product);
  } catch (error) {
    console.error('Failed to create product via API, using mock response:', error);
  await delay(300);
    // Create a mock product for fallback
  const newProduct = {
    id: `prod-${Date.now()}`,
      name: product.get('name') as string || 'New Product',
      description: product.get('description') as string || 'Product description',
      price: Number(product.get('price')) || 0,
      inventory: Number(product.get('inventory')) || 0,
      category: product.get('category') as string || 'default',
      image: 'placeholder.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newProduct;
  }
};

export const updateProduct = async (id: string, product: FormData): Promise<Product> => {
  try {
    return await apiService.updateProduct(id, product);
  } catch (error) {
    console.error('Failed to update product via API, using mock response:', error);
  await delay(300);
  const existingProduct = mockProducts.find(p => p.id === id);
  if (!existingProduct) throw new Error('Product not found');
  
    // Create updated product from existing and form data
  return {
    ...existingProduct,
      name: product.get('name') as string || existingProduct.name,
      description: product.get('description') as string || existingProduct.description,
      price: Number(product.get('price')) || existingProduct.price,
      inventory: Number(product.get('inventory')) || existingProduct.inventory,
      category: product.get('category') as string || existingProduct.category,
    updatedAt: new Date().toISOString(),
  };
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await apiService.deleteProduct(id);
  } catch (error) {
    console.error('Failed to delete product via API:', error);
  await delay(300);
  // In a real app, this would delete from the database
  }
};

// Order Management with API integration
export const getOrders = async (): Promise<Order[]> => {
  try {
    return await apiService.getOrders();
  } catch (error) {
    console.error('Failed to fetch orders from API, using mock data:', error);
  await delay(300);
  return mockOrders;
  }
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  try {
    return await apiService.updateOrderStatus(id, status);
  } catch (error) {
    console.error('Failed to update order via API, using mock response:', error);
  await delay(300);
  const order = mockOrders.find(o => o.id === id);
  if (!order) throw new Error('Order not found');
  
  return {
    ...order,
    status: status as any,
    updatedAt: new Date().toISOString(),
  };
  }
};

// Customer Management with API integration
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    return await apiService.getCustomers();
  } catch (error) {
    console.error('Failed to fetch customers from API, using mock data:', error);
  await delay(300);
  return mockCustomers;
  }
};

// Categories Management with API integration
export const getCategories = async () => {
  try {
    return await apiService.getCategories();
  } catch (error) {
    console.error('Failed to fetch categories from API, using mock data:', error);
    await delay(300);
    return [];
  }
};

export const createCategory = async (category: any) => {
  try {
    return await apiService.createCategory(category);
  } catch (error) {
    console.error('Failed to create category via API, using mock response:', error);
    await delay(300);
    return {
      ...category,
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

export const updateCategory = async (id: string, category: any) => {
  try {
    return await apiService.updateCategory(id, category);
  } catch (error) {
    console.error('Failed to update category via API, using mock response:', error);
    await delay(300);
    return {
      ...category,
      id,
      updatedAt: new Date().toISOString(),
    };
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await apiService.deleteCategory(id);
  } catch (error) {
    console.error('Failed to delete category via API:', error);
    await delay(300);
  }
};

// Subcategories Management with API integration
export const getSubCategories = async () => {
  try {
    return await apiService.getSubCategories();
  } catch (error) {
    console.error('Failed to fetch subcategories from API, using mock data:', error);
    await delay(300);
    return [];
  }
};

export const createSubCategory = async (subcategory: any) => {
  try {
    return await apiService.createSubCategory(subcategory);
  } catch (error) {
    console.error('Failed to create subcategory via API, using mock response:', error);
    await delay(300);
    return {
      ...subcategory,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

export const updateSubCategory = async (id: string, subcategory: any) => {
  try {
    return await apiService.updateSubCategory(id, subcategory);
  } catch (error) {
    console.error('Failed to update subcategory via API, using mock response:', error);
    await delay(300);
    return {
      ...subcategory,
      id,
      updatedAt: new Date().toISOString(),
    };
  }
};

export const deleteSubCategory = async (id: string): Promise<void> => {
  try {
    await apiService.deleteSubCategory(id);
  } catch (error) {
    console.error('Failed to delete subcategory via API:', error);
    await delay(300);
  }
};
