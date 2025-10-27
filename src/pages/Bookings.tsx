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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search,
  CalendarCheck,
  Filter,
  Trash2,
  Reply,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  DollarSign,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService, { CleaningBooking } from "@/contexts/adminApiService";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  address: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fix the fetchBookings function
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminApiService.getAdminCleaningBookings();
      
      console.log('📦 Bookings API response:', response); // Debug log
      
      // Handle different response formats
      let bookingsData: any[] = [];
      
      if (Array.isArray(response)) {
        // If response is directly an array
        bookingsData = response;
      } else if (response && Array.isArray(response.bookings)) {
        // If response has bookings property
        bookingsData = response.bookings;
      } else if (response && response.data && Array.isArray(response.data)) {
        // If response has data property
        bookingsData = response.data;
      } else {
        // If it's some other structure, log it and use empty array
        console.warn('Unexpected bookings response format:', response);
        bookingsData = [];
      }
      
      console.log('✅ Processed bookings data:', bookingsData);
      
      // Transform API data to match our Booking interface
      const transformedBookings: Booking[] = bookingsData.map((booking: any) => {
        // Safely handle the ID - convert to string and handle different formats
        const bookingId = String(booking.id || 'unknown');
        
        // Use actual data from the API response instead of hardcoded values
        return {
          id: bookingId,
          customerName: booking.customerName || `Customer ${bookingId}`,
          customerEmail: booking.customerEmail || `customer${bookingId}@example.com`,
          customerPhone: booking.customerPhone || '+1-555-XXXX',
          serviceType: booking.serviceType || 'basic',
          address: booking.address || 'Address not specified',
          date: booking.date || new Date().toISOString().split('T')[0],
          time: booking.time || '09:00',
          duration: booking.duration || 2, // Use actual duration from API
          price: booking.price || 100, // Use actual price from API
          status: (booking.status as 'pending' | 'confirmed' | 'completed' | 'cancelled') || 'pending',
          notes: booking.specialInstructions || booking.notes || (booking.serviceType ? `Service: ${booking.serviceType}` : undefined),
          createdAt: booking.createdAt || new Date().toISOString(),
          updatedAt: booking.updatedAt || new Date().toISOString()
        };
      });
      
      setBookings(transformedBookings);
    } catch (err: any) {
      console.error('Failed to fetch bookings:', err);
      const errorMessage = err.message || 'Failed to load bookings. Please try again.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error loading bookings",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setBookingDetailsOpen(true);
  };

  const handleStatusChange = async (status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    if (!selectedBooking) return;
    setUpdatingStatus(true);
    
    try {
      // Update booking status via API
      const updateData = {
        status: status,
        notes: selectedBooking.notes // Include existing notes if any
      };

      // Call the API to update the booking
      await adminApiService.updateAdminCleaningBooking(selectedBooking.id, updateData);
      
      // Update local state
      const updatedBookings = bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? { ...booking, status, updatedAt: new Date().toISOString() }
          : booking
      );
      
      setBookings(updatedBookings);
      setSelectedBooking(prev => prev ? { ...prev, status, updatedAt: new Date().toISOString() } : null);
      
      toast({
        title: "Booking status updated",
        description: `Booking ${selectedBooking.id} is now ${status}`
      });
    } catch (err: any) {
      console.error('Failed to update booking status:', err);
      toast({
        variant: "destructive",
        title: "Error updating booking",
        description: err.message || "Could not update booking status. Please try again.",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      await adminApiService.deleteAdminCleaningBooking(selectedBooking.id);
      const updatedBookings = bookings.filter(booking => booking.id !== selectedBooking.id);
      setBookings(updatedBookings);
      setDeleteDialogOpen(false);
      setBookingDetailsOpen(false);
      
      toast({
        title: "Booking deleted",
        description: `Booking ${selectedBooking.id} has been deleted`
      });
    } catch (err: any) {
      console.error('Failed to delete booking:', err);
      toast({
        variant: "destructive",
        title: "Error deleting booking",
        description: err.message || "Could not delete the booking. Please try again.",
      });
    }
  };

  const handleSendReply = () => {
    if (!selectedBooking || !replyMessage.trim()) return;
    
    // Simulate sending reply (in real app, this would call an API)
    setReplyDialogOpen(false);
    setReplyMessage("");
    
    toast({
      title: "Reply sent",
      description: `Reply sent to ${selectedBooking.customerName}`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getServiceTypeName = (type: string) => {
    switch (type) {
      case "basic": return "Basic Cleaning";
      case "deep": return "Deep Cleaning";
      case "office": return "Office Cleaning";
      case "post-construction": return "Post-Construction";
      default: return type.charAt(0).toUpperCase() + type.slice(1) + " Cleaning";
    }
  };

  // Calculate stats
  const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.price, 0);
  const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = filteredBookings.filter(b => b.status === 'completed').length;
  const totalHours = filteredBookings.reduce((sum, booking) => sum + booking.duration, 0);

  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <div className="h-4 bg-muted rounded animate-pulse w-16" />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-24" />
          <div className="h-3 bg-muted rounded animate-pulse w-32" />
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded animate-pulse w-20" />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-16" />
          <div className="h-3 bg-muted rounded animate-pulse w-12" />
        </div>
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted rounded animate-pulse w-20" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded animate-pulse w-12 ml-auto" />
      </TableCell>
    </TableRow>
  );

  if (error && bookings.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Service Bookings</h1>
          <Button onClick={fetchBookings} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Failed to load bookings</p>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchBookings}>
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
        <h1 className="text-3xl font-bold tracking-tight">Service Bookings</h1>
        <Button onClick={fetchBookings} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{filteredBookings.length}</div>
                <p className="text-xs text-muted-foreground">
                  {completedBookings} completed
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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
                  From all bookings
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{confirmedBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Ready to serve
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
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
                <div className="text-2xl font-bold">{totalHours}h</div>
                <p className="text-xs text-muted-foreground">
                  Service time booked
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Cleaning Service Bookings</CardTitle>
          <CardDescription>Manage customer cleaning service bookings and appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
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
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Show skeleton loading rows
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <TableRow 
                    key={booking.id} 
                    onClick={() => handleBookingClick(booking)} 
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>
                      <div>
                        {booking.customerName}
                        <div className="text-sm text-muted-foreground">
                          {booking.customerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getServiceTypeName(booking.serviceType)}</TableCell>
                    <TableCell>
                      <div>
                        {new Date(booking.date).toLocaleDateString()}
                        <div className="text-sm text-muted-foreground">
                          {booking.time} ({booking.duration}h)
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">${booking.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <CalendarCheck className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-lg font-medium">No bookings found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm || statusFilter !== 'all' 
                          ? "Try adjusting your filters or search terms" 
                          : "Bookings will appear here once customers schedule services"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  Booking {selectedBooking.id} - Created on {new Date(selectedBooking.createdAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Customer</p>
                    <p className="text-sm">{selectedBooking.customerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.customerEmail}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.customerPhone}</p>
                  </div>
                  <div>
                    <p className="font-medium">Service & Price</p>
                    <p className="text-sm">{getServiceTypeName(selectedBooking.serviceType)}</p>
                    <p className="text-xl font-bold">${selectedBooking.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Service Details</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date:</p>
                      <p>{new Date(selectedBooking.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time:</p>
                      <p>{selectedBooking.time}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration:</p>
                      <p>{selectedBooking.duration} hours</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Address:
                      </p>
                      <p>{selectedBooking.address}</p>
                    </div>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <p className="font-medium mb-2">Customer Notes</p>
                    <p className="text-sm bg-muted p-3 rounded">{selectedBooking.notes}</p>
                  </div>
                )}
                
                <div>
                  <p className="font-medium mb-2">Status</p>
                  <Select 
                    value={selectedBooking.status} 
                    onValueChange={(value) => handleStatusChange(value as any)} 
                    disabled={updatingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setReplyDialogOpen(true)}
                    disabled={updatingStatus}
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={updatingStatus}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
                <Button onClick={() => setBookingDetailsOpen(false)} disabled={updatingStatus}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Customer</DialogTitle>
            <DialogDescription>
              Send a message to {selectedBooking?.customerName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Type your message here..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply} disabled={!replyMessage.trim()}>
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the booking
              for {selectedBooking?.customerName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBooking} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}