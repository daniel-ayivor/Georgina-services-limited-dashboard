
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
  AlertCircle
} from "lucide-react";
import { Booking } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: "BK001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.johnson@email.com",
    customerPhone: "+1-555-0123",
    serviceType: "deep",
    address: "123 Main St, Anytown, ST 12345",
    date: "2024-06-15",
    time: "09:00",
    duration: 3,
    price: 150,
    status: "confirmed",
    notes: "Please bring eco-friendly cleaning supplies",
    createdAt: "2024-05-20T10:30:00Z",
    updatedAt: "2024-05-20T10:30:00Z"
  },
  {
    id: "BK002",
    customerName: "Mike Chen",
    customerEmail: "mike.chen@email.com",
    customerPhone: "+1-555-0124",
    serviceType: "basic",
    address: "456 Oak Ave, Somewhere, ST 67890",
    date: "2024-06-16",
    time: "14:00",
    duration: 2,
    price: 80,
    status: "pending",
    createdAt: "2024-05-21T14:15:00Z",
    updatedAt: "2024-05-21T14:15:00Z"
  }
];

export default function Bookings() {
  const [bookings, setBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { toast } = useToast();

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

  const handleStatusChange = (status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled') => {
    if (!selectedBooking) return;
    setUpdatingStatus(true);
    
    setTimeout(() => {
      const updatedBookings = bookings.map(booking => 
        booking.id === selectedBooking.id ? {...booking, status, updatedAt: new Date().toISOString()} : booking
      );
      
      setBookings(updatedBookings);
      setSelectedBooking({...selectedBooking, status, updatedAt: new Date().toISOString()});
      setUpdatingStatus(false);
      
      toast({
        title: "Booking status updated",
        description: `Booking ${selectedBooking.id} is now ${status}`
      });
    }, 600);
  };

  const handleDeleteBooking = () => {
    if (!selectedBooking) return;
    
    const updatedBookings = bookings.filter(booking => booking.id !== selectedBooking.id);
    setBookings(updatedBookings);
    setDeleteDialogOpen(false);
    setBookingDetailsOpen(false);
    
    toast({
      title: "Booking deleted",
      description: `Booking ${selectedBooking.id} has been deleted`
    });
  };

  const handleSendReply = () => {
    if (!selectedBooking || !replyMessage.trim()) return;
    
    // Simulate sending reply
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
        return <Badge className="bg-success text-white"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case "in-progress":
        return <Badge className="bg-primary text-white"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case "completed":
        return <Badge className="bg-success text-white"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "pending":
        return <Badge className="bg-warning text-white"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive text-white"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
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
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Service Bookings</h1>
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
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
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
              {filteredBookings.length > 0 ? (
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
                    <div>
                      <p className="text-muted-foreground">Address:</p>
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
                      <SelectItem value="in-progress">In Progress</SelectItem>
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
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
                <Button onClick={() => setBookingDetailsOpen(false)}>Close</Button>
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
            <Button onClick={handleSendReply}>Send Reply</Button>
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
            <AlertDialogAction onClick={handleDeleteBooking}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
