
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartBig, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from "lucide-react";
import { 
  mockRevenueData, 
  mockSalesData, 
  mockOrdersData, 
  mockCustomersData, 
  mockInventoryData,
  mockOrders 
} from "@/data/mock-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Sales"
          value={`$${mockSalesData.total.toLocaleString()}`}
          description={`${mockSalesData.percentageChange}% from last month`}
          icon={BarChartBig}
          trend={mockSalesData.trend}
        />
        <MetricCard
          title="Orders"
          value={mockOrdersData.total.toString()}
          description={`${mockOrdersData.percentageChange}% from last month`}
          icon={ShoppingCart}
          trend={mockOrdersData.trend}
        />
        <MetricCard
          title="Customers"
          value={mockCustomersData.total.toString()}
          description={`${mockCustomersData.percentageChange}% from last month`}
          icon={Users}
          trend={mockCustomersData.trend}
        />
        <MetricCard
          title="Inventory"
          value={mockInventoryData.total.toString()}
          description={`${mockInventoryData.percentageChange}% from last month`}
          icon={Package}
          trend={mockInventoryData.trend}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockRevenueData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Last 5 orders placed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                    <div className="flex items-center justify-end">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        order.status === "completed" && "bg-success/20 text-success",
                        order.status === "processing" && "bg-primary/20 text-primary",
                        order.status === "pending" && "bg-warning/20 text-warning",
                        order.status === "cancelled" && "bg-destructive/20 text-destructive"
                      )}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend: 'up' | 'down';
}

function MetricCard({ title, value, description, icon: Icon, trend }: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className={cn(
            "flex items-center",
            trend === 'up' ? "text-success" : "text-destructive"
          )}>
            <TrendIcon className="h-4 w-4 mr-1" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="flex items-end justify-between mt-1">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mb-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
