import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DollarSign,
  Star,
  TrendingUp,
  Zap,
  Calendar,
  Tag,
  Hash,
  Layers,
  Edit,
  Trash2,
  Check,
  X,
  Sparkles,
  BarChart3,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService from "@/contexts/adminApiService";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryLevel1: string;
  categoryLevel2?: string;
  categoryLevel3?: string;
  unit: string;
  stock: number;
  images: string[];
  tags?: string[];
  brand?: string;
  isActive: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  featuredOrder?: number;
  trendingOrder?: number;
  newArrivalOrder?: number;
  size?: string | string[];
  sku?: string;
  weight?: number;
  dimensions?: string;
  discountPrice?: number;
  discountPercentage?: number;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      const response = await adminApiService.getProducts();
      
      let productsData: any[] = [];
      if (Array.isArray(response)) {
        productsData = response;
      } else if (response && Array.isArray(response.products)) {
        productsData = response.products;
      } else if (response && response.data) {
        productsData = Array.isArray(response.data) ? response.data : response.data.products || [];
      }

      const foundProduct = productsData.find((p: any) => String(p.id) === id);
      
      if (!foundProduct) {
        toast({
          variant: "destructive",
          title: "Product not found",
          description: "The requested product could not be found.",
        });
        navigate("/admin/products");
        return;
      }

      setProduct(foundProduct);
    } catch (err: any) {
      console.error('Failed to fetch product:', err);
      toast({
        variant: "destructive",
        title: "Error loading product",
        description: err.message || "Could not load product details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;

    try {
      await adminApiService.deleteProduct(product.id);
      
      toast({
        title: "Product deleted",
        description: `${product.name} has been deleted successfully.`,
      });

      navigate("/admin/products");
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: err.message || "Could not delete the product.",
      });
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http')) return imagePath;
    return `https://georgina-server-code.onrender.com${imagePath}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
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

  if (!product) {
    return (
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        <Button variant="outline" onClick={() => navigate("/admin/products")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Product not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ["/placeholder.svg"];

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-6 md:p-8 shadow-lg">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-slate-700/25"></div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/products")}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {product.name}
                </h1>
                {product.isActive ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <X className="h-3 w-3 mr-1" />
                    Inactive
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {product.isTrending && (
                  <Badge className="bg-pink-100 text-pink-800 border-pink-200">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
                {product.isNewArrival && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    <Sparkles className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" />
                  SKU: {product.sku || 'N/A'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5" />
                  ID: {product.id}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Created: {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/admin/products/${product.id}/edit`)}
              className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="shadow-lg"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Section - Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Pricing Card */}
        <Card className="border-2 border-emerald-200 dark:border-emerald-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {product.discountPrice && product.discountPrice > 0 ? (
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${Number(product.discountPrice).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground line-through">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>
                {product.discountPercentage && (
                  <Badge className="bg-amber-500 text-white text-xs">
                    -{product.discountPercentage}% OFF
                  </Badge>
                )}
              </div>
            ) : (
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  ${Number(product.price).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">per {product.unit}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Card */}
        <Card className={`border-2 ${
          product.stock > 10 
            ? 'border-green-200 dark:border-green-900'
            : product.stock > 0
            ? 'border-amber-200 dark:border-amber-900'
            : 'border-red-200 dark:border-red-900'
        }`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Package className="h-4 w-4" />
              Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                {product.stock} <span className="text-base font-normal text-muted-foreground">{product.unit}s</span>
              </p>
              {product.stock === 0 && (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
              {product.stock > 0 && product.stock <= 10 && (
                <Badge className="bg-amber-500 text-xs">
                  Low Stock
                </Badge>
              )}
              {product.stock > 10 && (
                <Badge className="bg-green-500 text-xs">
                  In Stock
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rating Card */}
        <Card className="border-2 border-purple-200 dark:border-purple-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Star className="h-4 w-4 text-amber-500" />
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            {product.rating ? (
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{product.rating}</p>
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                </div>
                {product.reviewsCount && (
                  <p className="text-xs text-muted-foreground">
                    {product.reviewsCount} review{product.reviewsCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No ratings yet</p>
            )}
          </CardContent>
        </Card>

        {/* Views/Stats Card */}
        <Card className="border-2 border-blue-200 dark:border-blue-900">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-semibold">{product.categoryLevel1}</p>
                {product.categoryLevel2 && (
                  <p className="text-xs text-muted-foreground">→ {product.categoryLevel2}</p>
                )}
                {product.categoryLevel3 && (
                  <p className="text-xs text-muted-foreground">→ {product.categoryLevel3}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Images (Larger) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <Card className="border-2 hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Product Images
              </CardTitle>
              <CardDescription>View all product images</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800">
                  <img
                    src={getImageUrl(images[currentImageIndex])}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                
                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Description */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || 'No description available'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Categories */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-4 w-4" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                <span className="text-xs font-medium">Level 1</span>
                <Badge variant="outline" className="text-xs">{product.categoryLevel1}</Badge>
              </div>
              {product.categoryLevel2 && (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                  <span className="text-xs font-medium">Level 2</span>
                  <Badge variant="secondary" className="text-xs">{product.categoryLevel2}</Badge>
                </div>
              )}
              {product.categoryLevel3 && (
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
                  <span className="text-xs font-medium">Level 3</span>
                  <Badge variant="outline" className="text-xs">{product.categoryLevel3}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Attributes */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-base">Product Attributes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.brand && (
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Brand</span>
                  <Badge variant="secondary">{product.brand}</Badge>
                </div>
              )}
              
              {product.weight && (
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Weight</span>
                  <span className="text-sm font-medium">{product.weight} kg</span>
                </div>
              )}
              
              {product.dimensions && (
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Dimensions</span>
                  <span className="text-sm font-medium">{product.dimensions}</span>
                </div>
              )}
              
              {product.size && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Available Sizes</span>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(product.size) ? product.size : [product.size]).map((size, index) => (
                      <Badge key={index} variant="outline">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium">
                  {new Date(product.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="space-y-1 pt-2 border-t">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">
                  {new Date(product.updatedAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="sm:max-w-[450px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl">Delete Product</AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription className="text-base pt-2">
              Are you sure you want to delete <strong className="text-foreground">"{product.name}"</strong>?
              <div className="mt-3 p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900">
                <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
                  ⚠️ This action cannot be undone
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                  The product will be permanently removed from your catalog and all associated data will be deleted.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="sm:mr-2">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
