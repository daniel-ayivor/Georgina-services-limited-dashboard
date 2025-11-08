import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  ShoppingCart,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  BanknoteIcon,
  RefreshCw,
  AlertCircle,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService, { Customer, OrderItem } from "@/contexts/adminApiService";
// import { adminApiService, OrderItem, Customer } from "@/lib/adminApiService";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'shipped' | 'delivered';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Helper function to safely access properties that might not be in the TypeScript interface
const getOrderItemDate = (item: OrderItem): string => {
  // Try to get date from createdAt, updatedAt, or fallback to current date
  const dateString = (item as any).createdAt || (item as any).updatedAt;
  return dateString || new Date().toISOString();
};

// Helper function to get quantity from order item
const getOrderItemQuantity = (item: OrderItem): number => {
  return (item as any).quantity || 1;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch orders data from API
// In your Orders component - fix the fetchOrdersData function
// In your Orders component - fix the fetchOrdersData function
// In your Orders component - fix the fetchOrdersData function
const fetchOrdersData = async () => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Use the correct admin endpoints
    const ordersResponse = await adminApiService.getAdminOrders();
    const customersData = await adminApiService.getCustomers();
    
    // Use the correct property - 'orders' instead of 'data'
    const ordersData = ordersResponse.orders; // This matches your type { orders: Order[] }
    
    // Use the actual orders data from the API
    setOrders(ordersData);
    setCustomers(customersData);
    
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    setError('Failed to load orders. Please try again.');
    toast({
      variant: "destructive",
      title: "Error loading orders",
      description: "Could not fetch orders data.",
    });
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchOrdersData();
  }, []);


  const filteredOrders = orders.filter((order) => {
    // Search filter
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    // Payment filter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleStatusChange = async (status: Order['status']) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    
    try {
      // In a real app, you would call an API to update the order status
      // For now, we'll simulate it by updating local state
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id ? {...order, status, updatedAt: new Date().toISOString()} : order
      );
      
      setOrders(updatedOrders);
      setSelectedOrder({...selectedOrder, status, updatedAt: new Date().toISOString()});
      
      toast({
        title: "Order status updated",
        description: `Order ${selectedOrder.id} is now ${status}`
      });
    } catch (err) {
      console.error('Failed to update order status:', err);
      toast({
        variant: "destructive",
        title: "Error updating order",
        description: "Could not update order status. Please try again.",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  const handlePaymentStatusChange = async (paymentStatus: Order['paymentStatus']) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    
    try {
      // In a real app, you would call an API to update the payment status
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id ? {...order, paymentStatus, updatedAt: new Date().toISOString()} : order
      );
      
      setOrders(updatedOrders);
      setSelectedOrder({...selectedOrder, paymentStatus, updatedAt: new Date().toISOString()});
      
      toast({
        title: "Payment status updated",
        description: `Payment for order ${selectedOrder.id} is now ${paymentStatus}`
      });
    } catch (err) {
      console.error('Failed to update payment status:', err);
      toast({
        variant: "destructive",
        title: "Error updating payment",
        description: "Could not update payment status. Please try again.",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 border-green-200">{status}</Badge>;
      case "processing":
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{status}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{status}</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">{status}</Badge>;
      case "unpaid":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{status}</Badge>;
      case "refunded":
        return <Badge variant="outline" className="text-gray-600 border-gray-300">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate stats
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const paidOrders = filteredOrders.filter(o => o.paymentStatus === 'paid').length;
  const completedOrders = filteredOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length;
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <div className="h-4 bg-muted rounded animate-pulse w-20" />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-24" />
          <div className="h-3 bg-muted rounded animate-pulse w-32" />
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded animate-pulse w-16" />
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted rounded animate-pulse w-20" />
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted rounded animate-pulse w-16" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded animate-pulse w-12 ml-auto" />
      </TableCell>
    </TableRow>
  );

  if (error && orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <Button onClick={fetchOrdersData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Failed to load orders</p>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchOrdersData}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <Button onClick={fetchOrdersData} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{filteredOrders.length}</div>
                <p className="text-xs text-muted-foreground">
                  {completedOrders} completed
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  From {paidOrders} paid orders
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Per order average
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {filteredOrders.filter(o => o.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting processing
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Order Management</CardTitle>
          <CardDescription>Manage and track customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={paymentFilter} onValueChange={setPaymentFilter} disabled={isLoading}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Show skeleton loading rows
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    onClick={() => handleOrderClick(order)} 
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        {order.customerName}
                        <div className="text-sm text-muted-foreground">
                          {order.customerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <Package className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' 
                          ? "Try adjusting your filters or search terms" 
                          : "Orders will appear here once customers start purchasing"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>
                  Order {selectedOrder.id} - Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Customer</p>
                    <p className="text-sm">{selectedOrder.customerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Total</p>
                    <p className="text-xl font-bold">${selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Order Items</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.productId || `Product ${item.id}`}</TableCell>
                          <TableCell className="text-center">{getOrderItemQuantity(item)}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            ${((item.price * getOrderItemQuantity(item)).toFixed(2))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="font-medium mb-2">Order Status</p>
                    <Select 
                      value={selectedOrder.status} 
                      onValueChange={(value) => handleStatusChange(value as Order['status'])} 
                      disabled={updatingStatus}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                            Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="processing">
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2 text-blue-600" />
                            Processing
                          </div>
                        </SelectItem>
                        <SelectItem value="shipped">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2 text-blue-600" />
                            Shipped
                          </div>
                        </SelectItem>
                        <SelectItem value="delivered">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Delivered
                          </div>
                        </SelectItem>
                        <SelectItem value="completed">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Completed
                          </div>
                        </SelectItem>
                        <SelectItem value="cancelled">
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            Cancelled
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Payment Status</p>
                    <Select 
                      value={selectedOrder.paymentStatus} 
                      onValueChange={(value) => handlePaymentStatusChange(value as Order['paymentStatus'])} 
                      disabled={updatingStatus}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-yellow-600" />
                            Unpaid
                          </div>
                        </SelectItem>
                        <SelectItem value="paid">
                          <div className="flex items-center">
                            <BanknoteIcon className="h-4 w-4 mr-2 text-green-600" />
                            Paid
                          </div>
                        </SelectItem>
                        <SelectItem value="refunded">
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2 text-gray-600" />
                            Refunded
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <p className="text-xs text-muted-foreground mr-auto">
                  Last updated: {new Date(selectedOrder.updatedAt).toLocaleString()}
                </p>
                <Button onClick={() => setOrderDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}