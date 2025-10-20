// Mock API functions using dummy data
import { mockProducts, mockOrders, mockCustomers } from "@/data/mock-data";
import type { Product, Order, Customer } from "@/types";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Product Management
export const getProducts = async (): Promise<Product[]> => {
  await delay(300);
  return mockProducts;
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  await delay(300);
  const newProduct = {
    ...product,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newProduct;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  await delay(300);
  const existingProduct = mockProducts.find(p => p.id === id);
  if (!existingProduct) throw new Error('Product not found');
  
  return {
    ...existingProduct,
    ...product,
    updatedAt: new Date().toISOString(),
  };
};

export const deleteProduct = async (id: string): Promise<void> => {
  await delay(300);
  // In a real app, this would delete from the database
};

// Order Management
export const getOrders = async (): Promise<Order[]> => {
  await delay(300);
  return mockOrders;
};

export const updateOrderStatus = async (id: string, status: string): Promise<Order> => {
  await delay(300);
  const order = mockOrders.find(o => o.id === id);
  if (!order) throw new Error('Order not found');
  
  return {
    ...order,
    status: status as any,
    updatedAt: new Date().toISOString(),
  };
};

// Customer Management
export const getCustomers = async (): Promise<Customer[]> => {
  await delay(300);
  return mockCustomers;
};
