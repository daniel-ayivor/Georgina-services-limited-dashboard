
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  inventory: number;
  category: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'order' | 'product' | 'system';
  read: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CleaningBooking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  date: string;
  time: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: 'basic' | 'deep' | 'office' | 'post-construction';
  address: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
