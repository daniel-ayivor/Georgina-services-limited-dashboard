import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Edit, Trash2, Star, MessageSquare, Filter, Check, X, Eye,
  RefreshCw, AlertCircle, MoreVertical, BarChart3, TrendingUp,
  Download, Upload, Copy, Shield, ThumbsUp, Calendar, User, Package,
  StarHalf, StarOff, Mail, CheckCircle, Clock, TrendingDown, Reply
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService from "@/contexts/adminApiService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// Define the Review interface based on your model
interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
  Product?: {
    id: string;
    name: string;
    slug: string;
    images?: string[];
    categoryLevel1?: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  averageRating: string;
}

interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats?: ReviewStats;
  message: string;
}

interface ReviewFilterParams {
  page?: number;
  limit?: number;
  productId?: string;
  userId?: string;
  rating?: number;
  isApproved?: boolean;
  verifiedPurchase?: boolean;
  search?: string;
}

// Review Analytics Card Component
const ReviewAnalyticsCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color
}: {
  title: string;
  value: string;
  icon: any;
  description: string;
  trend?: number;
  color?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color || 'text-muted-foreground'}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend !== undefined && (
          <span className={`text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

// Star Rating Component
const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const starSize = size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5";
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className={`ml-2 font-medium ${
        size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
      }`}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

// Review Details Modal Component
// Review Details Modal Component - Update the prop types
const ReviewDetailsModal = ({
  review,
  open,
  onOpenChange,
  onReply,
  onStatusChange,
  onDelete
}: {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReply: (reviewId: string, reply: string) => Promise<{ success: boolean; message: string; review: Review; } | void>;
  onStatusChange: (reviewId: string, isApproved: boolean) => Promise<{ success: boolean; message: string; review: Review; } | void>;
  onDelete: (reviewId: string) => Promise<{ success: boolean } | void>;
}) => {
  const { toast } = useToast();
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!review) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      toast({
        variant: "destructive",
        title: "Reply required",
        description: "Please enter a reply message",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onReply(review.id, replyText);
      setReplyText("");
      toast({
        title: "Reply sent",
        description: "Your reply has been added to the review",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send reply",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsSubmitting(true);
    try {
      await onStatusChange(review.id, !review.isApproved);
      toast({
        title: review.isApproved ? "Review disapproved" : "Review approved",
        description: `Review has been ${review.isApproved ? "disapproved" : "approved"}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update review status",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
    
    setIsSubmitting(true);
    try {
      await onDelete(review.id);
      toast({
        title: "Review deleted",
        description: "The review has been removed successfully",
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete review",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Review Details
          </DialogTitle>
          <DialogDescription>
            Complete information about the review
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {getInitials(review.userName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{review.userName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {review.userEmail || "No email provided"}
                    {review.verifiedPurchase && (
                      <>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Badge variant={review.isApproved ? "default" : "destructive"}>
                    {review.isApproved ? "Approved" : "Pending"}
                  </Badge>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(review.rating)}`}>
                    <Star className="h-3 w-3" />
                    {review.rating}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>

            {/* Review Content */}
            <div className="space-y-3">
              {review.title && (
                <h4 className="font-semibold text-lg">{review.title}</h4>
              )}
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="whitespace-pre-wrap">{review.comment}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ThumbsUp className="h-3 w-3" />
                <span>{review.helpfulCount} people found this helpful</span>
              </div>
            </div>

            {/* Product Info */}
            {review.Product && (
              <div className="p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{review.Product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {review.Product.categoryLevel1 || "No category"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Reply Section */}
            {review.reply ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <Label className="text-sm font-medium">Admin Reply</Label>
                  <Badge variant="outline" className="text-xs">
                    {review.repliedAt ? formatDate(review.repliedAt) : formatDate(review.updatedAt)}
                  </Badge>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="whitespace-pre-wrap">{review.reply}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Add Admin Reply</Label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={3}
                  disabled={isSubmitting}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleReplySubmit}
                    disabled={isSubmitting || !replyText.trim()}
                    size="sm"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Reply className="mr-2 h-3 w-3" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(review.id)}
                disabled={isSubmitting}
              >
                <Copy className="mr-2 h-3 w-3" />
                Copy ID
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStatus}
                disabled={isSubmitting}
              >
                {review.isApproved ? (
                  <>
                    <X className="mr-2 h-3 w-3" />
                    Disapprove
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-3 w-3" />
                    Approve
                  </>
                )}
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Quick Actions Component
const QuickActions = ({ onAction }: { onAction: (action: string) => void }) => (
  <div className="flex flex-wrap gap-2">
    <Button variant="outline" size="sm" onClick={() => onAction('export')}>
      <Download className="mr-2 h-4 w-4" />
      Export
    </Button>
    <Button variant="outline" size="sm" onClick={() => onAction('bulk_approve')}>
      <Check className="mr-2 h-4 w-4" />
      Bulk Approve
    </Button>
    <Button variant="outline" size="sm" onClick={() => onAction('bulk_delete')}>
      <Trash2 className="mr-2 h-4 w-4" />
      Bulk Delete
    </Button>
  </div>
);

// Helper function to get rating color
const getRatingColor = (rating: number) => {
  if (rating >= 4) return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300";
  if (rating >= 3) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";
  return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300";
};

// Main Reviews Component
export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [analytics, setAnalytics] = useState<{
    totalReviews: number;
    approvedReviews: number;
    pendingReviews: number;
    averageRating: string;
    ratingDistribution: { [key: number]: number };
  }>({
    totalReviews: 0,
    approvedReviews: 0,
    pendingReviews: 0,
    averageRating: "0.0",
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  const { toast } = useToast();

  // Fetch reviews
  const fetchReviews = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params: ReviewFilterParams = {
        page,
        limit: 20,
      };

      // Set approval status based on active tab
      if (activeTab === "approved") {
        params.isApproved = true;
      } else if (activeTab === "pending") {
        params.isApproved = false;
      }

      if (selectedRating !== "all") {
        params.rating = parseInt(selectedRating);
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response: ReviewsResponse = await adminApiService.getAdminReviews(params);
      
      setReviews(response.reviews);
      setFilteredReviews(response.reviews);
      setPagination(response.pagination);
      
      // Calculate rating distribution
      const ratingDist: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      response.reviews.forEach(review => {
        ratingDist[review.rating] = (ratingDist[review.rating] || 0) + 1;
      });

      // Calculate analytics
      const approved = response.reviews.filter(r => r.isApproved).length;
      const pending = response.reviews.filter(r => !r.isApproved).length;
      const total = response.reviews.length;
      const avgRating = response.reviews.reduce((sum, r) => sum + r.rating, 0) / total;

      setAnalytics({
        totalReviews: total,
        approvedReviews: approved,
        pendingReviews: pending,
        averageRating: avgRating.toFixed(1),
        ratingDistribution: ratingDist
      });

    } catch (err: any) {
      console.error('Failed to fetch reviews:', err);
      setError('Failed to load reviews. Please try again.');
      toast({
        variant: "destructive",
        title: "Error loading reviews",
        description: err.message || "Could not fetch reviews.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [activeTab, selectedRating]);

  // Filter reviews locally for quick search
  useEffect(() => {
    let filtered = [...reviews];
    
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.userEmail && review.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.title && review.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (review.Product?.name && review.Product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(review => 
        selectedStatus === "approved" ? review.isApproved : !review.isApproved
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, selectedStatus]);

  const handleReplyToReview = async (reviewId: string, reply: string) => {
    try {
      setIsSubmitting(true);
      const response = await adminApiService.replyToReview(reviewId, reply);
      
      // Update the local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, reply: reply, repliedAt: new Date().toISOString() } : review
      ));
      
      toast({
        title: "Reply sent",
        description: "Your reply has been added to the review",
      });
      
      return response;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send reply",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReviewStatus = async (reviewId: string, isApproved: boolean) => {
    try {
      setIsSubmitting(true);
      const response = await adminApiService.updateReviewStatus(reviewId, isApproved);
      
      // Update the local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, isApproved } : review
      ));
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        approvedReviews: isApproved ? prev.approvedReviews + 1 : prev.approvedReviews - 1,
        pendingReviews: isApproved ? prev.pendingReviews - 1 : prev.pendingReviews + 1,
      }));
      
      toast({
        title: isApproved ? "Review approved" : "Review disapproved",
        description: `Review has been ${isApproved ? "approved" : "disapproved"}`,
      });
      
      return response;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update review status",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      setIsSubmitting(true);
      await adminApiService.deleteReview(reviewId);
      
      // Update the local state
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      
      // Update analytics
      const reviewToDelete = reviews.find(r => r.id === reviewId);
      if (reviewToDelete) {
        setAnalytics(prev => ({
          ...prev,
          totalReviews: prev.totalReviews - 1,
          approvedReviews: reviewToDelete.isApproved ? prev.approvedReviews - 1 : prev.approvedReviews,
          pendingReviews: !reviewToDelete.isApproved ? prev.pendingReviews - 1 : prev.pendingReviews,
        }));
      }
      
      toast({
        title: "Review deleted",
        description: "The review has been removed successfully",
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete review",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setDetailsDialogOpen(true);
  };

  const handleBulkAction = async (action: string) => {
    switch (action) {
      case 'export':
        toast({ 
          title: "Export", 
          description: "Export functionality coming soon" 
        });
        break;
      case 'bulk_approve':
        // Get pending reviews
        const pendingReviews = reviews.filter(r => !r.isApproved);
        if (pendingReviews.length === 0) {
          toast({ 
            title: "No pending reviews", 
            description: "There are no pending reviews to approve" 
          });
          return;
        }
        
        try {
          // Approve each pending review
          const promises = pendingReviews.map(review => 
            adminApiService.updateReviewStatus(review.id, true)
          );
          
          await Promise.all(promises);
          
          // Update local state
          setReviews(prev => prev.map(review => 
            pendingReviews.some(r => r.id === review.id) 
              ? { ...review, isApproved: true }
              : review
          ));
          
          // Update analytics
          setAnalytics(prev => ({
            ...prev,
            approvedReviews: prev.approvedReviews + pendingReviews.length,
            pendingReviews: prev.pendingReviews - pendingReviews.length,
          }));
          
          toast({ 
            title: "Bulk approval successful", 
            description: `${pendingReviews.length} reviews have been approved` 
          });
        } catch (error: any) {
          toast({ 
            variant: "destructive",
            title: "Bulk approval failed", 
            description: error.message || "Could not approve all reviews" 
          });
        }
        break;
      case 'bulk_delete':
        toast({ 
          title: "Bulk Delete", 
          description: "Bulk delete functionality coming soon" 
        });
        break;
    }
  };

  const handlePageChange = (page: number) => {
    fetchReviews(page);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (error && reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <Button onClick={() => fetchReviews()} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Failed to load reviews</p>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={() => fetchReviews()}>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground">Manage customer reviews and ratings</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { fetchReviews(); }} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ReviewAnalyticsCard
          title="Total Reviews"
          value={analytics.totalReviews.toString()}
          icon={MessageSquare}
          description={`${analytics.approvedReviews} approved`}
          color="text-blue-500"
        />
        <ReviewAnalyticsCard
          title="Average Rating"
          value={analytics.averageRating}
          icon={Star}
          description="Out of 5 stars"
          color="text-yellow-500"
        />
        <ReviewAnalyticsCard
          title="Pending Reviews"
          value={analytics.pendingReviews.toString()}
          icon={Clock}
          description="Awaiting approval"
          color="text-orange-500"
        />
        <ReviewAnalyticsCard
          title="Rating Distribution"
          value="5 Levels"
          icon={BarChart3}
          description="From 1 to 5 stars"
          color="text-green-500"
        />
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
          <CardDescription>Breakdown of reviews by star rating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = analytics.ratingDistribution[rating] || 0;
              const percentage = analytics.totalReviews > 0 ? (count / analytics.totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                  <Progress value={percentage} className="flex-1" />
                  <div className="text-sm text-muted-foreground w-16 text-right">
                    {count} ({percentage.toFixed(1)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            All Reviews
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending
          </TabsTrigger>
        </TabsList>

        {/* Reviews Table */}
        <TabsContent value={activeTab} className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reviews by user, email, or content..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <QuickActions onAction={handleBulkAction} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Customer Reviews</CardTitle>
                  <CardDescription>
                    {searchTerm || selectedStatus !== "all" || selectedRating !== "all"
                      ? `${filteredReviews.length} reviews found`
                      : `${pagination.totalReviews} total reviews`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>Filtered results</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : (searchTerm || selectedStatus !== "all") ? (
                filteredReviews.length > 0 ? (
                  <div className="space-y-4">
                    {filteredReviews.map((review) => (
                      <ReviewRow
                        key={review.id}
                        review={review}
                        onView={handleViewReview}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-lg font-medium">No reviews found</p>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms
                    </p>
                  </div>
                )
              ) : reviews.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Review</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(review.userName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{review.userName}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {review.userEmail || "No email"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {review.Product ? (
                              <div className="font-medium max-w-[200px] truncate">
                                {review.Product.name}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No product</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium w-fit ${getRatingColor(review.rating)}`}>
                              <Star className="h-3 w-3" />
                              {review.rating}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px]">
                              {review.title && (
                                <div className="font-medium truncate">{review.title}</div>
                              )}
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {review.comment}
                              </div>
                              {review.helpfulCount > 0 && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  <ThumbsUp className="h-3 w-3 inline mr-1" />
                                  {review.helpfulCount} helpful
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={review.isApproved ? "default" : "destructive"}>
                              {review.isApproved ? "Approved" : "Pending"}
                            </Badge>
                            {review.verifiedPurchase && (
                              <div className="text-xs text-green-600 mt-1">
                                Verified Purchase
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewReview(review)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateReviewStatus(review.id, !review.isApproved)}>
                                  {review.isApproved ? (
                                    <>
                                      <X className="h-4 w-4 mr-2" />
                                      Disapprove
                                    </>
                                  ) : (
                                    <>
                                      <Check className="h-4 w-4 mr-2" />
                                      Approve
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => handlePageChange(pagination.currentPage - 1)}
                              className={!pagination.hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {[...Array(pagination.totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink
                                onClick={() => handlePageChange(i + 1)}
                                isActive={pagination.currentPage === i + 1}
                                className="cursor-pointer"
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => handlePageChange(pagination.currentPage + 1)}
                              className={!pagination.hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-lg font-medium">No reviews yet</p>
                  <p className="text-muted-foreground">
                    Customer reviews will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Details Modal */}
      <ReviewDetailsModal
        review={selectedReview}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onReply={handleReplyToReview}
        onStatusChange={handleUpdateReviewStatus}
        onDelete={handleDeleteReview}
      />
    </div>
  );
}

// Review Row Component for list view
const ReviewRow = ({ review, onView }: { review: Review; onView: (review: Review) => void }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => onView(review)}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {getInitials(review.userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{review.userName}</h4>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${review.isApproved ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {review.isApproved ? 'Approved' : 'Pending'}
              </div>
              {review.verifiedPurchase && (
                <Badge variant="outline" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRatingColor(review.rating)}`}>
                <Star className="h-3 w-3" />
                {review.rating}
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            {review.title && (
              <h5 className="font-medium mt-2">{review.title}</h5>
            )}
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {review.comment}
            </p>
            {review.Product && (
              <div className="flex items-center gap-2 mt-2 text-sm">
                <Package className="h-3 w-3" />
                <span className="text-muted-foreground">{review.Product.name}</span>
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};