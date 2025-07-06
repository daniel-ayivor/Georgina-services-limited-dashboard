
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/types";
import { mockProducts } from "@/data/mock-data";
import { Edit, Package, Plus, Search, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ImageUpload } from "@/components/ImageUpload";
import { supabase } from "@/integrations/supabase/client";

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    inventory: "",
    category: "Electronics",
    imageUrl: null as string | null
  });

  // Load products from Supabase on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading products:', error);
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: "Using mock data instead."
        });
        return;
      }

      // Transform Supabase data to match our Product interface
      const transformedProducts: Product[] = data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || "",
        price: parseFloat(product.price.toString()),
        inventory: product.stock,
        category: "Electronics", // Default for now
        image: product.images?.[0] || "/placeholder.svg",
        createdAt: product.created_at || new Date().toISOString(),
        updatedAt: product.updated_at || new Date().toISOString()
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };
  
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value
    });
  };

  const handleImageChange = (imageUrl: string | null) => {
    setFormData({
      ...formData,
      imageUrl
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      inventory: "",
      category: "Electronics",
      imageUrl: null
    });
  };

  const checkAuthentication = () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to manage products."
      });
      return false;
    }
    return true;
  };
  
  const handleAddProduct = async () => {
    if (!checkAuthentication()) return;

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            stock: parseInt(formData.inventory),
            images: formData.imageUrl ? [formData.imageUrl] : [],
            slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            created_by: user?.id
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local state
      const newProduct: Product = {
        id: data.id,
        name: data.name,
        description: data.description || "",
        price: parseFloat(data.price.toString()),
        inventory: data.stock,
        category: formData.category,
        image: data.images?.[0] || "/placeholder.svg",
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setProducts([newProduct, ...products]);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Product added",
        description: `${newProduct.name} has been added successfully.`
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Error adding product",
        description: "Failed to add product. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditClick = (product: Product) => {
    if (!checkAuthentication()) return;

    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      inventory: product.inventory.toString(),
      category: product.category,
      imageUrl: product.image !== "/placeholder.svg" ? product.image : null
    });
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateProduct = async () => {
    if (!currentProduct || !checkAuthentication()) return;

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.inventory),
          images: formData.imageUrl ? [formData.imageUrl] : [],
          slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          updated_at: new Date().toISOString()
        })
        .eq('id', currentProduct.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      const updatedProducts = products.map(product => {
        if (product.id === currentProduct.id) {
          return {
            ...product,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            inventory: parseInt(formData.inventory),
            image: formData.imageUrl || "/placeholder.svg",
            updatedAt: data.updated_at
          };
        }
        return product;
      });
    
      setProducts(updatedProducts);
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Product updated",
        description: `${formData.name} has been updated successfully.`
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Error updating product",
        description: "Failed to update product. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteClick = (product: Product) => {
    if (!checkAuthentication()) return;

    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteProduct = async () => {
    if (!currentProduct || !checkAuthentication()) return;

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', currentProduct.id);

      if (error) {
        throw error;
      }

      const filteredProducts = products.filter(product => product.id !== currentProduct.id);
      setProducts(filteredProducts);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Product deleted",
        description: `${currentProduct.name} has been deleted successfully.`
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Error deleting product",
        description: "Failed to delete product. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!isAuthenticated}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter the details for the new product
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid justify-center items-center">
                          <ImageUpload
                currentImageUrl={formData.imageUrl}
                onImageChange={handleImageChange}
                disabled={isLoading}
              />
              </div>
              <div className="grid gap-2 ">
       
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
           
             
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="inventory">Inventory</Label>
                  <Input 
                    id="inventory" 
                    name="inventory" 
                    type="number" 
                    min="0" 
                    value={formData.inventory} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Food stuffs</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
                 <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!isAuthenticated && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please log in to manage products. You can view products, but adding, editing, and deleting requires authentication.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Product Inventory</CardTitle>
              <CardDescription>{filteredProducts.length} products found</CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Inventory</TableHead>
                {isAuthenticated && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                          {product.image && product.image !== "/placeholder.svg" ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{product.inventory}</TableCell>
                    {isAuthenticated && (
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditClick(product)}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-destructive" 
                            onClick={() => handleDeleteClick(product)}
                            disabled={isLoading}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAuthenticated ? 5 : 4} className="text-center py-10">
                    <div className="flex flex-col items-center">
                      <Package className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search terms or add a new product
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid justify-center items-center">
      <ImageUpload
              currentImageUrl={formData.imageUrl}
              onImageChange={handleImageChange}
              disabled={isLoading}
            />

            </div>
          
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
              />
            </div>
      
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input 
                  id="edit-price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-inventory">Inventory</Label>
                <Input 
                  id="edit-inventory" 
                  name="inventory" 
                  type="number" 
                  min="0" 
                  value={formData.inventory} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Home Goods">Home Goods</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
                  <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
