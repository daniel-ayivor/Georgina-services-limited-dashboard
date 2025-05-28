import { supabase } from './supabase';
import type { Product, Category, Order, User, Profile } from './supabase';

// Product Management
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)');
  if (error) throw error;
  return data;
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// Category Management
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  if (error) throw error;
  return data;
};

// Order Management
export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      users:user_id(email),
      order_items(
        *,
        products(*)
      )
    `);
  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// User Management
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      profiles(*)
    `);
  if (error) throw error;
  return data;
};

// Authentication
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}; 