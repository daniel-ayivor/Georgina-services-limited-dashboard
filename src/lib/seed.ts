import { supabase } from './supabase';

export async function seedDatabase() {
  try {
    // Create admin user
    const { data: adminData, error: adminError } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'admin123',
      options: {
        data: {
          role: 'admin',
        },
      },
    });

    if (adminError) throw adminError;
    const adminId = adminData.user?.id;

    // Create admin profile
    if (adminId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: adminId,
          first_name: 'Admin',
          last_name: 'User',
          phone: '+1234567890',
        });
      if (profileError) throw profileError;
    }

    // Create customer user
    const { data: customerData, error: customerError } = await supabase.auth.signUp({
      email: 'customer@example.com',
      password: 'customer123',
      options: {
        data: {
          role: 'customer',
        },
      },
    });

    if (customerError) throw customerError;
    const customerId = customerData.user?.id;

    // Create customer profile
    if (customerId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: customerId,
          first_name: 'John',
          last_name: 'Doe',
          phone: '+1987654321',
          address: '123 Main St, City, Country',
        });
      if (profileError) throw profileError;
    }

    // Insert products
    const { error: productsError } = await supabase.from('products').insert([
      {
        id: 'p1',
        name: 'Smartphone X',
        description: 'Latest model smartphone with advanced features',
        price: 699.99,
        stock_quantity: 50,
        category_id: 'c1',
        image_url: 'https://example.com/smartphone.jpg',
        created_by: adminId,
      },
      {
        id: 'p2',
        name: 'Laptop Pro',
        description: 'High-performance laptop for professionals',
        price: 1299.99,
        stock_quantity: 30,
        category_id: 'c1',
        image_url: 'https://example.com/laptop.jpg',
        created_by: adminId,
      },
      {
        id: 'p3',
        name: 'Wireless Earbuds',
        description: 'Premium wireless earbuds with noise cancellation',
        price: 199.99,
        stock_quantity: 100,
        category_id: 'c1',
        image_url: 'https://example.com/earbuds.jpg',
        created_by: adminId,
      },
      {
        id: 'p4',
        name: "Men's T-Shirt",
        description: 'Comfortable cotton t-shirt',
        price: 29.99,
        stock_quantity: 200,
        category_id: 'c2',
        image_url: 'https://example.com/tshirt.jpg',
        created_by: adminId,
      },
      {
        id: 'p5',
        name: "Women's Dress",
        description: 'Elegant summer dress',
        price: 59.99,
        stock_quantity: 150,
        category_id: 'c2',
        image_url: 'https://example.com/dress.jpg',
        created_by: adminId,
      },
    ]);

    if (productsError) throw productsError;

    // Create cart for customer
    if (customerId) {
      const { data: cartData, error: cartError } = await supabase
        .from('cart')
        .insert({
          user_id: customerId,
        })
        .select()
        .single();

      if (cartError) throw cartError;

      // Add items to cart
      if (cartData) {
        const { error: cartItemsError } = await supabase.from('cart_items').insert([
          {
            cart_id: cartData.id,
            product_id: 'p1',
            quantity: 1,
          },
          {
            cart_id: cartData.id,
            product_id: 'p3',
            quantity: 2,
          },
        ]);

        if (cartItemsError) throw cartItemsError;
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
} 