
import { useState } from "react";
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
  RefreshCw
} from "lucide-react";
import { mockOrders } from "@/data/mock-data";
import { Order } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

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

  const handleStatusChange = (status: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    
    // Simulate API delay
    setTimeout(() => {
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id ? {...order, status, updatedAt: new Date().toISOString()} : order
      );
      
      setOrders(updatedOrders);
      setSelectedOrder({...selectedOrder, status, updatedAt: new Date().toISOString()});
      setUpdatingStatus(false);
      
      toast({
        title: "Order status updated",
        description: `Order ${selectedOrder.id} is now ${status}`
      });
    }, 600);
  };
  
  const handlePaymentStatusChange = (paymentStatus: 'paid' | 'unpaid' | 'refunded') => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    
    // Simulate API delay
    setTimeout(() => {
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id ? {...order, paymentStatus, updatedAt: new Date().toISOString()} : order
      );
      
      setOrders(updatedOrders);
      setSelectedOrder({...selectedOrder, paymentStatus, updatedAt: new Date().toISOString()});
      setUpdatingStatus(false);
      
      toast({
        title: "Payment status updated",
        description: `Payment for order ${selectedOrder.id} is now ${paymentStatus}`
      });
    }, 600);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success">{status}</Badge>;
      case "processing":
        return <Badge className="bg-primary">{status}</Badge>;
      case "pending":
        return <Badge className="bg-warning">{status}</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success">{status}</Badge>;
      case "unpaid":
        return <Badge className="bg-warning">{status}</Badge>;
      case "refunded":
        return <Badge variant="outline" className="text-muted-foreground">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate stats
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const paidOrders = filteredOrders.filter(o => o.paymentStatus === 'paid').length;
  const completedOrders = filteredOrders.filter(o => o.status === 'completed').length;
  const avgOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedOrders} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {paidOrders} paid orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Per order average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredOrders.filter(o => o.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
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
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
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
              {filteredOrders.length > 0 ? (
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
                      <ShoppingCart className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your filters or search terms
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
                        <TableRow key={item.productId}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
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
                      onValueChange={(value) => handleStatusChange(value as any)} 
                      disabled={updatingStatus}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-warning" />
                            Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="processing">
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2 text-primary" />
                            Processing
                          </div>
                        </SelectItem>
                        <SelectItem value="completed">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-success" />
                            Completed
                          </div>
                        </SelectItem>
                        <SelectItem value="cancelled">
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 mr-2 text-destructive" />
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
                      onValueChange={(value) => handlePaymentStatusChange(value as any)} 
                      disabled={updatingStatus}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-warning" />
                            Unpaid
                          </div>
                        </SelectItem>
                        <SelectItem value="paid">
                          <div className="flex items-center">
                            <BanknoteIcon className="h-4 w-4 mr-2 text-success" />
                            Paid
                          </div>
                        </SelectItem>
                        <SelectItem value="refunded">
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
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
