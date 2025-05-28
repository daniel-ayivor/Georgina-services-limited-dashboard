-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category_id UUID REFERENCES categories(id),
    image_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES cart(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert admin user (password should be hashed in production)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Insert admin profile
INSERT INTO public.profiles (id, user_id, first_name, last_name, phone)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'Admin',
  'User',
  '+1234567890'
) ON CONFLICT (id) DO NOTHING;

-- Insert categories
INSERT INTO public.categories (id, name, description) VALUES
  ('c1', 'Electronics', 'Electronic devices and accessories'),
  ('c2', 'Clothing', 'Fashion and apparel'),
  ('c3', 'Home & Kitchen', 'Home appliances and kitchenware'),
  ('c4', 'Books', 'Books and publications'),
  ('c5', 'Sports', 'Sports equipment and accessories')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (id, name, description, price, stock_quantity, category_id, image_url, created_by) VALUES
  ('p1', 'Smartphone X', 'Latest model smartphone with advanced features', 699.99, 50, 'c1', 'https://example.com/smartphone.jpg', '00000000-0000-0000-0000-000000000000'),
  ('p2', 'Laptop Pro', 'High-performance laptop for professionals', 1299.99, 30, 'c1', 'https://example.com/laptop.jpg', '00000000-0000-0000-0000-000000000000'),
  ('p3', 'Wireless Earbuds', 'Premium wireless earbuds with noise cancellation', 199.99, 100, 'c1', 'https://example.com/earbuds.jpg', '00000000-0000-0000-0000-000000000000'),
  ('p4', 'Men''s T-Shirt', 'Comfortable cotton t-shirt', 29.99, 200, 'c2', 'https://example.com/tshirt.jpg', '00000000-0000-0000-0000-000000000000'),
  ('p5', 'Women''s Dress', 'Elegant summer dress', 59.99, 150, 'c2', 'https://example.com/dress.jpg', '00000000-0000-0000-0000-000000000000'),
  ('p6', 'Coffee Maker', 'Programmable coffee maker with thermal carafe', 89.99, 75, 'c3', 'https://example.com/coffee-maker.jpg', '00000000-0000-0000-0000-000000000000'),
  ('p7', 'Blender', 'High-speed blender for smoothies and more', 79.99, 60, 'c3', 'https://example.com/blender.jpg', '00000000-0000-0000-0000-000000000000'),
  ('p8', 'Novel Collection', 'Bestselling novels box set', 49.99, 100, 'c4', 'https://example.com/books.jpg', '00000000-0000-0000-0000-000000000000'),
  ('p9', 'Yoga Mat', 'Premium non-slip yoga mat', 39.99, 120, 'c5', 'https://example.com/yoga-mat.jpg', '00000000-0000-0000-0000-000000000000'),
  ('p10', 'Running Shoes', 'Lightweight running shoes with cushioning', 89.99, 80, 'c5', 'https://example.com/shoes.jpg', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;

-- Insert sample customer user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'customer@example.com',
  crypt('customer123', gen_salt('bf')),
  now(),
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Insert customer profile
INSERT INTO public.profiles (id, user_id, first_name, last_name, phone, address)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000002',
  'John',
  'Doe',
  '+1987654321',
  '123 Main St, City, Country'
) ON CONFLICT (id) DO NOTHING;

-- Create a sample cart for the customer
INSERT INTO public.cart (id, user_id)
VALUES (
  '00000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000002'
) ON CONFLICT (id) DO NOTHING;

-- Add some items to the cart
INSERT INTO public.cart_items (id, cart_id, product_id, quantity)
VALUES
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000004', 'p1', 1),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000004', 'p3', 2)
ON CONFLICT (id) DO NOTHING;

-- Create a sample order
INSERT INTO public.orders (id, user_id, total_amount, status)
VALUES (
  '00000000-0000-0000-0000-000000000007',
  '00000000-0000-0000-0000-000000000002',
  899.97,
  'completed'
) ON CONFLICT (id) DO NOTHING;

-- Add items to the order
INSERT INTO public.order_items (id, order_id, product_id, quantity, price_at_time)
VALUES
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000007', 'p2', 1, 1299.99),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000007', 'p4', 2, 29.99)
ON CONFLICT (id) DO NOTHING; 