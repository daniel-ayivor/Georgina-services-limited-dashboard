import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  User,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Save,
  MessageSquare,
  Package,
  CreditCard,
  FileText,
  Home,
  Briefcase,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService from "@/contexts/adminApiService";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  selectedFeatures: string[];
  address: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'paid' | 'failed' | 'completed' | 'cancelled';
  paymentIntentId?: string | null;
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAmount?: number;
  notes?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setIsLoading(true);
      const response = await adminApiService.getAdminCleaningBookings();
      
      let bookingsData: any[] = [];
      
      if (Array.isArray(response)) {
        bookingsData = response;
      } else if (response && Array.isArray(response.bookings)) {
        bookingsData = response.bookings;
      } else if (response && response.data && Array.isArray(response.data.bookings)) {
        bookingsData = response.data.bookings;
      } else if (response && response.data && Array.isArray(response.data)) {
        bookingsData = response.data;
      }

      const foundBooking = bookingsData.find((b: any) => String(b.id) === id);
      
      if (!foundBooking) {
        toast({
          variant: "destructive",
          title: "Booking not found",
          description: "The requested booking could not be found.",
        });
        navigate("/bookings");
        return;
      }

      let selectedFeatures: string[] = [];
      if (Array.isArray(foundBooking.selectedFeatures)) {
        selectedFeatures = foundBooking.selectedFeatures;
      } else if (foundBooking.selectedFeatures) {
        try {
          selectedFeatures = JSON.parse(foundBooking.selectedFeatures);
        } catch {
          selectedFeatures = [];
        }
      }

      const transformedBooking: Booking = {
        id: String(foundBooking.id),
        customerName: foundBooking.customerName || 'Unknown Customer',
        customerEmail: foundBooking.customerEmail || '',
        customerPhone: foundBooking.customerPhone || '',
        serviceType: foundBooking.serviceType || 'Unknown Service',
        selectedFeatures,
        address: foundBooking.address || 'Address not specified',
        date: foundBooking.date || new Date().toISOString().split('T')[0],
        time: foundBooking.time || '00:00',
        duration: foundBooking.duration || 1,
        price: foundBooking.price || 0,
        status: foundBooking.status || 'pending',
        paymentIntentId: foundBooking.paymentIntentId || null,
        paymentStatus: foundBooking.paymentStatus,
        paidAmount: foundBooking.paidAmount,
        notes: foundBooking.notes || '',
        specialInstructions: foundBooking.specialInstructions || '',
        createdAt: foundBooking.createdAt || new Date().toISOString(),
        updatedAt: foundBooking.updatedAt || new Date().toISOString()
      };

      setBooking(transformedBooking);
      setNotes(transformedBooking.notes || '');
    } catch (err: any) {
      console.error('Failed to fetch booking:', err);
      toast({
        variant: "destructive",
        title: "Error loading booking",
        description: err.message || "Could not load booking details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: Booking['status']) => {
    if (!booking) return;

    setIsSaving(true);
    const prevStatus = booking.status;

    setBooking((prev) => prev ? { ...prev, status } : null);

    try {
      await adminApiService.updateAdminCleaningBooking(booking.id, {
        status,
        notes: booking.notes,
      });

      toast({
        title: "Status updated",
        description: `Booking status changed to ${status}.`,
      });
    } catch (err: any) {
      console.error('Failed to update status:', err);
      setBooking((prev) => prev ? { ...prev, status: prevStatus } : null);
      
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err.message || "Could not update booking status.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!booking) return;

    setIsSaving(true);

    try {
      await adminApiService.updateAdminCleaningBooking(booking.id, {
        status: booking.status,
        notes,
      });

      setBooking((prev) => prev ? { ...prev, notes } : null);

      toast({
        title: "Notes saved",
        description: "Admin notes have been updated successfully.",
      });
    } catch (err: any) {
      console.error('Failed to save notes:', err);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: err.message || "Could not save notes.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!booking) return;

    try {
      await adminApiService.deleteAdminCleaningBooking(booking.id);
      
      toast({
        title: "Booking deleted",
        description: `Booking ${booking.id} has been deleted successfully.`,
      });

      navigate("/bookings");
    } catch (err: any) {
      console.error('Failed to delete booking:', err);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: err.message || "Could not delete the booking.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (booking: Booking) => {
    switch (booking.paymentStatus) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <DollarSign className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'refunded':
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <RefreshCw className="w-3 h-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <XCircle className="w-3 h-3 mr-1" />
            Unpaid
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/bookings")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate("/bookings")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Booking not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Enhanced Header with Gradient */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-6 md:p-8 shadow-lg">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-slate-700/25"></div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/bookings")}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Booking #{booking.id}
                </h1>
                {getStatusBadge(booking.status)}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Created {new Date(booking.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(booking.createdAt).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isSaving}
            className="shadow-lg"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Booking
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information with Enhanced Design */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Customer Information
              </CardTitle>
              <CardDescription>Contact details and location</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Full Name</p>
                    <p className="text-lg font-semibold">{booking.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Email Address</p>
                    <a href={`mailto:${booking.customerEmail}`} className="text-base font-medium hover:text-blue-600 transition-colors break-all">
                      {booking.customerEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <Phone className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Phone Number</p>
                    <a href={`tel:${booking.customerPhone}`} className="text-base font-medium hover:text-blue-600 transition-colors">
                      {booking.customerPhone || 'Not provided'}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <MapPin className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Service Address</p>
                    <p className="text-base font-medium">{booking.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details with Enhanced Design */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                Service Details
              </CardTitle>
              <CardDescription>Booking information and schedule</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 border-2 border-indigo-100 dark:border-indigo-900">
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">Service Type</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{booking.serviceType}</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Duration</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-amber-600" />
                    <p className="text-xl font-bold">{booking.duration} {booking.duration !== 1 ? 'hours' : 'hour'}</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Total Price</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                    <p className="text-xl font-bold">${booking.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Service Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    <p className="text-lg font-semibold">
                      {new Date(booking.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Service Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-violet-600" />
                    <p className="text-lg font-semibold">{booking.time}</p>
                  </div>
                </div>
              </div>

              {/* Selected Features with Enhanced Design */}
              {booking.selectedFeatures && booking.selectedFeatures.length > 0 && (
                <div className="pt-6 border-t-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">Selected Add-Ons & Features</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {booking.selectedFeatures.map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-sm px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 hover:from-purple-200 hover:to-pink-200 transition-all"
                      >
                        <CheckCircle className="h-3 w-3 mr-1.5" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions with Enhanced Design */}
              {booking.specialInstructions && (
                <div className="pt-6 border-t-2">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-semibold text-foreground">Special Instructions</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-xl p-5 border-l-4 border-blue-500">
                    <p className="text-sm leading-relaxed">{booking.specialInstructions}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Notes with Enhanced Design */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                Admin Notes
              </CardTitle>
              <CardDescription>Internal notes and comments for this booking</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Textarea
                placeholder="Add internal notes, comments, or reminders about this booking..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="resize-none border-2 focus:border-blue-400 transition-colors"
              />
              <Button
                onClick={handleSaveNotes}
                disabled={isSaving || notes === booking.notes}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Notes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Enhanced Design */}
        <div className="space-y-6">
          {/* Status & Payment Management */}
          <Card className="border-2 border-blue-200 dark:border-blue-900 shadow-lg sticky top-6">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Status Management
              </CardTitle>
              <CardDescription>Update booking and payment status</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block">
                  Booking Status
                </label>
                <Select
                  value={booking.status}
                  onValueChange={handleStatusChange}
                  disabled={isSaving}
                >
                  <SelectTrigger className="border-2 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="paid">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Paid
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Completed
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelled">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Cancelled
                      </div>
                    </SelectItem>
                    <SelectItem value="failed">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Failed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-3 flex items-center justify-center">
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              <div className="pt-6 border-t-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 block flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5" />
                  Payment Status
                </label>
                <div className="flex flex-col items-center gap-3">
                  {getPaymentStatusBadge(booking)}
                  {booking.paymentIntentId && (
                    <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg w-full">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Payment ID</p>
                      <code className="text-xs font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded border">
                        {booking.paymentIntentId.slice(0, 20)}...
                      </code>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Information with Enhanced Design */}
          <Card className="border-2 border-emerald-200 dark:border-emerald-900 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                Pricing Details
              </CardTitle>
              <CardDescription>Payment and transaction information</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-6 text-center border-2 border-emerald-200 dark:border-emerald-900">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Total Amount</p>
                <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-100">
                  ${booking.price.toFixed(2)}
                </p>
              </div>
              {booking.paidAmount !== undefined && booking.paidAmount > 0 && (
                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-100">Amount Paid</span>
                  </div>
                  <span className="text-xl font-bold text-green-700 dark:text-green-300">
                    ${booking.paidAmount.toFixed(2)}
                  </span>
                </div>
              )}
              {booking.paidAmount !== undefined && booking.paidAmount < booking.price && (
                <div className="flex justify-between items-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Balance Due</span>
                  </div>
                  <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
                    ${(booking.price - (booking.paidAmount || 0)).toFixed(2)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline with Enhanced Design */}
          <Card className="border-2 border-purple-200 dark:border-purple-900 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                Activity Timeline
              </CardTitle>
              <CardDescription>Track booking history and updates</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500">
                  <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Created</p>
                    <p className="text-sm font-medium mt-1">
                      {new Date(booking.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500">
                  <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Last Updated</p>
                    <p className="text-sm font-medium mt-1">
                      {new Date(booking.updatedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking for {booking.customerName}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBooking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
