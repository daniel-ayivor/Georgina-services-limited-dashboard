// ProductDetails.tsx (new file)
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Calendar, DollarSign, Box, Tag, Building, Clock, Edit, Trash2 } from "lucide-react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import adminApiService from "@/contexts/adminApiService";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  console.log(id)
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);
        
        const productData = await adminApiService.getProductById(id);
        setProduct(productData);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details.');
        toast({
          variant: "destructive",
          title: "Error loading product",
          description: "Could not fetch product details.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  const handleEdit = () => {
    if (product) {
      navigate(`/admin/products/edit/${product.id}`);
    }
  };

  

  const handleDelete = async () => {
    if (!product || !confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await adminApiService.deleteProduct(product.id);
      toast({
        title: "Product deleted",
        description: "The product has been removed successfully"
      });
      navigate('/admin/products');
    } catch (err) {
      console.error('Failed to delete product:', err);
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: "Could not delete the product. Please try again.",
      });
    }
  };

  const handleToggleStatus = async () => {
    if (!product) return;

    try {
      const updatedProduct = await adminApiService.updateProduct(product.id, {
        isActive: !product.isActive
      });
      setProduct(updatedProduct);
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div className="h-8 bg-muted rounded animate-pulse w-48" />
        </div>
        <div className="grid gap-6">
          <div className="h-64 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Product not found</p>
            <p className="text-muted-foreground text-center mb-4">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Button onClick={() => navigate('/admin/products')}>
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayTags = getDisplayTags(product.tags);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground">Product Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleToggleStatus}
          >
            {product.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image and Basic Info */}
        <div className="space-y-6">
          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.name}
                  className="h-80 w-80 object-cover rounded-lg border shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-muted-foreground">
                  {product.description || "No description available"}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Price
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    ${parseFloat(product.price?.toString() || '0').toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Box className="h-4 w-4" />
                    Stock
                  </div>
                  <Badge variant={product.stock < 10 ? "destructive" : "default"} className="text-lg">
                    {product.stock} units
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge variant={product.isActive ? "default" : "destructive"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Type</div>
                  <Badge variant={product.serviceType === 'service' ? "default" : "secondary"}>
                    {product.serviceType}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="space-y-6">
          {/* Category Information */}
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Main Category</div>
                  <Badge variant="outline" className="text-base">
                    {product.categoryLevel1}
                  </Badge>
                </div>
                
                {product.categoryLevel2 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Subcategory</div>
                    <p className="text-lg">{product.categoryLevel2}</p>
                  </div>
                )}
                
                {product.categoryLevel3 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Sub-subcategory</div>
                    <p className="text-lg">{product.categoryLevel3}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.brand && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Building className="h-4 w-4" />
                    Brand
                  </div>
                  <Badge variant="secondary" className="text-base">
                    {product.brand}
                  </Badge>
                </div>
              )}

              <div>
                <div className="text-sm text-muted-foreground mb-1">Unit</div>
                <p className="text-lg capitalize">{product.unit || 'piece'}</p>
              </div>

              {product.serviceDuration && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    Service Duration
                  </div>
                  <p className="text-lg">{product.serviceDuration}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {displayTags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {displayTags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <p className="text-lg">{formatDate(product.createdAt)}</p>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <p className="text-lg">{formatDate(product.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}