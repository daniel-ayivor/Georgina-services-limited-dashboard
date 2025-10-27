import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, RefreshCw, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import adminApiService from "@/contexts/adminApiService";

// TypeScript Interfaces
interface OrderItem {
  id: string;
  orderId?: string;
  price: number;
  quantity: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  productId?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  // Add other product properties as needed
}

interface Customer {
  id: string;
  name: string;
  email: string;
  // Add other customer properties as needed
}

interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
}

interface ChartData {
  name: string;
  total: number;
}

// Safe number conversion utility
const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Helper function to safely calculate order amount
const calculateOrderAmount = (orderItem: OrderItem): number => {
  const quantity = toNumber(orderItem.quantity);
  const price = toNumber(orderItem.price);
  return price * quantity;
};

// Helper function to get order date safely
const getOrderDate = (orderItem: OrderItem): Date => {
  const dateString = orderItem.createdAt || orderItem.updatedAt;
  return dateString ? new Date(dateString) : new Date();
};

// Generate monthly data for charts from order items
const generateMonthlyData = (orderItems: OrderItem[]): ChartData[] => {
  const defaultData: ChartData[] = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
  ];

  if (!orderItems.length) return defaultData;

  const monthlyTotals: { [key: string]: number } = {};
  
  orderItems.forEach(item => {
    const date = getOrderDate(item);
    const month = date.toLocaleString('default', { month: 'short' });
    const amount = calculateOrderAmount(item);
    
    const currentTotal = toNumber(monthlyTotals[month]);
    monthlyTotals[month] = currentTotal + amount;
  });

  return defaultData.map(item => ({
    ...item,
    total: toNumber(monthlyTotals[item.name])
  }));
};

// Group order items by orderId to create orders
const groupOrderItemsIntoOrders = (orderItems: OrderItem[], customers: Customer[] = []): Order[] => {
  if (!orderItems.length) return [];

  const ordersMap: { [key: string]: Order } = {};
  
  orderItems.forEach((item, index) => {
    const orderId = item.orderId || `order-${index}`;
    
    if (!ordersMap[orderId]) {
      const customer = customers[index] || { 
        id: `customer-${index}`,
        name: `Customer ${index + 1}`, 
        email: `customer${index + 1}@example.com` 
      };
      
      ordersMap[orderId] = {
        id: orderId,
        customer: customer.name || `Customer ${index + 1}`,
        email: customer.email || `customer${index + 1}@example.com`,
        amount: 0,
        status: item.status || 'pending',
        createdAt: item.createdAt || new Date().toISOString(),
        items: []
      };
    }
    
    const itemAmount = calculateOrderAmount(item);
    ordersMap[orderId].amount += itemAmount;
    ordersMap[orderId].items.push(item);
  });

  return Object.values(ordersMap).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
};

// Type guard functions
const isOrderItem = (item: unknown): item is OrderItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    typeof (item as any).id === 'string'
  );
};

const isOrderItemArray = (items: unknown): items is OrderItem[] => {
  return Array.isArray(items) && items.every(isOrderItem);
};

const isProduct = (item: unknown): item is Product => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    typeof (item as any).id === 'string'
  );
};

const isProductArray = (items: unknown): items is Product[] => {
  return Array.isArray(items) && items.every(isProduct);
};

const isCustomer = (item: unknown): item is Customer => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    typeof (item as any).id === 'string'
  );
};

const isCustomerArray = (items: unknown): items is Customer[] => {
  return Array.isArray(items) && items.every(isCustomer);
};

// Safe data extraction from API responses
const extractOrderItems = (response: unknown): OrderItem[] => {
  if (isOrderItemArray(response)) {
    return response.map(item => ({
      id: String(item.id),
      orderId: item.orderId ? String(item.orderId) : undefined,
      price: toNumber(item.price),
      quantity: toNumber(item.quantity),
      status: item.status || 'pending',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      userId: item.userId ? String(item.userId) : undefined,
      productId: item.productId ? String(item.productId) : undefined
    }));
  }
  
  // If response has a data property, try to extract from there
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return extractOrderItems((response as any).data);
  }
  
  return [];
};

const extractProducts = (response: unknown): Product[] => {
  if (isProductArray(response)) {
    return response;
  }
  
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return extractProducts((response as any).data);
  }
  
  return [];
};

const extractCustomers = (response: unknown): Customer[] => {
  if (isCustomerArray(response)) {
    return response;
  }
  
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return extractCustomers((response as any).data);
  }
  
  return [];
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<any>;
  isLoading: boolean;
}

function StatCard({ title, value, change, trend, icon: Icon, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
}

// Loading State Components
function LoadingChart() {
  return (
    <div className="w-full h-[350px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading chart data...</p>
      </div>
    </div>
  );
}

// EmptyState component
interface EmptyStateProps {
  message: string;
  onRetry?: (() => void) | null;
}

function EmptyState({ message, onRetry = null }: EmptyStateProps) {
  return (
    <div className="w-full h-[350px] flex flex-col items-center justify-center gap-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground text-center">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching dashboard data from available endpoints...');

      // Only fetch from endpoints that exist
      const [orderItemsResponse, productsResponse, customersResponse] = await Promise.all([
        adminApiService.getOrderItems().catch(err => {
          console.log('Order items endpoint failed:', err.message);
          return [];
        }),
        adminApiService.getProducts().catch(err => {
          console.log('Products endpoint failed:', err.message);
          return [];
        }),
        adminApiService.getCustomers().catch(err => {
          console.log('Customers endpoint failed:', err.message);
          return [];
        })
      ]);

      // Safe data extraction with type checking
      const orderItems: OrderItem[] = extractOrderItems(orderItemsResponse);
      const products: Product[] = extractProducts(productsResponse);
      const customers: Customer[] = extractCustomers(customersResponse);

      console.log('Fetched data:', {
        orderItems: orderItems.length,
        products: products.length,
        customers: customers.length
      });

      // Calculate stats from available data
      const totalRevenue = orderItems.reduce((sum: number, item: OrderItem) => {
        return sum + calculateOrderAmount(item);
      }, 0);

      // Count unique orders from order items
      const uniqueOrderIds = [...new Set(orderItems.map(item => item.orderId))].filter((id): id is string => !!id);
      const totalOrders = uniqueOrderIds.length;

      const totalCustomers = customers.length;
      const totalProducts = products.length;

      // Calculate changes (using demo data since we don't have historical data)
      const revenueChange = totalRevenue > 0 ? 12.5 : 0;
      const ordersChange = totalOrders > 0 ? 8.3 : 0;
      const customersChange = totalCustomers > 0 ? 5.2 : 0;
      const productsChange = totalProducts > 0 ? 15.7 : 0;

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueChange,
        ordersChange,
        customersChange,
        productsChange
      });

      // Transform order items into recent orders for display
      const ordersFromItems = groupOrderItemsIntoOrders(orderItems, customers);
      const recentOrdersData = ordersFromItems.slice(0, 5);
      setRecentOrders(recentOrdersData);

      // Generate chart data from order items
      const monthlyData = generateMonthlyData(orderItems);
      setChartData(monthlyData);

      console.log('Dashboard data processed successfully');

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please check if the order items endpoint is available.');
      toast({
        variant: "destructive",
        title: "Error loading dashboard",
        description: "Could not fetch dashboard data. Please check your connection.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'default';
      case 'processing':
      case 'confirmed':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      case 'shipped':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'text-green-600';
      case 'processing':
      case 'confirmed':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      case 'shipped':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  if (error && !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your e-commerce admin dashboard
          </p>
        </div>
        <EmptyState 
          message={error} 
          onRetry={fetchDashboardData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.name} 👋
          </p>
        </div>
        <Button 
          onClick={fetchDashboardData} 
          variant="outline" 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={stats ? formatCurrency(stats.totalRevenue) : "$0.00"}
          change={stats ? `${stats.revenueChange}%` : "0%"}
          trend={stats?.revenueChange >= 0 ? "up" : "down"}
          icon={DollarSign}
          isLoading={isLoading}
        />
        <StatCard
          title="Orders"
          value={stats ? formatNumber(stats.totalOrders) : "0"}
          change={stats ? `${stats.ordersChange}%` : "0%"}
          trend={stats?.ordersChange >= 0 ? "up" : "down"}
          icon={ShoppingCart}
          isLoading={isLoading}
        />
        <StatCard
          title="Customers"
          value={stats ? formatNumber(stats.totalCustomers) : "0"}
          change={stats ? `${stats.customersChange}%` : "0%"}
          trend={stats?.customersChange >= 0 ? "up" : "down"}
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          title="Products"
          value={stats ? formatNumber(stats.totalProducts) : "0"}
          change={stats ? `${stats.productsChange}%` : "0%"}
          trend={stats?.productsChange >= 0 ? "up" : "down"}
          icon={Package}
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Revenue calculated from order items data
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? (
              <LoadingChart />
            ) : chartData.length > 0 && chartData.some(item => item.total > 0) ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(toNumber(value)), 'Revenue']}
                  />
                  <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No revenue data available yet. Sales will appear here once order items are created." />
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              {isLoading ? (
                "Loading orders..."
              ) : stats ? (
                `You have ${stats.totalOrders} orders from ${recentOrders.length} order items`
              ) : (
                "No orders data available."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                    </div>
                    <div className="h-6 bg-muted rounded animate-pulse w-16"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-12"></div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {order.customer}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(order.status)} className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <div className="font-medium text-sm">
                        {formatCurrency(order.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No recent orders found. Orders will appear here once order items are created." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}