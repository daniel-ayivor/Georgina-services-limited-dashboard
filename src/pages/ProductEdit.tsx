import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, X, Package, DollarSign, Star, TrendingUp, Sparkles, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService from "@/contexts/adminApiService";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  categoryLevel1: string;
  categoryLevel2: string;
  categoryLevel3: string;
  unit: string;
  stock: string;
  brand: string;
  tags: string;
  isActive: boolean;
  size: string;
  sku: string;
  weight: string;
  dimensions: string;
  discountPrice: string;
  discountPercentage: string;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  featuredOrder: number;
  trendingOrder: number;
  newArrivalOrder: number;
  images: string[];
}

export default function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<(File | string)[]>([]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    categoryLevel1: "",
    categoryLevel2: "",
    categoryLevel3: "",
    unit: "",
    stock: "",
    brand: "",
    tags: "",
    isActive: true,
    size: "",
    sku: "",
    weight: "",
    dimensions: "",
    discountPrice: "",
    discountPercentage: "",
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    featuredOrder: 0,
    trendingOrder: 0,
    newArrivalOrder: 0,
    images: [],
  });

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

      const product = productsData.find((p: any) => String(p.id) === id);
      
      if (!product) {
        toast({
          variant: "destructive",
          title: "Product not found",
          description: "The requested product could not be found.",
        });
        navigate("/admin/products");
        return;
      }

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: String(product.price || ""),
        categoryLevel1: product.categoryLevel1 || "",
        categoryLevel2: product.categoryLevel2 || "",
        categoryLevel3: product.categoryLevel3 || "",
        unit: product.unit || "",
        stock: String(product.stock || ""),
        brand: product.brand || "",
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
        isActive: product.isActive ?? true,
        size: Array.isArray(product.size) ? product.size.join(", ") : (product.size || ""),
        sku: product.sku || "",
        weight: String(product.weight || ""),
        dimensions: product.dimensions || "",
        discountPrice: String(product.discountPrice || ""),
        discountPercentage: String(product.discountPercentage || ""),
        isFeatured: product.isFeatured || false,
        isTrending: product.isTrending || false,
        isNewArrival: product.isNewArrival || false,
        featuredOrder: product.featuredOrder || 0,
        trendingOrder: product.trendingOrder || 0,
        newArrivalOrder: product.newArrivalOrder || 0,
        images: product.images || [],
      });

      setImageFiles(product.images || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.categoryLevel1) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Price, Category).",
      });
      return;
    }

    try {
      setIsSaving(true);

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("categoryLevel1", formData.categoryLevel1);
      formDataToSend.append("categoryLevel2", formData.categoryLevel2);
      formDataToSend.append("categoryLevel3", formData.categoryLevel3);
      formDataToSend.append("unit", formData.unit);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("isActive", String(formData.isActive));

      if (formData.tags) {
        const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(t => t);
        formDataToSend.append("tags", JSON.stringify(tagsArray));
      }

      if (formData.size) {
        const sizesArray = formData.size.split(",").map(s => s.trim()).filter(s => s);
        formDataToSend.append("size", JSON.stringify(sizesArray));
      }

      if (formData.sku) formDataToSend.append("sku", formData.sku);
      if (formData.weight) formDataToSend.append("weight", formData.weight);
      if (formData.dimensions) formDataToSend.append("dimensions", formData.dimensions);
      if (formData.discountPrice) formDataToSend.append("discountPrice", formData.discountPrice);
      if (formData.discountPercentage) formDataToSend.append("discountPercentage", formData.discountPercentage);

      formDataToSend.append("isFeatured", String(formData.isFeatured));
      formDataToSend.append("isTrending", String(formData.isTrending));
      formDataToSend.append("isNewArrival", String(formData.isNewArrival));
      formDataToSend.append("featuredOrder", String(formData.featuredOrder));
      formDataToSend.append("trendingOrder", String(formData.trendingOrder));
      formDataToSend.append("newArrivalOrder", String(formData.newArrivalOrder));

      imageFiles.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("images", file);
        } else if (typeof file === "string") {
          formDataToSend.append("existingImages", file);
        }
      });

      await adminApiService.updateProduct(id!, formDataToSend);

      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });

      navigate(`/admin/products/${id}`);
    } catch (err: any) {
      console.error('Failed to update product:', err);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err.message || "Could not update the product.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('blob:')) return imagePath;
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
        
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              onClick={() => navigate(`/admin/products/${id}`)}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                Edit Product
              </h1>
              <p className="text-sm text-muted-foreground">
                Update product information and settings
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/admin/products/${id}`)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter product description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                      placeholder="Enter brand name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      placeholder="Enter SKU"
                    />
                  </div>

                  <div>
                    <Label htmlFor="categoryLevel1">Main Category *</Label>
                    <Input
                      id="categoryLevel1"
                      value={formData.categoryLevel1}
                      onChange={(e) => handleInputChange("categoryLevel1", e.target.value)}
                      placeholder="Enter main category"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="categoryLevel2">Subcategory</Label>
                    <Input
                      id="categoryLevel2"
                      value={formData.categoryLevel2}
                      onChange={(e) => handleInputChange("categoryLevel2", e.target.value)}
                      placeholder="Enter subcategory"
                    />
                  </div>

                  <div>
                    <Label htmlFor="categoryLevel3">Sub-subcategory</Label>
                    <Input
                      id="categoryLevel3"
                      value={formData.categoryLevel3}
                      onChange={(e) => handleInputChange("categoryLevel3", e.target.value)}
                      placeholder="Enter sub-subcategory"
                    />
                  </div>

                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => handleInputChange("unit", e.target.value)}
                      placeholder="e.g., piece, kg, liter"
                    />
                  </div>

                  <div>
                    <Label htmlFor="size">Size (comma-separated)</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => handleInputChange("size", e.target.value)}
                      placeholder="e.g., S, M, L, XL"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                      placeholder="e.g., tag1, tag2, tag3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      placeholder="Enter weight"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => handleInputChange("dimensions", e.target.value)}
                      placeholder="e.g., 10x20x30 cm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div>
                    <Label htmlFor="isActive" className="text-base font-semibold">
                      Product Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Make this product {formData.isActive ? "visible" : "hidden"} to customers
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Stock */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing & Stock
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Regular Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange("stock", e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="discountPrice">Discount Price</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      step="0.01"
                      value={formData.discountPrice}
                      onChange={(e) => handleInputChange("discountPrice", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="discountPercentage">Discount Percentage</Label>
                    <Input
                      id="discountPercentage"
                      type="number"
                      step="0.01"
                      value={formData.discountPercentage}
                      onChange={(e) => handleInputChange("discountPercentage", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Product Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="images">Upload Images (Max 5)</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length + imageFiles.length > 5) {
                        toast({
                          variant: "destructive",
                          title: "Too many images",
                          description: "You can upload a maximum of 5 images.",
                        });
                        return;
                      }
                      setImageFiles(prev => [...prev, ...files]);
                    }}
                    className="cursor-pointer"
                  />
                </div>

                {/* Image Previews */}
                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {imageFiles.map((file, index) => {
                      const imageUrl = file instanceof File ? URL.createObjectURL(file) : getImageUrl(file);
                      return (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-200">
                          <img
                            src={imageUrl}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => {
                              setImageFiles(prev => prev.filter((_, i) => i !== index));
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Special Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Special Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Featured */}
                <div className="p-4 border-2 border-amber-200 dark:border-amber-900 rounded-lg bg-amber-50/50 dark:bg-amber-950/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-600" />
                      <Label htmlFor="isFeatured" className="text-base font-semibold">
                        Featured Product
                      </Label>
                    </div>
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
                    />
                  </div>
                  {formData.isFeatured && (
                    <div>
                      <Label htmlFor="featuredOrder">Display Order</Label>
                      <Input
                        id="featuredOrder"
                        type="number"
                        value={formData.featuredOrder}
                        onChange={(e) => handleInputChange("featuredOrder", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>

                {/* Trending */}
                <div className="p-4 border-2 border-pink-200 dark:border-pink-900 rounded-lg bg-pink-50/50 dark:bg-pink-950/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-pink-600" />
                      <Label htmlFor="isTrending" className="text-base font-semibold">
                        Trending Product
                      </Label>
                    </div>
                    <Switch
                      id="isTrending"
                      checked={formData.isTrending}
                      onCheckedChange={(checked) => handleInputChange("isTrending", checked)}
                    />
                  </div>
                  {formData.isTrending && (
                    <div>
                      <Label htmlFor="trendingOrder">Display Order</Label>
                      <Input
                        id="trendingOrder"
                        type="number"
                        value={formData.trendingOrder}
                        onChange={(e) => handleInputChange("trendingOrder", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>

                {/* New Arrival */}
                <div className="p-4 border-2 border-purple-200 dark:border-purple-900 rounded-lg bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <Label htmlFor="isNewArrival" className="text-base font-semibold">
                        New Arrival
                      </Label>
                    </div>
                    <Switch
                      id="isNewArrival"
                      checked={formData.isNewArrival}
                      onCheckedChange={(checked) => handleInputChange("isNewArrival", checked)}
                    />
                  </div>
                  {formData.isNewArrival && (
                    <div>
                      <Label htmlFor="newArrivalOrder">Display Order</Label>
                      <Input
                        id="newArrivalOrder"
                        type="number"
                        value={formData.newArrivalOrder}
                        onChange={(e) => handleInputChange("newArrivalOrder", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      );
    }
