

import { useState, useEffect } from "react";
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
import { Search, Plus, Edit, Trash2, Package, DollarSign, TrendingUp, AlertTriangle, RefreshCw, AlertCircle, X, Eye, Calendar, Star, Zap, Clock, Filter, Check } from "lucide-react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import adminApiService from "@/contexts/adminApiService";
import { ImageUploadWithFile } from "@/lib/ImageLoader";

// Update the Product interface to include special category fields
interface ProductWithSpecial extends Product {
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  featuredOrder: number;
  trendingOrder: number;
  newArrivalOrder: number;
}
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  categoryLevel1: string;
  categoryLevel2: string;
  categoryLevel3: string;
  serviceType: 'physical' | 'service';
  serviceDuration: string;
  unit: string;
  stock: string;
  brand: string;
  tags: string[];
  isActive: boolean;
  image: File | string | null;

  // FIXED: Use proper types for special category fields
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  featuredOrder: number;        // Changed from string to number
  trendingOrder: number;        // Changed from string to number
  newArrivalOrder: number;      // Changed from string to number
}
interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface BulkUpdateItem {
  productId: string;
  updates: {
    isFeatured?: boolean;
    isTrending?: boolean;
    isNewArrival?: boolean;
    featuredOrder?: number;
    trendingOrder?: number;
    newArrivalOrder?: number;
  };
}

// Tag Input Component
const TagInput = ({
  tags,
  onTagsChange,
  disabled
}: {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const cleanTag = tag.trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      onTagsChange([...tags, cleanTag]);
    }
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md min-h-10 bg-background">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs py-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 hover:text-destructive text-xs"
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={tags.length === 0 ? "Add tags..." : "Add another tag..."}
          className="flex-1 outline-none bg-transparent text-sm min-w-20 placeholder:text-muted-foreground"
          disabled={disabled}
        />
      </div>
      <p className="text-xs text-muted-foreground">Press Enter, comma, or click outside to add tags</p>
    </div>
  );
};

// Product Details Modal Component
const ProductDetailsModal = ({
  product,
  open,
  onOpenChange
}: {
  product: ProductWithSpecial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8003';
    const filename = imagePath.split(/[\\/]/).pop();
    return `${BACKEND_URL}/uploads/products/${filename}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Safely convert tags to array for display
  const getDisplayTags = (tags: any): string[] => {
    if (!tags) return [];

    if (Array.isArray(tags)) {
      return tags.filter(tag => typeof tag === 'string');
    }

    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          return parsed.filter(tag => typeof tag === 'string');
        }
      } catch {
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    return [];
  };

  if (!product) return null;

  const displayTags = getDisplayTags(product.tags);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details
          </DialogTitle>
          <DialogDescription>
            Complete information about {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={getImageUrl(product.images?.[0])}
              alt={product.name}
              className="h-64 w-64 object-cover rounded-lg border shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-muted-foreground">{product.description || "No description available"}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Price</span>
                  <span className="text-lg font-bold text-green-600">
                    ${parseFloat(product.price?.toString() || '0').toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Stock</span>
                  <Badge variant={product.stock < 10 ? "destructive" : "default"}>
                    {product.stock} units
                  </Badge>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Status</span>
                  <Badge variant={product.isActive ? "default" : "destructive"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Type</span>
                  <Badge variant={product.serviceType === 'service' ? "default" : "secondary"}>
                    {product.serviceType}
                  </Badge>
                </div>

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Unit</span>
                  <span className="text-muted-foreground capitalize">{product.unit || 'piece'}</span>
                </div>
              </div>

              {/* Special Categories */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-semibold">Special Categories</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Featured
                    </span>
                    <Badge variant={product.isFeatured ? "default" : "outline"}>
                      {product.isFeatured ? `Yes (Order: ${product.featuredOrder || 0})` : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      Trending
                    </span>
                    <Badge variant={product.isTrending ? "default" : "outline"}>
                      {product.isTrending ? `Yes (Order: ${product.trendingOrder || 0})` : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      New Arrival
                    </span>
                    <Badge variant={product.isNewArrival ? "default" : "outline"}>
                      {product.isNewArrival ? `Yes (Order: ${product.newArrivalOrder || 0})` : "No"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Category Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Main Category</span>
                    <Badge variant="outline">{product.categoryLevel1}</Badge>
                  </div>
                  {product.categoryLevel2 && (
                    <div className="flex justify-between">
                      <span>Subcategory</span>
                      <span className="text-muted-foreground">{product.categoryLevel2}</span>
                    </div>
                  )}
                  {product.categoryLevel3 && (
                    <div className="flex justify-between">
                      <span>Sub-subcategory</span>
                      <span className="text-muted-foreground">{product.categoryLevel3}</span>
                    </div>
                  )}
                </div>
              </div>

              {product.brand && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Brand</h4>
                  <Badge variant="secondary" className="text-sm">
                    {product.brand}
                  </Badge>
                </div>
              )}

              {product.serviceDuration && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Service Duration</h4>
                  <p className="text-muted-foreground">{product.serviceDuration}</p>
                </div>
              )}

              {/* Tags */}
              {displayTags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {displayTags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold">Timestamps</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {formatDate(product.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Updated: {formatDate(product.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Special Products Manager Component
const SpecialProductsManager = ({ products, onUpdateProduct }: { products: ProductWithSpecial[], onUpdateProduct: (productId: string, updates: any) => void }) => {
  const [allProducts, setAllProducts] = useState<ProductWithSpecial[]>(products);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithSpecial[]>(products);
  const [selectedTab, setSelectedTab] = useState<'all' | 'featured' | 'trending' | 'new-arrivals'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [quickEditDialogOpen, setQuickEditDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductWithSpecial | null>(null);
  const [bulkAction, setBulkAction] = useState<'add-featured' | 'add-trending' | 'add-new-arrival' | 'remove-all'>('add-featured');
  const [quickEditData, setQuickEditData] = useState({
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    featuredOrder: 0,
    trendingOrder: 0,
    newArrivalOrder: 0,
  });

  const { toast } = useToast();

  // Helper function to convert file path to URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8003';
    const filename = imagePath.split(/[\\/]/).pop();
    return `${BACKEND_URL}/uploads/products/${filename}`;
  };

  // Update local products when props change
  useEffect(() => {
    setAllProducts(products);
    setFilteredProducts(products);
  }, [products]);

  // Filter products based on search and selected tab
  useEffect(() => {
    let filtered = allProducts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (selectedTab) {
      case 'featured':
        filtered = filtered.filter(product => product.isFeatured);
        break;
      case 'trending':
        filtered = filtered.filter(product => product.isTrending);
        break;
      case 'new-arrivals':
        filtered = filtered.filter(product => product.isNewArrival);
        break;
      case 'all':
      default:
        // Show all products
        break;
    }

    setFilteredProducts(filtered);
  }, [allProducts, searchTerm, selectedTab]);

  // Calculate analytics
  const analytics = {
    totalProducts: allProducts.length,
    featured: allProducts.filter(p => p.isFeatured).length,
    trending: allProducts.filter(p => p.isTrending).length,
    newArrivals: allProducts.filter(p => p.isNewArrival).length,
    activeProducts: allProducts.filter(p => p.isActive).length,
  };

  const handleQuickEdit = (product: ProductWithSpecial) => {
    setEditingProduct(product);
    setQuickEditData({
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
      isNewArrival: product.isNewArrival,
      featuredOrder: product.featuredOrder,
      trendingOrder: product.trendingOrder,
      newArrivalOrder: product.newArrivalOrder,
    });
    setQuickEditDialogOpen(true);
  };

  const handleQuickUpdate = async () => {
    if (!editingProduct) return;

    try {
      await adminApiService.updateProductSpecialCategories(editingProduct.id, quickEditData);

      // Update local state
      const updatedProducts = allProducts.map(p =>
        p.id === editingProduct.id
          ? { ...p, ...quickEditData }
          : p
      );
      setAllProducts(updatedProducts);

      // Notify parent component
      onUpdateProduct(editingProduct.id, quickEditData);

      toast({
        title: "Product updated",
        description: "Special categories updated successfully.",
      });

      setQuickEditDialogOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to update product:', error);
      toast({
        variant: "destructive",
        title: "Error updating product",
        description: "Could not update special categories.",
      });
    }
  };

  const handleBulkAction = async () => {
    if (selectedProducts.length === 0) {
      toast({
        variant: "destructive",
        title: "No products selected",
        description: "Please select at least one product.",
      });
      return;
    }

    try {
      let updates: BulkUpdateItem[] = [];

      switch (bulkAction) {
        case 'add-featured':
          updates = selectedProducts.map(productId => ({
            productId,
            updates: {
              isFeatured: true,
              featuredOrder: 0
            }
          }));
          break;
        case 'add-trending':
          updates = selectedProducts.map(productId => ({
            productId,
            updates: {
              isTrending: true,
              trendingOrder: 0
            }
          }));
          break;
        case 'add-new-arrival':
          updates = selectedProducts.map(productId => ({
            productId,
            updates: {
              isNewArrival: true,
              newArrivalOrder: 0
            }
          }));
          break;
        case 'remove-all':
          updates = selectedProducts.map(productId => ({
            productId,
            updates: {
              isFeatured: false,
              isTrending: false,
              isNewArrival: false,
              featuredOrder: 0,
              trendingOrder: 0,
              newArrivalOrder: 0
            }
          }));
          break;
      }

      const response = await adminApiService.bulkUpdateSpecialCategories({
        products: updates
      });

      // Update local state for all affected products
      const updatedProducts = allProducts.map(product => {
        if (selectedProducts.includes(product.id)) {
          const update = updates.find(u => u.productId === product.id);
          if (update) {
            const updatedProduct = { ...product, ...update.updates };
            // Notify parent component for each updated product
            onUpdateProduct(product.id, update.updates);
            return updatedProduct;
          }
        }
        return product;
      });
      setAllProducts(updatedProducts);

      toast({
        title: "Bulk update completed",
        description: `${response.results.length} products updated successfully.`,
      });

      setSelectedProducts([]);
      setBulkDialogOpen(false);
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
      toast({
        variant: "destructive",
        title: "Error performing bulk action",
        description: "Could not update products.",
      });
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleQuickToggle = async (productId: string, field: 'isFeatured' | 'isTrending' | 'isNewArrival') => {
    try {
      const product = allProducts.find(p => p.id === productId);
      if (!product) return;

      const updates = {
        [field]: !product[field],
        [`${field}Order`]: !product[field] ? 0 : product[`${field}Order`]
      };

      await adminApiService.updateProductSpecialCategories(productId, updates);

      // Update local state
      const updatedProducts = allProducts.map(p =>
        p.id === productId
          ? { ...p, ...updates }
          : p
      );
      setAllProducts(updatedProducts);

      // Notify parent component
      onUpdateProduct(productId, updates);

      toast({
        title: "Product updated",
        description: `${field.replace('is', '').replace(/([A-Z])/g, ' $1').trim()} status updated.`,
      });
    } catch (error) {
      console.error('Failed to toggle product status:', error);
      toast({
        variant: "destructive",
        title: "Error updating product",
        description: "Could not update product status.",
      });
    }
  };

  const SpecialCategoryBadge = ({ product }: { product: ProductWithSpecial }) => (
    <div className="flex gap-1">
      {product.isFeatured && (
        <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-xs">
          <Star className="h-3 w-3 mr-1" />
          Featured
        </Badge>
      )}
      {product.isTrending && (
        <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 text-xs">
          <Zap className="h-3 w-3 mr-1" />
          Trending
        </Badge>
      )}
      {product.isNewArrival && (
        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          New
        </Badge>
      )}
      {!product.isFeatured && !product.isTrending && !product.isNewArrival && (
        <span className="text-xs text-muted-foreground">No special categories</span>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Special Categories</h1>
        <div className="flex gap-2">
          {selectedProducts.length > 0 && (
            <Button onClick={() => setBulkDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Bulk Action ({selectedProducts.length})
            </Button>
          )}
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeProducts} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.featured}</div>
            <p className="text-xs text-muted-foreground">
              Featured products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.trending}</div>
            <p className="text-xs text-muted-foreground">
              Trending products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.newArrivals}</div>
            <p className="text-xs text-muted-foreground">
              New arrivals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedProducts.length}</div>
            <p className="text-xs text-muted-foreground">
              For bulk action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Special Categories</CardTitle>
          <CardDescription>
            Feature products in special categories to highlight them on your store. All products are shown here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                All Products
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Featured
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="new-arrivals" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                New Arrivals
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name, brand, or description..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  <span>{filteredProducts.length} products</span>
                </div>
              </div>

              {/* Products Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Special Categories</TableHead>
                      <TableHead className="text-center">Quick Toggles</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id} className="hover:bg-muted/50">
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleProductSelect(product.id)}
                              className="rounded border-gray-300"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={getImageUrl(product.images?.[0])}
                                alt={product.name}
                                className="h-10 w-10 rounded object-cover border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {product.brand && <span>{product.brand} • </span>}
                                  {product.categoryLevel1}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${parseFloat(product.price?.toString() || '0').toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.stock < 10 ? "destructive" : "outline"}>
                              {product.stock}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.isActive ? "default" : "destructive"}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <SpecialCategoryBadge product={product} />
                            {(product.isFeatured || product.isTrending || product.isNewArrival) && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {product.isFeatured && `Featured Order: ${product.featuredOrder} `}
                                {product.isTrending && `Trending Order: ${product.trendingOrder} `}
                                {product.isNewArrival && `New Arrival Order: ${product.newArrivalOrder}`}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                variant={product.isFeatured ? "default" : "outline"}
                                className={`h-8 w-8 p-0 ${product.isFeatured
                                    ? "bg-yellow-500 hover:bg-yellow-600"
                                    : ""
                                  }`}
                                onClick={() => handleQuickToggle(product.id, 'isFeatured')}
                                title="Toggle Featured"
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={product.isTrending ? "default" : "outline"}
                                className={`h-8 w-8 p-0 ${product.isTrending
                                    ? "bg-orange-500 hover:bg-orange-600"
                                    : ""
                                  }`}
                                onClick={() => handleQuickToggle(product.id, 'isTrending')}
                                title="Toggle Trending"
                              >
                                <Zap className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={product.isNewArrival ? "default" : "outline"}
                                className={`h-8 w-8 p-0 ${product.isNewArrival
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : ""
                                  }`}
                                onClick={() => handleQuickToggle(product.id, 'isNewArrival')}
                                title="Toggle New Arrival"
                              >
                                <Clock className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleQuickEdit(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-10">
                          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-lg font-medium">No products found</p>
                          <p className="text-muted-foreground">
                            {searchTerm ? "Try adjusting your search terms" : "No products available"}
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Edit Dialog */}
      <Dialog open={quickEditDialogOpen} onOpenChange={setQuickEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Special Categories</DialogTitle>
            <DialogDescription>
              Configure special categories for {editingProduct?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Special Categories</Label>

              <div className="space-y-3">
                {/* Featured */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="isFeatured" className="flex items-center gap-2 cursor-pointer">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Featured</div>
                      <div className="text-sm text-muted-foreground">Highlight on featured section</div>
                    </div>
                  </Label>
                  <Switch
                    id="isFeatured"
                    checked={quickEditData.isFeatured}
                    onCheckedChange={(checked) => setQuickEditData({ ...quickEditData, isFeatured: checked })}
                  />
                </div>

                {/* Trending */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="isTrending" className="flex items-center gap-2 cursor-pointer">
                    <Zap className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium">Trending</div>
                      <div className="text-sm text-muted-foreground">Show in trending products</div>
                    </div>
                  </Label>
                  <Switch
                    id="isTrending"
                    checked={quickEditData.isTrending}
                    onCheckedChange={(checked) => setQuickEditData({ ...quickEditData, isTrending: checked })}
                  />
                </div>

                {/* New Arrival */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="isNewArrival" className="flex items-center gap-2 cursor-pointer">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">New Arrival</div>
                      <div className="text-sm text-muted-foreground">Mark as new arrival</div>
                    </div>
                  </Label>
                  <Switch
                    id="isNewArrival"
                    checked={quickEditData.isNewArrival}
                    onCheckedChange={(checked) => setQuickEditData({ ...quickEditData, isNewArrival: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Display Orders */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Display Orders</Label>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="featuredOrder" className="text-xs">Featured Order</Label>
                  <Input
                    id="featuredOrder"
                    type="number"
                    min="0"
                    value={quickEditData.featuredOrder}
                    onChange={(e) => setQuickEditData({ ...quickEditData, featuredOrder: parseInt(e.target.value) || 0 })}
                    disabled={!quickEditData.isFeatured}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trendingOrder" className="text-xs">Trending Order</Label>
                  <Input
                    id="trendingOrder"
                    type="number"
                    min="0"
                    value={quickEditData.trendingOrder}
                    onChange={(e) => setQuickEditData({ ...quickEditData, trendingOrder: parseInt(e.target.value) || 0 })}
                    disabled={!quickEditData.isTrending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newArrivalOrder" className="text-xs">New Arrival Order</Label>
                  <Input
                    id="newArrivalOrder"
                    type="number"
                    min="0"
                    value={quickEditData.newArrivalOrder}
                    onChange={(e) => setQuickEditData({ ...quickEditData, newArrivalOrder: parseInt(e.target.value) || 0 })}
                    disabled={!quickEditData.isNewArrival}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleQuickUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Bulk Action</DialogTitle>
            <DialogDescription>
              Apply action to {selectedProducts.length} selected products
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Select Action</Label>

              <Select value={bulkAction} onValueChange={(value: any) => setBulkAction(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add-featured">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Add to Featured
                    </div>
                  </SelectItem>
                  <SelectItem value="add-trending">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      Add to Trending
                    </div>
                  </SelectItem>
                  <SelectItem value="add-new-arrival">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Add to New Arrivals
                    </div>
                  </SelectItem>
                  <SelectItem value="remove-all">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4 text-destructive" />
                      Remove from All Categories
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Selected Products Preview */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Selected Products ({selectedProducts.length})</Label>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                {allProducts
                  .filter(p => selectedProducts.includes(p.id))
                  .slice(0, 5)
                  .map(product => (
                    <div key={product.id} className="text-sm py-1 truncate">
                      {product.name}
                    </div>
                  ))}
                {selectedProducts.length > 5 && (
                  <div className="text-sm text-muted-foreground py-1">
                    +{selectedProducts.length - 5} more...
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkAction}>
              Apply to {selectedProducts.length} Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Main Products Component
export default function Products() {
  const [products, setProducts] = useState<ProductWithSpecial[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithSpecial | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductWithSpecial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("catalog");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    categoryLevel1: "",
    categoryLevel2: "",
    categoryLevel3: "",
    serviceType: "physical",
    serviceDuration: "",
    unit: "piece",
    stock: "0",
    brand: "",
    tags: [],
    isActive: true,
    image: "",

    // NEW SPECIAL CATEGORY FIELDS
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    featuredOrder: 0,
    trendingOrder: 0,
    newArrivalOrder: 0,
  });
  const { toast } = useToast();

  // Predefined categories based on your model
  const categoryLevel1Options = ['Clothes', 'Foodstuffs', 'Services'];
  const serviceTypeOptions = ['physical', 'service'];
  const unitOptions = ['piece', 'kg', 'hour', 'day', 'month', 'set'];

  // Helper function to convert file path to URL
  // const getImageUrl = (imagePath: string | undefined) => {
  //   if (!imagePath) {
  //     return "/placeholder.svg";
  //   }

  //   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
  //     return imagePath;
  //   }

  //   const filename = imagePath.split(/[\\/]/).pop();
  //   const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8003';
  //   return `${BACKEND_URL}/uploads/products/${filename}`;
  // };

  // utils/getImageUrl.ts
  const getImageUrl = (image?: string): string => {
    if (!image || !image.trim()) {
      return "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&h=500&fit=crop";
    }

    const clean = image.trim();

    // ✅ If it's already a Cloudinary URL — keep it
    if (clean.includes("cloudinary.com")) {
      return clean;
    }

    // ✅ If it's from your backend uploads but needs Cloudinary mapping
    if (clean.includes("georgina-server-code.onrender.com/uploads/products/")) {
      const filename = clean.split("/").pop();
      return `https://res.cloudinary.com/dy0lpwemp/image/upload/v1762654150/georgina-products/${filename}`;
    }

    // ✅ If it’s a relative upload (no host yet)
    if (clean.startsWith("uploads/products/")) {
      const filename = clean.split("/").pop();
      return `https://res.cloudinary.com/dy0lpwemp/image/upload/v1762654150/georgina-products/${filename}`;
    }

    // ✅ Otherwise, return as-is
    return clean;
  };
  // Fetch products and categories from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const productsResponse = await adminApiService.getProducts();
      const productsList = productsResponse.products || productsResponse.data?.products || productsResponse || [];

      // Cast the products to include special fields with defaults
      const productsWithDefaults = (Array.isArray(productsList) ? productsList : []).map(product => ({
        ...product,
        isFeatured: (product as any).isFeatured ?? false,
        isTrending: (product as any).isTrending ?? false,
        isNewArrival: (product as any).isNewArrival ?? false,
        featuredOrder: (product as any).featuredOrder ?? 0,
        trendingOrder: (product as any).trendingOrder ?? 0,
        newArrivalOrder: (product as any).newArrivalOrder ?? 0,
      })) as ProductWithSpecial[];

      setProducts(productsWithDefaults);

    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data. Please try again.');
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Could not fetch products.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle product updates from SpecialProductsManager
  const handleProductUpdate = (productId: string, updates: any) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.categoryLevel1?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.brand?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalProducts = filteredProducts.length;
  const totalValue = filteredProducts.reduce((sum, p) => {
    const price = parseFloat(p.price?.toString() || '0');
    const stock = parseInt(p.stock?.toString() || '0');
    return sum + (price * stock);
  }, 0);
  const lowStockCount = filteredProducts.filter(p => (p.stock || 0) < 10).length;
  const avgPrice = totalProducts > 0 ? filteredProducts.reduce((sum, p) => {
    const price = parseFloat(p.price?.toString() || '0');
    return sum + price;
  }, 0) / totalProducts : 0;

  // Count special category products
  const featuredCount = filteredProducts.filter(p => p.isFeatured).length;
  const trendingCount = filteredProducts.filter(p => p.isTrending).length;
  const newArrivalsCount = filteredProducts.filter(p => p.isNewArrival).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.categoryLevel1) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();

      // Append all product data
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      formDataObj.append('price', formData.price);
      formDataObj.append('categoryLevel1', formData.categoryLevel1);
      formDataObj.append('categoryLevel2', formData.categoryLevel2);
      formDataObj.append('categoryLevel3', formData.categoryLevel3);
      formDataObj.append('serviceType', formData.serviceType);
      formDataObj.append('serviceDuration', formData.serviceDuration);
      formDataObj.append('unit', formData.unit);
      formDataObj.append('stock', formData.stock);
      formDataObj.append('brand', formData.brand);

      // Append tags as JSON string
      formDataObj.append('tags', JSON.stringify(formData.tags));

      formDataObj.append('isActive', formData.isActive.toString());

      // NEW: Append special category fields
      formDataObj.append('isFeatured', formData.isFeatured.toString());
      formDataObj.append('isTrending', formData.isTrending.toString());
      formDataObj.append('isNewArrival', formData.isNewArrival.toString());
      formDataObj.append('featuredOrder', formData.featuredOrder.toString());
      formDataObj.append('trendingOrder', formData.trendingOrder.toString());
      formDataObj.append('newArrivalOrder', formData.newArrivalOrder.toString());

      // Handle image upload
      if (formData.image instanceof File) {
        formDataObj.append('image', formData.image);
      } else if (!formData.image && !editingProduct) {
        toast({
          variant: "destructive",
          title: "Image required",
          description: "Please select an image for the product"
        });
        setIsSubmitting(false);
        return;
      }

      let result;
      if (editingProduct) {
        result = await adminApiService.updateProduct(editingProduct.id, formDataObj);
        // Cast the result to include special fields
        const resultWithSpecial = {
          ...result,
          isFeatured: (result as any).isFeatured ?? false,
          isTrending: (result as any).isTrending ?? false,
          isNewArrival: (result as any).isNewArrival ?? false,
          featuredOrder: (result as any).featuredOrder ?? 0,
          trendingOrder: (result as any).trendingOrder ?? 0,
          newArrivalOrder: (result as any).newArrivalOrder ?? 0,
        } as ProductWithSpecial;

        setProducts(products.map((p) => p.id === editingProduct.id ? resultWithSpecial : p));
        toast({
          title: "Product updated",
          description: "Product has been updated successfully"
        });
      } else {
        result = await adminApiService.createProduct(formDataObj);
        // Cast the result to include special fields
        const resultWithSpecial = {
          ...result,
          isFeatured: (result as any).isFeatured ?? false,
          isTrending: (result as any).isTrending ?? false,
          isNewArrival: (result as any).isNewArrival ?? false,
          featuredOrder: (result as any).featuredOrder ?? 0,
          trendingOrder: (result as any).trendingOrder ?? 0,
          newArrivalOrder: (result as any).newArrivalOrder ?? 0,
        } as ProductWithSpecial;

        setProducts(prev => [...prev, resultWithSpecial]);
        toast({
          title: "Product added",
          description: "Product has been added successfully"
        });
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryLevel1: "",
        categoryLevel2: "",
        categoryLevel3: "",
        serviceType: "physical",
        serviceDuration: "",
        unit: "piece",
        stock: "0",
        brand: "",
        tags: [],
        isActive: true,
        image: null,

        // NEW: Reset special category fields
        isFeatured: false,
        isTrending: false,
        isNewArrival: false,
        featuredOrder: 0,
        trendingOrder: 0,
        newArrivalOrder: 0,
      });
      setEditingProduct(null);
      setDialogOpen(false);

    } catch (err) {
      console.error('Failed to save product:', err);
      toast({
        variant: "destructive",
        title: "Error saving product",
        description: "Could not save the product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryLevel1: "",
      categoryLevel2: "",
      categoryLevel3: "",
      serviceType: "physical",
      serviceDuration: "",
      unit: "piece",
      stock: "0",
      brand: "",
      tags: [],
      isActive: true,
      image: null,

      // NEW: Reset special category fields
      isFeatured: false,
      isTrending: false,
      isNewArrival: false,
      featuredOrder: 0,
      trendingOrder: 0,
      newArrivalOrder: 0,
    });
    setDialogOpen(true);
  };

  const handleEditProduct = (productToEdit: ProductWithSpecial) => {
    setEditingProduct(productToEdit);

const convertTagsToArray = (tags: unknown): string[] => {
  if (!tags) return [];
  
  if (Array.isArray(tags)) {
    return tags.reduce<string[]>((acc, tag) => {
      if (typeof tag === 'string' && tag.trim()) {
        acc.push(tag.trim());
      }
      return acc;
    }, []);
  }
  
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) {
        return parsed.reduce<string[]>((acc, tag) => {
          if (typeof tag === 'string' && tag.trim()) {
            acc.push(tag.trim());
          }
          return acc;
        }, []);
      }
    } catch {
      return tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
    }
  }
  
  return [];
};

    setFormData({
      name: productToEdit.name,
      description: productToEdit.description || "",
      price: productToEdit.price.toString(),
      categoryLevel1: productToEdit.categoryLevel1 || "",
      categoryLevel2: productToEdit.categoryLevel2 || "",
      categoryLevel3: productToEdit.categoryLevel3 || "",
      serviceType: productToEdit.serviceType || "physical",
      serviceDuration: productToEdit.serviceDuration || "",
      unit: productToEdit.unit || "piece",
      stock: productToEdit.stock?.toString() || "0",
      brand: productToEdit.brand || "",
      tags: convertTagsToArray(productToEdit.tags),
      isActive: productToEdit.isActive !== undefined ? productToEdit.isActive : true,
      image: getImageUrl(productToEdit.images?.[0]) || "",

      // FIXED: Use numbers directly from the product
      isFeatured: productToEdit.isFeatured || false,
      isTrending: productToEdit.isTrending || false,
      isNewArrival: productToEdit.isNewArrival || false,
      featuredOrder: productToEdit.featuredOrder || 0,        // Number
      trendingOrder: productToEdit.trendingOrder || 0,        // Number
      newArrivalOrder: productToEdit.newArrivalOrder || 0,    // Number
    });
    setDialogOpen(true);
  };
  const handleViewProduct = (product: ProductWithSpecial) => {
    setSelectedProduct(product);
    setDetailsDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await adminApiService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast({
        title: "Product deleted",
        description: "The product has been removed successfully"
      });
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: "Could not delete the product. Please try again.",
      });
    }
  };

  const handleToggleStatus = async (productToToggle: ProductWithSpecial) => {
    try {
      const formData = new FormData();
      formData.append('isActive', (!productToToggle.isActive).toString());

      const updatedProduct = await adminApiService.updateProduct(productToToggle.id, formData);
      // Cast the updated product to include special fields
      const updatedProductWithSpecial = {
        ...updatedProduct,
        isFeatured: (updatedProduct as any).isFeatured ?? productToToggle.isFeatured,
        isTrending: (updatedProduct as any).isTrending ?? productToToggle.isTrending,
        isNewArrival: (updatedProduct as any).isNewArrival ?? productToToggle.isNewArrival,
        featuredOrder: (updatedProduct as any).featuredOrder ?? productToToggle.featuredOrder,
        trendingOrder: (updatedProduct as any).trendingOrder ?? productToToggle.trendingOrder,
        newArrivalOrder: (updatedProduct as any).newArrivalOrder ?? productToToggle.newArrivalOrder,
      } as ProductWithSpecial;

      setProducts(products.map((p) => p.id === productToToggle.id ? updatedProductWithSpecial : p));
      toast({
        title: `Product ${!productToToggle.isActive ? 'activated' : 'deactivated'}`,
        description: `Product has been ${!productToToggle.isActive ? 'activated' : 'deactivated'} successfully`
      });
    } catch (err) {
      console.error('Failed to toggle product status:', err);
      toast({
        variant: "destructive",
        title: "Error updating product",
        description: "Could not update product status. Please try again.",
      });
    }
  };

  // Loading and Skeleton Components
  const LoadingRow = () => (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-8">
        <div className="flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading products...</span>
        </div>
      </TableCell>
    </TableRow>
  );

  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-32" />
            <div className="h-3 bg-muted rounded animate-pulse w-24" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted rounded animate-pulse w-20" />
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted rounded animate-pulse w-16" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded animate-pulse w-12" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded animate-pulse w-16" />
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted rounded animate-pulse w-16" />
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted rounded animate-pulse w-16" />
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </div>
      </TableCell>
    </TableRow>
  );

  if (error && products.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Failed to load products</p>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchData}>
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
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {activeTab === "catalog" && (
            <Button onClick={handleAddProduct} disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="catalog" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Product Catalog
          </TabsTrigger>
          <TabsTrigger value="special" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Special Categories
          </TabsTrigger>
        </TabsList>

        {/* Product Catalog Tab */}
        <TabsContent value="catalog" className="space-y-6">
          {/* Stats Cards - Updated with Special Categories */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{totalProducts}</div>
                    <p className="text-xs text-muted-foreground">Active in catalog</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Featured</CardTitle>
                <Star className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{featuredCount}</div>
                    <p className="text-xs text-muted-foreground">Featured products</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trending</CardTitle>
                <Zap className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{trendingCount}</div>
                    <p className="text-xs text-muted-foreground">Trending products</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Arrivals</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{newArrivalsCount}</div>
                    <p className="text-xs text-muted-foreground">New arrivals</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
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
                    <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Inventory worth</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <>
                    <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{lowStockCount}</div>
                    <p className="text-xs text-muted-foreground">Items below 10 units</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Product Catalog</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Special</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonRow key={index} />
                    ))
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(product.images?.[0])}
                              alt={product.name}
                              className="h-12 w-12 rounded object-cover border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                            <div>
                              <div
                                className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => handleViewProduct(product)}
                              >
                                {product.name}
                              </div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {product.brand && <span>{product.brand} • </span>}
                                {product.description || "No description"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline">{product.categoryLevel1}</Badge>
                            {product.categoryLevel2 && (
                              <div className="text-xs text-muted-foreground">{product.categoryLevel2}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${product.price != null ? parseFloat(product.price.toString()).toFixed(2) : '0.00'}
                        </TableCell>
                        <TableCell>
                          <span className={product.stock < 10 ? "text-destructive font-medium" : ""}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.serviceType === 'service' ? 'default' : 'secondary'}>
                            {product.serviceType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.isActive ? 'default' : 'destructive'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {product.isFeatured && (
                              <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                F
                              </Badge>
                            )}
                            {product.isTrending && (
                              <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                T
                              </Badge>
                            )}
                            {product.isNewArrival && (
                              <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                N
                              </Badge>
                            )}
                            {!product.isFeatured && !product.isTrending && !product.isNewArrival && (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewProduct(product)}
                              disabled={isLoading}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(product)}
                              disabled={isLoading}
                            >
                              {product.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              disabled={isLoading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-muted-foreground">
                          {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first product"}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Special Categories Tab */}
        <TabsContent value="special">
          <SpecialProductsManager
            products={products}
            onUpdateProduct={handleProductUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingProduct
                ? "Update the product information"
                : "Add a new product to your catalog"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-1">
              <ImageUploadWithFile
                onImageChange={(file, previewUrl) => {
                  setFormData({ ...formData, image: file });
                }}
                currentImage={
                  typeof formData.image === 'string' ? formData.image :
                    formData.image instanceof File ? '' :
                      formData.image || ''
                }
                className="h-40"
              />

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Wireless Headphones"
                  className="h-9 text-sm"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-xs">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product..."
                  rows={3}
                  className="min-h-[80px] text-sm"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price" className="text-xs">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    className="h-9 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock" className="text-xs">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                    className="h-9 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="serviceType" className="text-xs">Service Type *</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value: 'physical' | 'service') => setFormData({ ...formData, serviceType: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit" className="text-xs">Unit</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData({ ...formData, unit: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.serviceType === 'service' && (
                <div className="grid gap-2">
                  <Label htmlFor="serviceDuration" className="text-xs">Service Duration</Label>
                  <Input
                    id="serviceDuration"
                    value={formData.serviceDuration}
                    onChange={(e) => setFormData({ ...formData, serviceDuration: e.target.value })}
                    placeholder="e.g., 2 hours, 1 day"
                    className="h-9 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="brand" className="text-xs">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Brand name"
                    className="h-9 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags" className="text-xs">Tags</Label>
                  <TagInput
                    tags={formData.tags}
                    onTagsChange={(newTags) => setFormData({ ...formData, tags: newTags })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* NEW: Special Categories Section */}
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-sm font-medium">Special Categories</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Featured */}
                  <div className="space-y-3 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isFeatured" className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Featured
                      </Label>
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                        disabled={isSubmitting}
                      />
                    </div>
                    {formData.isFeatured && (
                      <div className="grid gap-2">
                        <Label htmlFor="featuredOrder" className="text-xs">Display Order</Label>
                        <Input
                          id="featuredOrder"
                          type="number"
                          min="0"
                          value={formData.featuredOrder}
                          onChange={(e) => setFormData({
                            ...formData,
                            featuredOrder: parseInt(e.target.value) || 0
                          })}
                          placeholder="0"
                          className="h-8 text-sm"
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  </div>

                  {/* Trending */}
                  <div className="space-y-3 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isTrending" className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-orange-500" />
                        Trending
                      </Label>
                      <Switch
                        id="isTrending"
                        checked={formData.isTrending}
                        onCheckedChange={(checked) => setFormData({ ...formData, isTrending: checked })}
                        disabled={isSubmitting}
                      />
                    </div>
                    {formData.isTrending && (
                      <div className="grid gap-2">
                        <Label htmlFor="trendingOrder" className="text-xs">Display Order</Label>
                        <Input
                          id="trendingOrder"
                          type="number"
                          min="0"
                          value={formData.trendingOrder}
                          onChange={(e) => setFormData({
                            ...formData,
                            trendingOrder: parseInt(e.target.value) || 0
                          })}
                          placeholder="0"
                          className="h-8 text-sm"
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  </div>

                  {/* New Arrival */}
                  <div className="space-y-3 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isNewArrival" className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-500" />
                        New Arrival
                      </Label>
                      <Switch
                        id="isNewArrival"
                        checked={formData.isNewArrival}
                        onCheckedChange={(checked) => setFormData({ ...formData, isNewArrival: checked })}
                        disabled={isSubmitting}
                      />
                    </div>
                    {formData.isNewArrival && (
                      <div className="grid gap-2">
                        <Label htmlFor="newArrivalOrder" className="text-xs">Display Order</Label>
                        <Input
                          id="newArrivalOrder"
                          type="number"
                          min="0"
                          value={formData.newArrivalOrder}
                          onChange={(e) => setFormData({
                            ...formData,
                            newArrivalOrder: parseInt(e.target.value) || 0
                          })}
                          placeholder="0"
                          className="h-8 text-sm"
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Selection */}
              <div className="grid gap-3">
                <Label className="text-xs">Category *</Label>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="categoryLevel1" className="text-xs">Level 1 *</Label>
                    <Select
                      value={formData.categoryLevel1}
                      onValueChange={(value) => setFormData({
                        ...formData,
                        categoryLevel1: value,
                        categoryLevel2: "",
                        categoryLevel3: ""
                      })}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select category level 1" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryLevel1Options.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="categoryLevel2" className="text-xs">Level 2</Label>
                    <Input
                      id="categoryLevel2"
                      value={formData.categoryLevel2}
                      onChange={(e) => setFormData({ ...formData, categoryLevel2: e.target.value })}
                      placeholder="Subcategory"
                      className="h-9 text-sm"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="categoryLevel3" className="text-xs">Level 3</Label>
                    <Input
                      id="categoryLevel3"
                      value={formData.categoryLevel3}
                      onChange={(e) => setFormData({ ...formData, categoryLevel3: e.target.value })}
                      placeholder="Sub-subcategory"
                      className="h-9 text-sm"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  disabled={isSubmitting}
                />
                <Label htmlFor="isActive" className="text-sm">Active Product</Label>
              </div>
            </div>
            <DialogFooter className="gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="h-9 text-sm px-4"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-9 text-sm px-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {editingProduct ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingProduct ? "Update Product" : "Add Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  );
}