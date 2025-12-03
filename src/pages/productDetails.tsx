import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import adminApiService from "@/contexts/adminApiService";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

// Icons
import { 
  Package, DollarSign, Layers, Tag, Star, Zap, Clock, 
  Calendar, ArrowLeft, Edit, Trash2, 
  RefreshCw, AlertCircle, 
  Share2, Printer, Copy, MoreVertical,
  Image as ImageIcon, BarChart3, 
  ChevronLeft, ChevronRight, Grid3X3, PackageOpen,
  Scale, Ruler, Box, Hash, CheckCircle,
  MessageSquare, Eye, ShoppingBag, TrendingUp, Users
} from "lucide-react";

// Interfaces
interface ProductWithSpecial {
  id: string | number;
  name: string;
  slug?: string;
  description: string;
  price: string;
  categoryLevel1: string;
  categoryLevel2: string;
  categoryLevel3: string;
  serviceType: 'physical' | 'digital' | 'service';
  serviceDuration: string;
  unit: string;
  stock: number;
  images: string[];
  isActive: boolean;
  tags: string[];
  brand: string;
  createdAt: string;
  updatedAt: string;
  size?: string | string[] | null;
  sku?: string;
  weight?: string | number;
  dimensions?: string;
  discountPrice?: number;
  rating?: number;
  reviewsCount?: number;
  
  // Special category fields
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  featuredOrder: number;
  trendingOrder: number;
  newArrivalOrder: number;
  wishList?: boolean;
}

interface ProductDetailResponse {
  product: ProductWithSpecial;
  relatedProducts: ProductWithSpecial[];
  message: string;
}

interface ProductDetail extends ProductWithSpecial {
  specifications?: Record<string, string>;
  relatedProducts?: ProductWithSpecial[];
  reviews?: Review[];
  salesData?: SalesData;
  variants?: ProductVariant[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface SalesData {
  totalSales: number;
  monthlySales: number[];
  revenue: number;
  conversionRate: number;
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  attributes: Record<string, string>;
}

const ProductDetail = () => {
  // Hooks
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Effects
  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  // Data Fetching
  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching product with ID:', id);
      
      const response = await adminApiService.getProductById(id!) as ProductDetailResponse;
      
      if (!response || !response.product) {
        throw new Error('Invalid response structure');
      }
      
      const productData = response.product as ProductWithSpecial;
      const relatedProducts = response.relatedProducts || [];
      
      // Mock data (replace with actual API calls)
      const mockReviews: Review[] = [
        {
          id: "1",
          userName: "John Doe",
          rating: 5,
          comment: "Excellent product! Highly recommend.",
          date: "2024-01-15",
          verified: true
        },
        {
          id: "2",
          userName: "Jane Smith",
          rating: 4,
          comment: "Good quality, fast shipping.",
          date: "2024-01-10",
          verified: true
        }
      ];

      const mockSalesData: SalesData = {
        totalSales: productData.stock > 0 ? Math.floor(Math.random() * 100) + 50 : 0,
        monthlySales: Array(12).fill(0).map(() => Math.floor(Math.random() * 30) + 5),
        revenue: parseFloat(productData.price) * (productData.stock > 0 ? Math.floor(Math.random() * 100) + 50 : 0),
        conversionRate: 3.2
      };

      const mockSpecifications = {
        "Material": "Premium Cotton",
        "Color": "Multiple Colors",
        "Size Range": typeof productData.size === 'string' ? productData.size : "Various",
        "Weight": productData.weight ? `${productData.weight} kg` : "N/A",
        "Dimensions": productData.dimensions || "N/A",
        "Warranty": "1 Year",
        "Origin": "Made in Ghana"
      };

      const mockVariants: ProductVariant[] = [
        {
          id: "var1",
          name: "Blue - Small",
          price: parseFloat(productData.price),
          stock: Math.floor(Math.random() * 20) + 5,
          sku: productData.sku ? `${productData.sku}-BLUE-S` : "VAR-BLUE-S",
          attributes: { Color: "Blue", Size: "S" }
        },
        {
          id: "var2",
          name: "Red - Medium",
          price: parseFloat(productData.price),
          stock: Math.floor(Math.random() * 20) + 5,
          sku: productData.sku ? `${productData.sku}-RED-M` : "VAR-RED-M",
          attributes: { Color: "Red", Size: "M" }
        }
      ];

      // Create product detail object
      const productDetail: ProductDetail = {
        ...productData,
        images: productData.images || [],
        relatedProducts,
        reviews: mockReviews,
        salesData: mockSalesData,
        specifications: mockSpecifications,
        variants: mockVariants,
      };

      setProduct(productDetail);

    } catch (err: any) {
      console.error('Failed to fetch product details:', err);
      setError(err.message || 'Failed to load product details. Please try again.');
      toast({
        variant: "destructive",
        title: "Error loading product",
        description: "Could not fetch product details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Event Handlers
  const handleEdit = () => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await adminApiService.deleteProduct(id!);
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      });
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: "Could not delete the product. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!product) return;

    try {
      const formData = new FormData();
      formData.append('isActive', (!product.isActive).toString());
      
      const response = await adminApiService.updateProduct(id!, formData);
      
      // Update the product state
      setProduct(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
      
      toast({
        title: `Product ${!product.isActive ? 'activated' : 'deactivated'}`,
        description: `Product status updated successfully.`,
      });
    } catch (err) {
      console.error('Failed to toggle status:', err);
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: "Could not update product status.",
      });
    }
  };

  // Utility Functions
  const copyToClipboard = (text: string, label: string) => {
    if (!text) {
      toast({
        variant: "destructive",
        title: "No content",
        description: `No ${label.toLowerCase()} to copy.`,
      });
      return;
    }
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return "/placeholder.svg";
    
    const clean = imagePath.trim();
    
    // If it's already a full URL, return as is
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      return clean;
    }
    
    // Handle Cloudinary URLs
    if (clean.includes("cloudinary.com")) {
      return clean;
    }
    
    // Handle render.com uploads
    if (clean.includes("georgina-server-code.onrender.com/uploads/products/")) {
      const filename = clean.split("/").pop();
      return `https://res.cloudinary.com/dy0lpwemp/image/upload/v1762654150/georgina-products/${filename}`;
    }
    
    // Handle local upload paths
    if (clean.startsWith("uploads/products/")) {
      const filename = clean.split("/").pop();
      return `https://res.cloudinary.com/dy0lpwemp/image/upload/v1762654150/georgina-products/${filename}`;
    }
    
    // Default fallback
    return clean;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return "Invalid date";
    }
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };

  const calculateRating = () => {
    if (!product?.reviews?.length) return 0;
    const total = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / product.reviews.length;
  };

  const getSizesArray = () => {
    if (!product?.size) return [];
    
    if (typeof product.size === 'string') {
      return product.size.split(',').map(s => s.trim()).filter(s => s);
    }
    
    if (Array.isArray(product.size)) {
      return product.size.filter(s => s != null && s !== '');
    }
    
    return [];
  };

  const getDisplayTags = (): string[] => {
    if (!product?.tags) return [];
    
    const tags = product.tags;
    
    if (Array.isArray(tags)) {
      return tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim() !== '');
    }
    
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          return parsed.filter((tag): tag is string => typeof tag === 'string' && tag.trim() !== '');
        }
        return [];
      } catch {
        return (tags as string).split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      }
    }
    
    return [];
  };

  // Derived State
  const rating = product ? calculateRating() : 0;
  const sizeArray = product ? getSizesArray() : [];
  const tagsArray = product ? getDisplayTags() : [];

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Product Not Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/admin/products')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
              <Button variant="outline" onClick={fetchProductDetails}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Render
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/products')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant={product.isActive ? "default" : "destructive"}>
                {product.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {product.sku || "SKU: N/A"}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                ID: {typeof product.id === 'number' ? product.id.toString() : product.id || "N/A"}
              </Badge>
              {product.isFeatured && (
                <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {product.isTrending && (
                <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
                  <Zap className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {product.isNewArrival && (
                <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                  <Clock className="h-3 w-3 mr-1" />
                  New Arrival
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(window.location.href, "Product URL")}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
          >
            {product.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            size="sm"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image Card */}
          <Card>
            <CardContent className="p-6">
              <div className="relative aspect-square rounded-lg border overflow-hidden bg-muted">
                {product.images && product.images[currentImageIndex] ? (
                  <img
                    src={getImageUrl(product.images[currentImageIndex])}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-2" />
                    <p>No image available</p>
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-md border overflow-hidden transition-all ${
                        currentImageIndex === index 
                          ? 'ring-2 ring-primary' 
                          : 'hover:ring-1 hover:ring-muted-foreground'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Sales</div>
                  <div className="text-2xl font-bold">
                    {product.salesData?.totalSales || 0}
                  </div>
                </div>
                <div className="space-y-2 p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Revenue</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(product.salesData?.revenue || 0)}
                  </div>
                </div>
                <div className="space-y-2 p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Rating</div>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    {rating.toFixed(1)}
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
                <div className="space-y-2 p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Conversion</div>
                  <div className="text-2xl font-bold">
                    {product.salesData?.conversionRate?.toFixed(1) || 0}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Product Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Price</Label>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(product.price)}
                </div>
                {product.discountPrice && (
                  <div className="text-sm text-muted-foreground line-through">
                    Was {formatCurrency(product.discountPrice)}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Stock Status</Label>
                <div className={`text-lg font-bold ${
                  product.stock === 0 
                    ? 'text-red-600' 
                    : product.stock < 10 
                      ? 'text-orange-600' 
                      : 'text-green-600'
                }`}>
                  {product.stock} units
                  {product.stock === 0 && (
                    <div className="text-xs font-normal text-red-500">Out of stock</div>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="text-xs font-normal text-orange-500">Low stock</div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Categories</Label>
                <div className="space-y-2">
                  <Badge variant="outline">{product.categoryLevel1}</Badge>
                  {product.categoryLevel2 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Subcategory: </span>
                      {product.categoryLevel2}
                    </div>
                  )}
                  {product.categoryLevel3 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Sub-subcategory: </span>
                      {product.categoryLevel3}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Product Type</Label>
                <div className="text-sm capitalize">{product.serviceType}</div>
              </div>
            </CardContent>
          </Card>



          {/* Product Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Brand</Label>
                <div className="text-sm">{product.brand || "No brand specified"}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Unit</Label>
                <div className="text-sm capitalize">{product.unit}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Service Duration</Label>
                <div className="text-sm">{product.serviceDuration || "Not specified"}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Created</Label>
                <div className="text-sm">{formatDate(product.createdAt)}</div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Last Updated</Label>
                <div className="text-sm">{formatDate(product.updatedAt)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Details Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Complete information about {product.name}</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 pt-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {product.description || "No description provided."}
                </p>
              </div>

              {sizeArray.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Available Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizeArray.map((size, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {tagsArray.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {tagsArray.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="specifications" className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Product Specifications</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Weight</span>
                      <span className="text-sm font-medium">{product.weight || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Dimensions</span>
                      <span className="text-sm font-medium">{product.dimensions || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Material</span>
                      <span className="text-sm font-medium">Premium Cotton</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Warranty</span>
                      <span className="text-sm font-medium">1 Year</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Additional Information</h4>
                  <div className="space-y-3">
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{key}</span>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Category Path</h4>
                  <div className="flex items-center text-sm">
                    <span className="font-medium">{product.categoryLevel1}</span>
                    {product.categoryLevel2 && (
                      <>
                        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                        <span className="font-medium">{product.categoryLevel2}</span>
                      </>
                    )}
                    {product.categoryLevel3 && (
                      <>
                        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                        <span className="font-medium">{product.categoryLevel3}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Special Categories</h4>
                    <div className="space-y-2">
                      {product.isFeatured && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>Featured Product</span>
                          {product.featuredOrder > 0 && (
                            <Badge variant="outline" className="ml-auto">
                              Order: {product.featuredOrder}
                            </Badge>
                          )}
                        </div>
                      )}
                      {product.isTrending && (
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-orange-500" />
                          <span>Trending Product</span>
                          {product.trendingOrder > 0 && (
                            <Badge variant="outline" className="ml-auto">
                              Order: {product.trendingOrder}
                            </Badge>
                          )}
                        </div>
                      )}
                      {product.isNewArrival && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>New Arrival</span>
                          {product.newArrivalOrder > 0 && (
                            <Badge variant="outline" className="ml-auto">
                              Order: {product.newArrivalOrder}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/products')}
          className="w-full max-w-md"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Products
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;