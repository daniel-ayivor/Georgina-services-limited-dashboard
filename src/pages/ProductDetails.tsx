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
          <div className="flex items-start gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/admin/products")}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Product Images */}
          <Card className="border-2 hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Eye className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-video max-h-96 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
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
                  <div className="grid grid-cols-4 gap-2">
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

          {/* Product Details Tabs */}
          <Card className="border-2">
            <Tabs defaultValue="details" className="w-full">
              <CardHeader className="pb-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="details" className="space-y-6 mt-0">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description || 'No description available'}
                    </p>
                  </div>

                  {product.brand && (
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">Brand</h3>
                      <Badge variant="secondary" className="text-base px-3 py-1">
                        {product.brand}
                      </Badge>
                    </div>
                  )}

                  {product.tags && product.tags.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="px-3 py-1">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.size && (
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">Available Sizes</h3>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(product.size) ? product.size : [product.size]).map((size, index) => (
                          <Badge key={index} variant="secondary" className="px-4 py-2">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="specifications" className="space-y-4 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Weight</span>
                        <span className="text-sm font-medium">{product.weight ? `${product.weight} kg` : "N/A"}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Dimensions</span>
                        <span className="text-sm font-medium">{product.dimensions || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4 mt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Main Category</span>
                      </div>
                      <Badge variant="outline">{product.categoryLevel1}</Badge>
                    </div>
                    {product.categoryLevel2 && (
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Subcategory</span>
                        </div>
                        <Badge variant="secondary">{product.categoryLevel2}</Badge>
                      </div>
                    )}
                    {product.categoryLevel3 && (
                      <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">Sub-subcategory</span>
                        </div>
                        <Badge variant="outline">{product.categoryLevel3}</Badge>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="border-2 border-emerald-200 dark:border-emerald-900 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-4 text-center border-2 border-emerald-200 dark:border-emerald-900">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Regular Price</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                  ${Number(product.price).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">per {product.unit}</p>
              </div>

              {product.discountPrice && product.discountPrice > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Discount Price</span>
                    {product.discountPercentage && (
                      <Badge className="bg-amber-500 text-white">
                        -{product.discountPercentage}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                    ${Number(product.discountPrice).toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory Card */}
          <Card className="border-2 border-blue-200 dark:border-blue-900 shadow-lg">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className={`p-3 rounded-lg border-2 ${
                product.stock > 10 
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
                  : product.stock > 0
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                  : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
              }`}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">
                  Stock Level
                </p>
                <p className="text-2xl font-bold">
                  {product.stock} <span className="text-lg">{product.unit}s</span>
                </p>
                {product.stock === 0 && (
                  <Badge variant="destructive" className="mt-2">
                    Out of Stock
                  </Badge>
                )}
                {product.stock > 0 && product.stock <= 10 && (
                  <Badge className="mt-2 bg-amber-500">
                    Low Stock
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          {(product.rating || product.reviewsCount) && (
            <Card className="border-2 border-purple-200 dark:border-purple-900 shadow-lg">
              <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {product.rating && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span className="text-sm font-bold">{product.rating}</span>
                    </div>
                  </div>
                )}
                {product.reviewsCount && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Reviews</span>
                    <span className="text-sm font-bold">{product.reviewsCount}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline Card */}
          <Card className="border-2 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <Calendar className="h-4 w-4 text-slate-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Created</p>
                  <p className="text-sm font-medium mt-1">
                    {new Date(product.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <RefreshCw className="h-4 w-4 text-slate-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Last Updated</p>
                  <p className="text-sm font-medium mt-1">
                    {new Date(product.updatedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
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
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{product.name}"? 
              This action cannot be undone and will permanently remove this product from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
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
