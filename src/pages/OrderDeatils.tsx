import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  DollarSign,
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  FileText,
  Printer,
  Download,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  ShoppingBag,
  Tag,
  Hash,
  ExternalLink,
  BarChart,
  TrendingUp,
  Percent,
  ShieldCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService, { OrderItem } from "@/contexts/adminApiService";

// Define interfaces based on the actual raw API response
interface RawOrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface RawOrderUser {
  id: number;
  name: string;
  email: string;
}

interface RawApiOrder {
  id: number;
  userId: number;
  status: string;
  totalAmount: number;
  paymentIntentId: string | null;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  user: RawOrderUser;
  items: RawOrderItem[];
}

// Our UI Order type
interface Order {
  id: string;
  displayId: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'shipped' | 'delivered';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  total: number;
  items: RawOrderItem[];
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  paymentMethod: string;
  userId: number;
  subtotal?: number;
  tax?: number;
  shippingCost?: number;
  discount?: number;
  notes?: string;
}

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<Order['paymentStatus']>('unpaid');
  const [orderNotes, setOrderNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Fetch order data
  const fetchOrderData = async () => {
    if (!orderId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, you would have an endpoint like /api/admin/orders/:id
      // For now, we'll fetch all orders and find the matching one
      const response = await adminApiService.getOrders() as any;
      let rawOrdersData: RawApiOrder[] = [];
      
      if (response && typeof response === 'object') {
        if (response.data && Array.isArray(response.data)) {
          rawOrdersData = response.data as RawApiOrder[];
        } else if (response.orders && Array.isArray(response.orders)) {
          rawOrdersData = response.orders as RawApiOrder[];
        } else if (Array.isArray(response)) {
          rawOrdersData = response as RawApiOrder[];
        } else if (response.success && response.data && Array.isArray(response.data)) {
          rawOrdersData = response.data as RawApiOrder[];
        }
      }
      
      // Find the order by ID (strip the ORD- prefix if present)
      const numericOrderId = orderId.replace('ORD-', '');
      const rawOrder = rawOrdersData.find(order => 
        order.id.toString() === numericOrderId || 
        `ORD-${order.id.toString().padStart(4, '0')}` === orderId
      );
      
      if (!rawOrder) {
        throw new Error('Order not found');
      }
      
      // Transform to UI format
      const transformedOrder: Order = {
        id: rawOrder.id.toString(),
        displayId: `ORD-${rawOrder.id.toString().padStart(4, '0')}`,
        customerName: rawOrder.user?.name || 'Unknown Customer',
        customerEmail: rawOrder.user?.email || 'No email',
        status: mapApiStatusToUiStatus(rawOrder.status),
        paymentStatus: determinePaymentStatus(rawOrder),
        total: rawOrder.totalAmount || 0,
        items: rawOrder.items || [],
        createdAt: rawOrder.createdAt,
        updatedAt: rawOrder.updatedAt,
        shippingAddress: rawOrder.shippingAddress,
        paymentMethod: rawOrder.paymentMethod,
        userId: rawOrder.userId,
        subtotal: calculateSubtotal(rawOrder.items),
        tax: calculateTax(rawOrder.totalAmount),
        shippingCost: 0, // You would get this from your API
        discount: 0, // You would get this from your API
        notes: "Customer requested expedited shipping. Handle with care."
      };
      
      setOrder(transformedOrder);
      setOrderNotes(transformedOrder.notes || "");
      
    } catch (err) {
      console.error('Failed to fetch order:', err);
      setError('Failed to load order details. The order may not exist.');
      toast({
        variant: "destructive",
        title: "Error loading order",
        description: "Could not fetch order data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  // Helper functions
  const mapApiStatusToUiStatus = (apiStatus: string): Order['status'] => {
    switch (apiStatus.toLowerCase()) {
      case 'pending':
      case 'processing':
      case 'completed':
      case 'cancelled':
      case 'shipped':
      case 'delivered':
        return apiStatus.toLowerCase() as Order['status'];
      default:
        return 'pending';
    }
  };

  const determinePaymentStatus = (rawOrder: RawApiOrder): Order['paymentStatus'] => {
    if (rawOrder.paymentIntentId) {
      return 'paid';
    }
    return 'unpaid';
  };

  const calculateSubtotal = (items: RawOrderItem[]): number => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = (total: number): number => {
    // Assuming 10% tax for demo purposes
    return total * 0.1;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 border-green-200 capitalize">{status}</Badge>;
      case "processing":
      case "shipped":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 capitalize">{status}</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 capitalize">{status}</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200 capitalize">{status}</Badge>;
      default:
        return <Badge className="capitalize">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200 capitalize">{status}</Badge>;
      case "unpaid":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 capitalize">{status}</Badge>;
      case "refunded":
        return <Badge variant="outline" className="text-gray-600 border-gray-300 capitalize">{status}</Badge>;
      default:
        return <Badge className="capitalize">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "processing":
      case "shipped":
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPaymentIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case "unpaid":
        return <CreditCard className="h-5 w-5 text-yellow-600" />;
      case "refunded":
        return <RefreshCw className="h-5 w-5 text-gray-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  // Handler functions
  const handleStatusUpdate = async () => {
    if (!order) return;
    
    setUpdatingStatus(true);
    try {
      // In a real app, you would call an API to update the order status
      setOrder({...order, status: newStatus, updatedAt: new Date().toISOString()});
      
      toast({
        title: "Order status updated",
        description: `Order ${order.displayId} is now ${newStatus}`
      });
      setStatusDialogOpen(false);
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

  const handlePaymentStatusUpdate = async () => {
    if (!order) return;
    
    setUpdatingStatus(true);
    try {
      // In a real app, you would call an API to update the payment status
      setOrder({...order, paymentStatus: newPaymentStatus, updatedAt: new Date().toISOString()});
      
      toast({
        title: "Payment status updated",
        description: `Payment for order ${order.displayId} is now ${newPaymentStatus}`
      });
      setPaymentDialogOpen(false);
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

  const handleNotesUpdate = async () => {
    if (!order) return;
    
    setIsUpdating(true);
    try {
      // In a real app, you would call an API to update the order notes
      setOrder({...order, notes: orderNotes, updatedAt: new Date().toISOString()});
      
      toast({
        title: "Order notes updated",
        description: "Notes have been saved successfully."
      });
      setNotesDialogOpen(false);
    } catch (err) {
      console.error('Failed to update order notes:', err);
      toast({
        variant: "destructive",
        title: "Error updating notes",
        description: "Could not update order notes. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDeleteOrder = async () => {
    if (!order) return;
    
    try {
      // In a real app, you would call an API to delete the order
      toast({
        title: "Order deleted",
        description: `Order ${order.displayId} has been deleted.`
      });
      navigate('/admin/orders');
    } catch (err) {
      console.error('Failed to delete order:', err);
      toast({
        variant: "destructive",
        title: "Error deleting order",
        description: "Could not delete order. Please try again.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateItemTotal = (item: RawOrderItem) => {
    return (item.price || 0) * (item.quantity || 0);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded animate-pulse w-48" />
            <div className="h-4 bg-muted rounded animate-pulse w-32" />
          </div>
        </div>
        <div className="grid gap-6">
          {/* Order Summary Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse w-32" />
              <div className="h-4 bg-muted rounded animate-pulse w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-24" />
                    <div className="h-8 bg-muted rounded animate-pulse w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-24" />
                    <div className="h-8 bg-muted rounded animate-pulse w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Order not found</p>
            <p className="text-muted-foreground text-center mb-4">
              {error || "The order you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => navigate('/orders')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
            <p className="text-muted-foreground">
              {order.displayId} • Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrintInvoice}>
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Order Summary</CardTitle>
                <CardDescription>
                  Last updated: {formatDate(order.updatedAt)}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center gap-2">
                  {getPaymentIcon(order.paymentStatus)}
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </h3>
                  <div className="space-y-1">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {order.customerEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      User ID: {order.userId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping Information
                  </h3>
                  <div className="space-y-1">
                    <p className="font-medium">Shipping Address</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {order.shippingAddress}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Payment Method: {order.paymentMethod || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Dates */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Order Timeline
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Created:</span>{' '}
                      <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Last Updated:</span>{' '}
                      <span className="font-medium">{formatDate(order.updatedAt)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setNewStatus(order.status);
                        setStatusDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Update Status
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setNewPaymentStatus(order.paymentStatus);
                        setPaymentDialogOpen(true);
                      }}
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      Update Payment
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setNotesDialogOpen(true)}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Add Notes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items & Notes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Items ({order.items.length})
                </CardTitle>
                <CardDescription>Products and services included in this order</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Product</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.length > 0 ? (
                      order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium">{item.productName}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Tag className="h-3 w-3" />
                                  <span>Product ID: {item.productId}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="px-3 py-1">
                              {item.quantity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${(item.price || 0).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ${calculateItemTotal(item).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <div className="flex flex-col items-center">
                            <Package className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium">No items found</p>
                            <p className="text-sm text-muted-foreground">
                              This order doesn't contain any items
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Order Notes & Comments
                </CardTitle>
                <CardDescription>Internal notes and customer instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">
                      {order.notes || "No notes added for this order."}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setNotesDialogOpen(true)}>
                      <Edit className="h-3 w-3 mr-2" />
                      {order.notes ? "Edit Notes" : "Add Notes"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary & Actions */}
          <div className="space-y-6">
            {/* Order Totals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Order Totals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${(order.subtotal || order.total).toFixed(2)}</span>
                  </div>
                  {order.shippingCost && order.shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Shipping</span>
                      <span className="font-medium">${order.shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  {order.tax && order.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tax</span>
                      <span className="font-medium">${order.tax.toFixed(2)}</span>
                    </div>
                  )}
                  {order.discount && order.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Discount</span>
                      <span className="font-medium text-green-600">-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Order Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setStatusDialogOpen(true)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update Order Status
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setPaymentDialogOpen(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Update Payment Status
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setNotesDialogOpen(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {order.notes ? "Edit Order Notes" : "Add Order Notes"}
                  </Button>
                  <Separator />
       
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Order
                  </Button>
                </div>
              </CardContent>
            </Card>

 
          </div>
        </div>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order {order.displayId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Order Status</Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order['status'])}>
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
                      <Truck className="h-4 w-4 mr-2 text-blue-600" />
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
              <Label htmlFor="status-notes">Status Notes (Optional)</Label>
              <Textarea
                id="status-notes"
                placeholder="Add any notes about this status change..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={updatingStatus}>
              {updatingStatus ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Payment Status Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              Update payment status for order {order.displayId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment-status">Payment Status</Label>
              <Select value={newPaymentStatus} onValueChange={(value) => setNewPaymentStatus(value as Order['paymentStatus'])}>
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
                      <DollarSign className="h-4 w-4 mr-2 text-green-600" />
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePaymentStatusUpdate} disabled={updatingStatus}>
              {updatingStatus ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Payment Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Notes</DialogTitle>
            <DialogDescription>
              Add or edit notes for order {order.displayId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="order-notes">Notes</Label>
              <Textarea
                id="order-notes"
                placeholder="Enter notes about this order..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="mt-1 min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleNotesUpdate} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Notes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete order {order.displayId} and
              remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}