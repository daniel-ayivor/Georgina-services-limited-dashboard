// Mock data with simplified interfaces for local use

export interface MockProduct {
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

export interface MockOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  total: number;
  items: MockOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MockOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface MockCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  createdAt: string;
}

export interface MockNotification {
  id: string;
  title: string;
  description: string;
  type: 'order' | 'product' | 'system';
  read: boolean;
  createdAt: string;
}

export const mockProducts: MockProduct[] = [
  {
    id: "prod-1",
    name: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation",
    price: 129.99,
    inventory: 45,
    category: "Electronics",
    image: "/placeholder.svg",
    createdAt: new Date(2023, 5, 15).toISOString(),
    updatedAt: new Date(2023, 6, 20).toISOString()
  },
  {
    id: "prod-2",
    name: "Smart Watch",
    description: "Fitness tracker and smartwatch with heart rate monitor",
    price: 199.99,
    inventory: 28,
    category: "Electronics",
    image: "/placeholder.svg",
    createdAt: new Date(2023, 4, 10).toISOString(),
    updatedAt: new Date(2023, 7, 5).toISOString()
  },
  {
    id: "prod-3",
    name: "Bluetooth Speaker",
    description: "Waterproof portable bluetooth speaker",
    price: 79.99,
    inventory: 62,
    category: "Electronics",
    image: "/placeholder.svg",
    createdAt: new Date(2023, 2, 22).toISOString(),
    updatedAt: new Date(2023, 5, 18).toISOString()
  },
  {
    id: "prod-4",
    name: "Organic Cotton T-Shirt",
    description: "Soft, sustainable organic cotton t-shirt",
    price: 24.99,
    inventory: 120,
    category: "Clothing",
    image: "/placeholder.svg",
    createdAt: new Date(2023, 3, 5).toISOString(),
    updatedAt: new Date(2023, 6, 30).toISOString()
  },
  {
    id: "prod-5",
    name: "Stainless Steel Water Bottle",
    description: "Insulated water bottle that keeps drinks cold for 24 hours",
    price: 34.99,
    inventory: 85,
    category: "Home Goods",
    image: "/placeholder.svg",
    createdAt: new Date(2023, 1, 12).toISOString(),
    updatedAt: new Date(2023, 7, 8).toISOString()
  }
];

export const mockOrders: MockOrder[] = [
  {
    id: "ord-1",
    customerName: "John Smith",
    customerEmail: "john.smith@example.com",
    status: "completed",
    paymentStatus: "paid",
    total: 129.99,
    items: [
      {
        productId: "prod-1",
        productName: "Wireless Headphones",
        quantity: 1,
        price: 129.99
      }
    ],
    createdAt: new Date(2023, 7, 15).toISOString(),
    updatedAt: new Date(2023, 7, 15).toISOString()
  },
  {
    id: "ord-2",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@example.com",
    status: "processing",
    paymentStatus: "paid",
    total: 234.98,
    items: [
      {
        productId: "prod-3",
        productName: "Bluetooth Speaker",
        quantity: 1,
        price: 79.99
      },
      {
        productId: "prod-4",
        productName: "Organic Cotton T-Shirt",
        quantity: 2,
        price: 24.99
      }
    ],
    createdAt: new Date(2023, 7, 16).toISOString(),
    updatedAt: new Date(2023, 7, 17).toISOString()
  },
  {
    id: "ord-3",
    customerName: "Michael Chen",
    customerEmail: "michael.c@example.com",
    status: "pending",
    paymentStatus: "unpaid",
    total: 199.99,
    items: [
      {
        productId: "prod-2",
        productName: "Smart Watch",
        quantity: 1,
        price: 199.99
      }
    ],
    createdAt: new Date(2023, 7, 18).toISOString(),
    updatedAt: new Date(2023, 7, 18).toISOString()
  },
  {
    id: "ord-4",
    customerName: "Emily Davis",
    customerEmail: "emily.d@example.com",
    status: "cancelled",
    paymentStatus: "refunded",
    total: 79.99,
    items: [
      {
        productId: "prod-3",
        productName: "Bluetooth Speaker",
        quantity: 1,
        price: 79.99
      }
    ],
    createdAt: new Date(2023, 7, 10).toISOString(),
    updatedAt: new Date(2023, 7, 12).toISOString()
  },
  {
    id: "ord-5",
    customerName: "Robert Wilson",
    customerEmail: "robert.w@example.com",
    status: "completed",
    paymentStatus: "paid",
    total: 69.98,
    items: [
      {
        productId: "prod-4",
        productName: "Organic Cotton T-Shirt",
        quantity: 2,
        price: 24.99
      }
    ],
    createdAt: new Date(2023, 7, 8).toISOString(),
    updatedAt: new Date(2023, 7, 9).toISOString()
  }
];

export const mockCustomers: MockCustomer[] = [
  {
    id: "cust-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    orders: 3,
    totalSpent: 245.97,
    createdAt: new Date(2023, 2, 15).toISOString()
  },
  {
    id: "cust-2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "555-234-5678",
    orders: 5,
    totalSpent: 467.93,
    createdAt: new Date(2023, 1, 20).toISOString()
  },
  {
    id: "cust-3",
    name: "Michael Chen",
    email: "michael.c@example.com",
    phone: "555-345-6789",
    orders: 1,
    totalSpent: 199.99,
    createdAt: new Date(2023, 6, 10).toISOString()
  },
  {
    id: "cust-4",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "555-456-7890",
    orders: 2,
    totalSpent: 114.98,
    createdAt: new Date(2023, 4, 5).toISOString()
  },
  {
    id: "cust-5",
    name: "Robert Wilson",
    email: "robert.w@example.com",
    phone: "555-567-8901",
    orders: 4,
    totalSpent: 324.95,
    createdAt: new Date(2023, 3, 28).toISOString()
  }
];

export const mockNotifications: MockNotification[] = [
  {
    id: "notif-1",
    title: "New order received",
    description: "Order #ORD-3 has been placed by Michael Chen",
    type: "order",
    read: false,
    createdAt: new Date(2023, 7, 18, 14, 35).toISOString()
  },
  {
    id: "notif-2",
    title: "Low inventory alert",
    description: "Smart Watch is running low on stock (5 remaining)",
    type: "product",
    read: false,
    createdAt: new Date(2023, 7, 18, 10, 15).toISOString()
  },
  {
    id: "notif-3",
    title: "Payment received",
    description: "Payment for Order #ORD-2 has been processed successfully",
    type: "order",
    read: true,
    createdAt: new Date(2023, 7, 17, 16, 22).toISOString()
  },
  {
    id: "notif-4",
    title: "System maintenance",
    description: "Scheduled maintenance will occur on August 25th at 2:00 AM",
    type: "system",
    read: true,
    createdAt: new Date(2023, 7, 16, 9, 0).toISOString()
  },
  {
    id: "notif-5",
    title: "Order cancelled",
    description: "Order #ORD-4 has been cancelled by customer",
    type: "order",
    read: true,
    createdAt: new Date(2023, 7, 12, 13, 45).toISOString()
  }
];

// Analytics mock data
export const mockRevenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
  { name: 'Jul', revenue: 7000 },
  { name: 'Aug', revenue: 8500 },
];

export const mockSalesData = {
  total: 25670,
  percentageChange: 12.5,
  trend: 'up'
};

export const mockOrdersData = {
  total: 356,
  percentageChange: 8.2,
  trend: 'up'
};

export const mockCustomersData = {
  total: 1205,
  percentageChange: 5.7,
  trend: 'up'
};

export const mockInventoryData = {
  total: 340,
  percentageChange: -2.3,
  trend: 'down'
};
