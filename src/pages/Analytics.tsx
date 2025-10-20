import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Activity,
  Target
} from "lucide-react";
import { mockOrders, mockProducts, mockCustomers, mockRevenueData } from "@/data/mock-data";

export default function Analytics() {
  // Revenue calculations
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const lastMonthRevenue = totalRevenue * 0.88; // Simulate 12% growth
  const revenueGrowth = ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  // Order calculations
  const totalOrders = mockOrders.length;
  const completedOrders = mockOrders.filter(o => o.status === 'completed').length;
  const pendingOrders = mockOrders.filter(o => o.status === 'pending').length;
  const orderCompletionRate = (completedOrders / totalOrders) * 100;

  // Product calculations
  const totalProducts = mockProducts.length;
  const totalInventoryValue = mockProducts.reduce((sum, p) => sum + (p.price * p.inventory), 0);
  const lowStockProducts = mockProducts.filter(p => p.inventory < 30).length;

  // Customer calculations
  const totalCustomers = mockCustomers.length;
  const avgCustomerValue = totalRevenue / totalCustomers;

  // Order status distribution
  const orderStatusData = [
    { name: 'Completed', value: mockOrders.filter(o => o.status === 'completed').length, color: '#10b981' },
    { name: 'Processing', value: mockOrders.filter(o => o.status === 'processing').length, color: '#3b82f6' },
    { name: 'Pending', value: mockOrders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
    { name: 'Cancelled', value: mockOrders.filter(o => o.status === 'cancelled').length, color: '#ef4444' },
  ];

  // Category performance
  const categoryData = mockProducts.reduce((acc: any[], product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.count += 1;
      existing.value += product.price * product.inventory;
    } else {
      acc.push({
        name: product.category,
        count: 1,
        value: product.price * product.inventory,
      });
    }
    return acc;
  }, []);

  // Daily orders trend (simulated)
  const dailyOrdersData = [
    { date: 'Mon', orders: 12, revenue: 1540 },
    { date: 'Tue', orders: 19, revenue: 2340 },
    { date: 'Wed', orders: 15, revenue: 1890 },
    { date: 'Thu', orders: 22, revenue: 2800 },
    { date: 'Fri', orders: 25, revenue: 3200 },
    { date: 'Sat', orders: 18, revenue: 2150 },
    { date: 'Sun', orders: 14, revenue: 1780 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive business insights and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{revenueGrowth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {orderCompletionRate.toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ${avgCustomerValue.toFixed(2)} avg value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</div>
            <p className="text-xs text-warning mt-1">
              {lowStockProducts} low stock items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Daily Orders
            </CardTitle>
            <CardDescription>Order volume this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Order Status Distribution
            </CardTitle>
            <CardDescription>Breakdown of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Category Performance
            </CardTitle>
            <CardDescription>Inventory value by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="hsl(var(--primary))" name="Value ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed</span>
                <span className="font-medium">{completedOrders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pending</span>
                <span className="font-medium">{pendingOrders}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Success Rate</span>
                <span className="text-success">{orderCompletionRate.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Product Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Products</span>
                <span className="font-medium">{totalProducts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Low Stock</span>
                <span className="font-medium text-warning">{lowStockProducts}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Stock Health</span>
                <span className="text-success">
                  {((1 - lowStockProducts / totalProducts) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Customers</span>
                <span className="font-medium">{totalCustomers}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg Order Value</span>
                <span className="font-medium">${(totalRevenue / totalOrders).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Customer LTV</span>
                <span className="text-success">${avgCustomerValue.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
