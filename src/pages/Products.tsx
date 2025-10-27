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
import { Search, Plus, Edit, Trash2, Package, DollarSign, TrendingUp, AlertTriangle, RefreshCw, AlertCircle } from "lucide-react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ImageUpload";
import adminApiService from "@/contexts/adminApiService";
import { ImageUploadWithFile } from "@/lib/ImageLoader";

// Update the interface
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  categoryLevel1: string;
  categoryLevel2: string;
  categoryLevel3: string;
  serviceType: string;
  serviceDuration: string;
  unit: string;
  stock: string;
  brand: string;
  tags: string;
  isActive: boolean;
  image: File | string | null; // Can be File, string URL, or null
}

interface Category {
  id: string;
  name: string;
  slug?: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    tags: "",
    isActive: true,
    image: "",
  });
  const { toast } = useToast();

  // Predefined categories based on your model
  const categoryLevel1Options = ['Clothes', 'Foodstuffs', 'Services'];
  const serviceTypeOptions = ['physical', 'service'];
  const unitOptions = ['piece', 'kg', 'hour', 'day', 'month', 'set'];

  // Helper function to convert file path to URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) {
      console.log('No image path provided');
      return "/placeholder.svg";
    }
    
    console.log('Original image path:', imagePath);
    
    // If it's already a URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      console.log('Already a URL:', imagePath);
      return imagePath;
    }
    
    // Extract filename from Windows/Unix file path
    const filename = imagePath.split(/[\\/]/).pop();
    console.log('Extracted filename:', filename);
    
    // Construct the full URL to your backend (port 8003)
    // Use import.meta.env for Vite projects, not process.env
    const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8003';
    const imageUrl = `${BACKEND_URL}/uploads/products/${filename}`;
    
    console.log('Final image URL:', imageUrl);
    return imageUrl;
  };

  // Fetch products and categories from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch products using admin endpoint
      const productsResponse = await adminApiService.getProducts();
      console.log('API Response:', productsResponse); // Debug log
      
      // Handle different response structures
      const productsList = productsResponse.products || productsResponse.data?.products || productsResponse || [];
      console.log('Products List:', productsList); // Debug log
      
      setProducts(Array.isArray(productsList) ? productsList : []);

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
      // Always use FormData for file uploads
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
      formDataObj.append('tags', formData.tags);
      formDataObj.append('isActive', formData.isActive.toString());

      // Handle image upload - only append if it's a File object
      if (formData.image instanceof File) {
        formDataObj.append('image', formData.image);
      } else if (!formData.image && !editingProduct) {
        // Only require image for new products, not for edits
        toast({
          variant: "destructive",
          title: "Image required",
          description: "Please select an image for the product"
        });
        setIsSubmitting(false);
        return;
      }
      // For editing existing products without new image, don't append image field

      let result;
      if (editingProduct) {
        result = await adminApiService.updateProduct(editingProduct.id, formDataObj);
        setProducts(products.map((p) => p.id === editingProduct.id ? result : p));
        toast({
          title: "Product updated",
          description: "Product has been updated successfully"
        });
      } else {
        result = await adminApiService.createProduct(formDataObj);
        setProducts([...products, result]);
        toast({
          title: "Product added",
          description: "Product has been added successfully"
        });
      }
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

  // Update the handleAddProduct function
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
      tags: "",
      isActive: true,
      image: null // Start with null
    });
    setDialogOpen(true);
  };

  // Update the handleEditProduct function
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      categoryLevel1: product.categoryLevel1 || "",
      categoryLevel2: product.categoryLevel2 || "",
      categoryLevel3: product.categoryLevel3 || "",
      serviceType: product.serviceType || "physical",
      serviceDuration: product.serviceDuration || "",
      unit: product.unit || "piece",
      stock: product.stock?.toString() || "0",
      brand: product.brand || "",
      tags: product.tags ? JSON.stringify(product.tags) : "",
      isActive: product.isActive !== undefined ? product.isActive : true,
      image: getImageUrl(product.images?.[0]) || "", // Convert path to URL
    });
    setDialogOpen(true);
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

  const handleToggleStatus = async (product: Product) => {
    try {
      const updatedProduct = await adminApiService.updateProduct(product.id, {
        isActive: !product.isActive
      });
      setProducts(products.map((p) => p.id === product.id ? updatedProduct : p));
      toast({
        title: `Product ${!product.isActive ? 'activated' : 'deactivated'}`,
        description: `Product has been ${!product.isActive ? 'activated' : 'deactivated'} successfully`
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


  const LoadingRow = () => (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-8">
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
        <div className="flex justify-end gap-2">
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
      {/* Debug Info - Remove this after fixing */}
      {/* {!isLoading && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm font-mono">
              <strong>Debug Info:</strong><br/>
              Total Products Loaded: {products.length}<br/>
              Filtered Products: {filteredProducts.length}<br/>
              Search Term: "{searchTerm}"<br/>
              {products.length > 0 && (
                <>Sample Product: {JSON.stringify(products[0], null, 2)}</>
              )}
            </p>
          </CardContent>
        </Card>
      )} */}
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddProduct} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">${avgPrice.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Average product price</p>
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
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={getImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="h-12 w-12 rounded object-cover border"
                            onError={(e) => {
                              console.error('Image failed to load:', product.images?.[0]);
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', product.images?.[0]);
                            }}
                          />
                          {/* Debug overlay - remove after fixing */}
                          <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[8px] px-1 rounded">
                            img
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
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
                        {product.categoryLevel3 && (
                          <div className="text-xs text-muted-foreground">{product.categoryLevel3}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${parseFloat(product.price.toString()).toFixed(2)}</TableCell>
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                  <TableCell colSpan={7} className="text-center py-10">
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                  // Store the File object in formData
                  setFormData({ ...formData, image: file });
                }}
                currentImage={
                  // Only pass string URLs for currentImage, not File objects
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
                    onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
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
                  <Label htmlFor="tags" className="text-xs">Tags (JSON)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder='["tag1", "tag2"]'
                    className="h-9 text-sm"
                    disabled={isSubmitting}
                  />
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
    </div>
  );
}