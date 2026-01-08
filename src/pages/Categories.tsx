// // // import React, { useState, useEffect } from 'react';
// // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Input } from "@/components/ui/input";
// // // import { Button } from "@/components/ui/button";
// // // import { Badge } from "@/components/ui/badge";
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogDescription,
// // //   DialogFooter,
// // //   DialogHeader,
// // //   DialogTitle,
// // // } from "@/components/ui/dialog";
// // // import { Label } from "@/components/ui/label";
// // // import { Textarea } from "@/components/ui/textarea";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select";
// // // import { Search, Plus, Edit, Trash2, Folder, FolderTree, Tag, ChevronDown, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
// // // import { useToast } from "@/hooks/use-toast";

// // // import { ImageUpload } from "@/components/ImageUpload";
// // // import adminApiService from '@/contexts/adminApiService';

// // // // Unified Category interface that handles both categories and subcategories
// // // interface Category {
// // //   id: string;
// // //   name: string;
// // //   description?: string;
// // //   slug?: string;
// // //   image?: string;
// // //   parentId?: string | null; // null for top-level categories
// // //   level?: number;
// // //   children?: Category[];
// // //   createdAt: string;
// // //   updatedAt: string;
// // // }

// // // interface CategoryFormData {
// // //   name: string;
// // //   description: string;
// // //   slug: string;
// // //   image: string;
// // //   parentId?: string; // For subcategories
// // // }

// // // const Categories = () => {
// // //   const [categories, setCategories] = useState<Category[]>([]);
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
// // //   const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
// // //   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
// // //   const [editingSubcategory, setEditingSubcategory] = useState<Category | null>(null);
// // //   const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const { toast } = useToast();

// // //   const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
// // //     name: "",
// // //     description: "",
// // //     slug: "",
// // //     image: ""
// // //   });

// // //   const [subcategoryForm, setSubcategoryForm] = useState<CategoryFormData>({
// // //     name: "",
// // //     description: "",
// // //     slug: "",
// // //     image: "",
// // //     parentId: ""
// // //   });

// // // // Updated fetchData function in Categories.tsx
// // // const fetchData = async () => {
// // //   try {
// // //     setIsLoading(true);
// // //     setError(null);
    
// // //     console.log('🔄 Fetching categories from API...');
// // //     const response = await adminApiService.getCategories();
// // //     console.log('✅ Categories response:', response);
    
// // //     // Handle different response formats
// // //     let categoriesData = [];
    
// // //     if (Array.isArray(response)) {
// // //       // If response is directly an array
// // //       categoriesData = response;
// // //     } else if (response && response.categories) {
// // //       // If response has categories property
// // //       categoriesData = response.categories;
// // //     } else if (response && response.data) {
// // //       // If response has data property
// // //       categoriesData = response.data;
// // //     } else {
// // //       // If it's some other structure, use it directly
// // //       categoriesData = response;
// // //     }
    
// // //     console.log('📦 Processed categories data:', categoriesData);
// // //     setCategories(categoriesData);
// // //   } catch (err: any) {
// // //     console.error('❌ Failed to fetch categories:', err);
// // //     const errorMessage = err.message || 'Failed to load categories. Please try again.';
// // //     setError(errorMessage);
// // //     toast({
// // //       variant: "destructive",
// // //       title: "Error loading categories",
// // //       description: errorMessage,
// // //     });
// // //   } finally {
// // //     setIsLoading(false);
// // //   }
// // // };

// // //   useEffect(() => {
// // //     fetchData();
// // //   }, []);

// // //   // Filter categories and their subcategories
// // //   const filteredCategories = categories.filter(cat =>
// // //     cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //     cat.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //     (cat.children && cat.children.some(child => 
// // //       child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       child.slug?.toLowerCase().includes(searchTerm.toLowerCase())
// // //     ))
// // //   );

// // //   // Get top-level categories (parentId is null or undefined)
// // //   const topLevelCategories = categories.filter(cat => !cat.parentId);

// // //   // Get subcategories for a category
// // //   const getSubcategories = (categoryId: string) => {
// // //     return categories.filter(cat => cat.parentId === categoryId);
// // //   };

// // //   // Toggle category expansion
// // //   const toggleCategory = (categoryId: string) => {
// // //     const newExpanded = new Set(expandedCategories);
// // //     if (newExpanded.has(categoryId)) {
// // //       newExpanded.delete(categoryId);
// // //     } else {
// // //       newExpanded.add(categoryId);
// // //     }
// // //     setExpandedCategories(newExpanded);
// // //   };

// // //   // Calculate stats
// // //   const totalCategories = topLevelCategories.length;
// // //   const totalSubcategories = categories.filter(cat => cat.parentId).length;

// // //   const handleAddCategory = () => {
// // //     setEditingCategory(null);
// // //     setCategoryForm({ name: "", description: "", slug: "", image: "" });
// // //     setCategoryDialogOpen(true);
// // //   };

// // //   const handleEditCategory = (category: Category) => {
// // //     setEditingCategory(category);
// // //     setCategoryForm({
// // //       name: category.name,
// // //       description: category.description || "",
// // //       slug: category.slug || "",
// // //       image: category.image || ""
// // //     });
// // //     setCategoryDialogOpen(true);
// // //   };

// // //   const handleDeleteCategory = async (id: string) => {
// // //     const relatedSubs = getSubcategories(id);
// // //     if (relatedSubs.length > 0) {
// // //       toast({
// // //         variant: "destructive",
// // //         title: "Cannot delete",
// // //         description: "Please delete all subcategories first"
// // //       });
// // //       return;
// // //     }

// // //     if (!confirm('Are you sure you want to delete this category?')) {
// // //       return;
// // //     }

// // //     try {
// // //       await adminApiService.deleteCategory(id);
// // //       setCategories(categories.filter(cat => cat.id !== id));
// // //       toast({ 
// // //         title: "Category deleted", 
// // //         description: "Category has been removed successfully" 
// // //       });
// // //     } catch (err) {
// // //       console.error('Failed to delete category:', err);
// // //       toast({
// // //         variant: "destructive",
// // //         title: "Error deleting category",
// // //         description: "Could not delete the category. Please try again.",
// // //       });
// // //     }
// // //   };

// // //   const handleCategorySubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
    
// // //     if (!categoryForm.name || !categoryForm.slug) {
// // //       toast({
// // //         variant: "destructive",
// // //         title: "Missing fields",
// // //         description: "Please fill in all required fields"
// // //       });
// // //       return;
// // //     }

// // //     setIsSubmitting(true);

// // //     try {
// // //       const categoryFormData = new FormData();
// // //       categoryFormData.append('name', categoryForm.name);
// // //       categoryFormData.append('description', categoryForm.description);
// // //       categoryFormData.append('slug', categoryForm.slug);
      
// // //       if (categoryForm.image && !categoryForm.image.startsWith('http')) {
// // //         categoryFormData.append('image', categoryForm.image);
// // //       }

// // //       if (editingCategory) {
// // //         const updatedCategory = await adminApiService.updateCategory(editingCategory.id, categoryFormData);
// // //         setCategories(categories.map(cat => 
// // //           cat.id === editingCategory.id ? updatedCategory : cat
// // //         ));
// // //         toast({ 
// // //           title: "Category updated", 
// // //           description: "Category has been updated successfully" 
// // //         });
// // //       } else {
// // //         const newCategory = await adminApiService.createCategory(categoryFormData);
// // //         setCategories([...categories, newCategory]);
// // //         toast({ 
// // //           title: "Category added", 
// // //           description: "Category has been added successfully" 
// // //         });
// // //       }
// // //       setCategoryDialogOpen(false);
// // //     } catch (err) {
// // //       console.error('Failed to save category:', err);
// // //       toast({
// // //         variant: "destructive",
// // //         title: "Error saving category",
// // //         description: "Could not save the category. Please try again.",
// // //       });
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const handleAddSubcategory = () => {
// // //     setEditingSubcategory(null);
// // //     setSubcategoryForm({ name: "", parentId: "", slug: "", description: "", image: "" });
// // //     setSubcategoryDialogOpen(true);
// // //   };

// // //   const handleEditSubcategory = (subcategory: Category) => {
// // //     setEditingSubcategory(subcategory);
// // //     setSubcategoryForm({
// // //       name: subcategory.name,
// // //       parentId: subcategory.parentId || "",
// // //       slug: subcategory.slug || "",
// // //       description: subcategory.description || "",
// // //       image: subcategory.image || ""
// // //     });
// // //     setSubcategoryDialogOpen(true);
// // //   };

// // //   const handleDeleteSubcategory = async (id: string) => {
// // //     if (!confirm('Are you sure you want to delete this subcategory?')) {
// // //       return;
// // //     }

// // //     try {
// // //       await adminApiService.deleteCategory(id);
// // //       setCategories(categories.filter(cat => cat.id !== id));
// // //       toast({ 
// // //         title: "Subcategory deleted", 
// // //         description: "Subcategory has been removed successfully" 
// // //       });
// // //     } catch (err) {
// // //       console.error('Failed to delete subcategory:', err);
// // //       toast({
// // //         variant: "destructive",
// // //         title: "Error deleting subcategory",
// // //         description: "Could not delete the subcategory. Please try again.",
// // //       });
// // //     }
// // //   };

// // //   const handleSubcategorySubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault();
    
// // //     if (!subcategoryForm.name || !subcategoryForm.parentId || !subcategoryForm.slug) {
// // //       toast({
// // //         variant: "destructive",
// // //         title: "Missing fields",
// // //         description: "Please fill in all required fields"
// // //       });
// // //       return;
// // //     }

// // //     setIsSubmitting(true);

// // //     try {
// // //       const subcategoryFormData = new FormData();
// // //       subcategoryFormData.append('name', subcategoryForm.name);
// // //       subcategoryFormData.append('parentId', subcategoryForm.parentId);
// // //       subcategoryFormData.append('slug', subcategoryForm.slug);
// // //       subcategoryFormData.append('description', subcategoryForm.description);
      
// // //       if (subcategoryForm.image && !subcategoryForm.image.startsWith('http')) {
// // //         subcategoryFormData.append('image', subcategoryForm.image);
// // //       }

// // //       if (editingSubcategory) {
// // //         const updatedSubcategory = await adminApiService.updateCategory(editingSubcategory.id, subcategoryFormData);
// // //         setCategories(categories.map(cat => 
// // //           cat.id === editingSubcategory.id ? updatedSubcategory : cat
// // //         ));
// // //         toast({ 
// // //           title: "Subcategory updated", 
// // //           description: "Subcategory has been updated successfully" 
// // //         });
// // //       } else {
// // //         const newSubcategory = await adminApiService.createCategory(subcategoryFormData);
// // //         setCategories([...categories, newSubcategory]);
// // //         toast({ 
// // //           title: "Subcategory added", 
// // //           description: "Subcategory has been added successfully" 
// // //         });
// // //       }
// // //       setSubcategoryDialogOpen(false);
// // //     } catch (err) {
// // //       console.error('Failed to save subcategory:', err);
// // //       toast({
// // //         variant: "destructive",
// // //         title: "Error saving subcategory",
// // //         description: "Could not save the subcategory. Please try again.",
// // //       });
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const SkeletonRow = () => (
// // //     <tr className="border-b hover:bg-muted/50">
// // //       <td className="p-4 align-middle">
// // //         <div className="flex items-center gap-2">
// // //           <div className="h-6 w-6 bg-muted rounded animate-pulse" />
// // //           <div className="h-4 w-4 bg-muted rounded animate-pulse" />
// // //           <div className="h-4 bg-muted rounded animate-pulse w-32" />
// // //         </div>
// // //       </td>
// // //       <td className="p-4 align-middle">
// // //         <div className="h-4 bg-muted rounded animate-pulse w-20" />
// // //       </td>
// // //       <td className="p-4 align-middle">
// // //         <div className="h-4 bg-muted rounded animate-pulse w-40" />
// // //       </td>
// // //       <td className="p-4 align-middle">
// // //         <div className="h-6 bg-muted rounded animate-pulse w-12" />
// // //       </td>
// // //       <td className="p-4 align-middle">
// // //         <div className="h-4 bg-muted rounded animate-pulse w-16" />
// // //       </td>
// // //       <td className="p-4 align-middle">
// // //         <div className="flex gap-2">
// // //           <div className="h-8 w-8 bg-muted rounded animate-pulse" />
// // //           <div className="h-8 w-8 bg-muted rounded animate-pulse" />
// // //         </div>
// // //       </td>
// // //     </tr>
// // //   );

// // //   if (error && categories.length === 0) {
// // //     return (
// // //       <div className="space-y-6">
// // //         <div className="flex items-center justify-between">
// // //           <div>
// // //             <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
// // //             <p className="text-muted-foreground">Manage categories and subcategories for your products</p>
// // //           </div>
// // //           <Button onClick={fetchData} variant="outline">
// // //             <RefreshCw className="mr-2 h-4 w-4" />
// // //             Retry
// // //           </Button>
// // //         </div>
// // //         <Card>
// // //           <CardContent className="flex flex-col items-center justify-center py-12">
// // //             <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
// // //             <p className="text-lg font-medium mb-2">Failed to load categories</p>
// // //             <p className="text-muted-foreground text-center mb-4">{error}</p>
// // //             <Button onClick={fetchData}>
// // //               <RefreshCw className="mr-2 h-4 w-4" />
// // //               Try Again
// // //             </Button>
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Header */}
// // //       <div className="flex items-center justify-between">
// // //         <div>
// // //           <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
// // //           <p className="text-muted-foreground">Manage categories and subcategories for your products</p>
// // //         </div>
// // //         <div className="flex gap-2">
// // //           <Button onClick={fetchData} variant="outline" disabled={isLoading}>
// // //             <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
// // //             Refresh
// // //           </Button>
// // //           <Button onClick={handleAddCategory} disabled={isLoading}>
// // //             <Plus className="mr-2 h-4 w-4" />
// // //             Add Category
// // //           </Button>
// // //           <Button onClick={handleAddSubcategory} variant="outline" disabled={isLoading || topLevelCategories.length === 0}>
// // //             <Plus className="mr-2 h-4 w-4" />
// // //             Add Subcategory
// // //           </Button>
// // //         </div>
// // //       </div>

// // //       {/* Stats Cards */}
// // //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// // //         <Card>
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
// // //             <Folder className="h-4 w-4 text-muted-foreground" />
// // //           </CardHeader>
// // //           <CardContent>
// // //             {isLoading ? (
// // //               <>
// // //                 <div className="h-8 bg-muted rounded animate-pulse mb-2" />
// // //                 <div className="h-4 bg-muted rounded animate-pulse" />
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <div className="text-2xl font-bold">{totalCategories}</div>
// // //                 <p className="text-xs text-muted-foreground">Main categories</p>
// // //               </>
// // //             )}
// // //           </CardContent>
// // //         </Card>
// // //         <Card>
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-medium">Total Subcategories</CardTitle>
// // //             <FolderTree className="h-4 w-4 text-muted-foreground" />
// // //           </CardHeader>
// // //           <CardContent>
// // //             {isLoading ? (
// // //               <>
// // //                 <div className="h-8 bg-muted rounded animate-pulse mb-2" />
// // //                 <div className="h-4 bg-muted rounded animate-pulse" />
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <div className="text-2xl font-bold">{totalSubcategories}</div>
// // //                 <p className="text-xs text-muted-foreground">All subcategories</p>
// // //               </>
// // //             )}
// // //           </CardContent>
// // //         </Card>
// // //         <Card>
// // //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// // //             <CardTitle className="text-sm font-medium">Total Items</CardTitle>
// // //             <Tag className="h-4 w-4 text-muted-foreground" />
// // //           </CardHeader>
// // //           <CardContent>
// // //             {isLoading ? (
// // //               <>
// // //                 <div className="h-8 bg-muted rounded animate-pulse mb-2" />
// // //                 <div className="h-4 bg-muted rounded animate-pulse" />
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <div className="text-2xl font-bold">{categories.length}</div>
// // //                 <p className="text-xs text-muted-foreground">Combined total</p>
// // //               </>
// // //             )}
// // //           </CardContent>
// // //         </Card>
// // //       </div>

// // //       {/* Search */}
// // //       <div className="relative w-full md:w-96">
// // //         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
// // //         <Input
// // //           placeholder="Search categories..."
// // //           className="pl-8"
// // //           value={searchTerm}
// // //           onChange={(e) => setSearchTerm(e.target.value)}
// // //           disabled={isLoading}
// // //         />
// // //       </div>

// // //       {/* Categories Table */}
// // //       <Card>
// // //         <CardHeader>
// // //           <CardTitle>Categories & Subcategories</CardTitle>
// // //           <CardDescription>
// // //             Manage your product categories and their subcategories in a structured table format
// // //           </CardDescription>
// // //         </CardHeader>
// // //         <CardContent>
// // //           <div className="rounded-md border">
// // //             <table className="w-full text-sm">
// // //               <thead>
// // //                 <tr className="border-b bg-muted/50">
// // //                   <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
// // //                   <th className="h-12 px-4 text-left align-middle font-medium">Slug</th>
// // //                   <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
// // //                   <th className="h-12 px-4 text-left align-middle font-medium">Subcategories</th>
// // //                   <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
// // //                   <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {isLoading ? (
// // //                   // Show skeleton loading rows
// // //                   Array.from({ length: 3 }).map((_, index) => (
// // //                     <SkeletonRow key={index} />
// // //                   ))
// // //                 ) : filteredCategories.length > 0 ? (
// // //                   filteredCategories.map(category => {
// // //                     if (category.parentId) return null; // Skip subcategories in main list
                    
// // //                     const categorySubs = getSubcategories(category.id);
// // //                     const isExpanded = expandedCategories.has(category.id);
                    
// // //                     return (
// // //                       <React.Fragment key={category.id}>
// // //                         {/* Category Row */}
// // //                         <tr className="border-b hover:bg-muted/50">
// // //                           <td className="p-4 align-middle">
// // //                             <div className="flex items-center gap-2">
// // //                               <Button
// // //                                 variant="ghost"
// // //                                 size="sm"
// // //                                 className="h-6 w-6 p-0"
// // //                                 onClick={() => toggleCategory(category.id)}
// // //                                 disabled={categorySubs.length === 0 || isLoading}
// // //                               >
// // //                                 {categorySubs.length > 0 ? (
// // //                                   isExpanded ? (
// // //                                     <ChevronDown className="h-4 w-4" />
// // //                                   ) : (
// // //                                     <ChevronRight className="h-4 w-4" />
// // //                                   )
// // //                                 ) : (
// // //                                   <Folder className="h-4 w-4" />
// // //                                 )}
// // //                               </Button>
// // //                               <Folder className="h-4 w-4 text-muted-foreground" />
// // //                               <span className="font-medium">{category.name}</span>
// // //                             </div>
// // //                           </td>
// // //                           <td className="p-4 align-middle">
// // //                             <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
// // //                               {category.slug || 'N/A'}
// // //                             </code>
// // //                           </td>
// // //                           <td className="p-4 align-middle">
// // //                             {category.description || 'No description'}
// // //                           </td>
// // //                           <td className="p-4 align-middle">
// // //                             <Badge variant="secondary">{categorySubs.length}</Badge>
// // //                           </td>
// // //                           <td className="p-4 align-middle text-muted-foreground">
// // //                             {new Date(category.createdAt).toLocaleDateString()}
// // //                           </td>
// // //                           <td className="p-4 align-middle">
// // //                             <div className="flex gap-2">
// // //                               <Button
// // //                                 variant="outline"
// // //                                 size="sm"
// // //                                 onClick={() => handleEditCategory(category)}
// // //                                 disabled={isLoading}
// // //                               >
// // //                                 <Edit className="h-3 w-3" />
// // //                               </Button>
// // //                               <Button
// // //                                 variant="outline"
// // //                                 size="sm"
// // //                                 onClick={() => handleDeleteCategory(category.id)}
// // //                                 disabled={isLoading}
// // //                               >
// // //                                 <Trash2 className="h-3 w-3" />
// // //                               </Button>
// // //                             </div>
// // //                           </td>
// // //                         </tr>

// // //                         {/* Subcategory Rows */}
// // //                         {isExpanded && categorySubs.map(subcategory => (
// // //                           <tr key={subcategory.id} className="border-b hover:bg-muted/30 bg-muted/20">
// // //                             <td className="p-4 align-middle pl-12">
// // //                               <div className="flex items-center gap-2">
// // //                                 <FolderTree className="h-4 w-4 text-muted-foreground" />
// // //                                 <span>{subcategory.name}</span>
// // //                               </div>
// // //                             </td>
// // //                             <td className="p-4 align-middle">
// // //                               <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
// // //                                 {subcategory.slug || 'N/A'}
// // //                               </code>
// // //                             </td>
// // //                             <td className="p-4 align-middle text-muted-foreground">
// // //                               <span className="text-xs">{subcategory.description || 'No description'}</span>
// // //                             </td>
// // //                             <td className="p-4 align-middle">
// // //                               <Badge variant="outline">Subcategory</Badge>
// // //                             </td>
// // //                             <td className="p-4 align-middle text-muted-foreground">
// // //                               {new Date(subcategory.createdAt).toLocaleDateString()}
// // //                             </td>
// // //                             <td className="p-4 align-middle">
// // //                               <div className="flex gap-2">
// // //                                 <Button
// // //                                   variant="outline"
// // //                                   size="sm"
// // //                                   onClick={() => handleEditSubcategory(subcategory)}
// // //                                   disabled={isLoading}
// // //                                 >
// // //                                   <Edit className="h-3 w-3" />
// // //                                 </Button>
// // //                                 <Button
// // //                                   variant="outline"
// // //                                   size="sm"
// // //                                   onClick={() => handleDeleteSubcategory(subcategory.id)}
// // //                                   disabled={isLoading}
// // //                                 >
// // //                                   <Trash2 className="h-3 w-3" />
// // //                                 </Button>
// // //                               </div>
// // //                             </td>
// // //                           </tr>
// // //                         ))}
// // //                       </React.Fragment>
// // //                     );
// // //                   })
// // //                 ) : (
// // //                   <tr>
// // //                     <td colSpan={6} className="p-8 text-center text-muted-foreground">
// // //                       <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
// // //                       <p>No categories found</p>
// // //                       <p className="text-sm">
// // //                         {searchTerm ? "Try adjusting your search" : "Get started by adding your first category"}
// // //                       </p>
// // //                     </td>
// // //                   </tr>
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         </CardContent>
// // //       </Card>

// // //       {/* Add/Edit Category Dialog */}
// // //       <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
// // //         <DialogContent className="sm:max-w-[500px]">
// // //           <DialogHeader>
// // //             <DialogTitle>
// // //               {editingCategory ? "Edit Category" : "Add New Category"}
// // //             </DialogTitle>
// // //             <DialogDescription>
// // //               {editingCategory ? "Update category details" : "Add a new product category"}
// // //             </DialogDescription>
// // //           </DialogHeader>
// // //           <form onSubmit={handleCategorySubmit}>
// // //             <div className="grid gap-4 py-4">
// // //               <ImageUpload
// // //                 currentImageUrl={categoryForm.image}
// // //                 onImageChange={(url) => setCategoryForm({ ...categoryForm, image: url || "" })}
// // //                 className="h-20"
// // //               />
// // //               <div className="grid gap-2">
// // //                 <Label htmlFor="cat-name">Category Name *</Label>
// // //                 <Input
// // //                   id="cat-name"
// // //                   placeholder="e.g., Men Clothes"
// // //                   value={categoryForm.name}
// // //                   onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
// // //                   disabled={isSubmitting}
// // //                 />
// // //               </div>
// // //               <div className="grid gap-2">
// // //                 <Label htmlFor="cat-slug">Slug *</Label>
// // //                 <Input
// // //                   id="cat-slug"
// // //                   placeholder="e.g., men-clothes"
// // //                   value={categoryForm.slug}
// // //                   onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
// // //                   disabled={isSubmitting}
// // //                 />
// // //               </div>
// // //               <div className="grid gap-2">
// // //                 <Label htmlFor="cat-description">Description</Label>
// // //                 <Textarea
// // //                   id="cat-description"
// // //                   placeholder="Category description"
// // //                   value={categoryForm.description}
// // //                   onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
// // //                   disabled={isSubmitting}
// // //                 />
// // //               </div>
// // //             </div>
// // //             <DialogFooter>
// // //               <Button 
// // //                 type="button" 
// // //                 variant="outline" 
// // //                 onClick={() => setCategoryDialogOpen(false)}
// // //                 disabled={isSubmitting}
// // //               >
// // //                 Cancel
// // //               </Button>
// // //               <Button type="submit" disabled={isSubmitting}>
// // //                 {isSubmitting ? (
// // //                   <>
// // //                     <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
// // //                     {editingCategory ? "Updating..." : "Adding..."}
// // //                   </>
// // //                 ) : (
// // //                   editingCategory ? "Update Category" : "Add Category"
// // //                 )}
// // //               </Button>
// // //             </DialogFooter>
// // //           </form>
// // //         </DialogContent>
// // //       </Dialog>

// // //       {/* Add/Edit Subcategory Dialog */}
// // //       <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
// // //         <DialogContent className="sm:max-w-[500px]">
// // //           <DialogHeader>
// // //             <DialogTitle>
// // //               {editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}
// // //             </DialogTitle>
// // //             <DialogDescription>
// // //               {editingSubcategory ? "Update subcategory details" : "Add a new subcategory under a parent category"}
// // //             </DialogDescription>
// // //           </DialogHeader>
// // //           <form onSubmit={handleSubcategorySubmit}>
// // //             <div className="grid gap-4 py-4">
// // //               <div className="grid gap-2">
// // //                 <Label htmlFor="parent">Parent Category *</Label>
// // //                 <Select
// // //                   value={subcategoryForm.parentId}
// // //                   onValueChange={(value) => setSubcategoryForm({ ...subcategoryForm, parentId: value })}
// // //                   disabled={isSubmitting || topLevelCategories.length === 0}
// // //                 >
// // //                   <SelectTrigger id="parent">
// // //                     <SelectValue placeholder={topLevelCategories.length === 0 ? "No categories available" : "Select parent category"} />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     {topLevelCategories.map(cat => (
// // //                       <SelectItem key={cat.id} value={cat.id}>
// // //                         {cat.name}
// // //                       </SelectItem>
// // //                     ))}
// // //                   </SelectContent>
// // //                 </Select>
// // //                 {topLevelCategories.length === 0 && (
// // //                   <p className="text-xs text-muted-foreground">
// // //                     Please create a category first before adding subcategories
// // //                   </p>
// // //                 )}
// // //               </div>
// // //               <ImageUpload
// // //                 currentImageUrl={subcategoryForm.image}
// // //                 onImageChange={(url) => setSubcategoryForm({ ...subcategoryForm, image: url || "" })}
// // //                 className="h-20"
// // //               />
// // //               <div className="grid gap-2">
// // //                 <Label htmlFor="sub-name">Subcategory Name *</Label>
// // //                 <Input
// // //                   id="sub-name"
// // //                   placeholder="e.g., Suits"
// // //                   value={subcategoryForm.name}
// // //                   onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
// // //                   disabled={isSubmitting}
// // //                 />
// // //               </div>
// // //               <div className="grid gap-2">
// // //                 <Label htmlFor="sub-slug">Slug *</Label>
// // //                 <Input
// // //                   id="sub-slug"
// // //                   placeholder="e.g., suits"
// // //                   value={subcategoryForm.slug}
// // //                   onChange={(e) => setSubcategoryForm({ ...subcategoryForm, slug: e.target.value })}
// // //                   disabled={isSubmitting}
// // //                 />
// // //               </div>
// // //               <div className="grid gap-2">
// // //                 <Label htmlFor="sub-description">Description</Label>
// // //                 <Textarea
// // //                   id="sub-description"
// // //                   placeholder="Subcategory description"
// // //                   value={subcategoryForm.description}
// // //                   onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
// // //                   disabled={isSubmitting}
// // //                 />
// // //               </div>
// // //             </div>
// // //             <DialogFooter>
// // //               <Button 
// // //                 type="button" 
// // //                 variant="outline" 
// // //                 onClick={() => setSubcategoryDialogOpen(false)}
// // //                 disabled={isSubmitting}
// // //               >
// // //                 Cancel
// // //               </Button>
// // //               <Button type="submit" disabled={isSubmitting || topLevelCategories.length === 0}>
// // //                 {isSubmitting ? (
// // //                   <>
// // //                     <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
// // //                     {editingSubcategory ? "Updating..." : "Adding..."}
// // //                   </>
// // //                 ) : (
// // //                   editingSubcategory ? "Update Subcategory" : "Add Subcategory"
// // //                 )}
// // //               </Button>
// // //             </DialogFooter>
// // //           </form>
// // //         </DialogContent>
// // //       </Dialog>
// // //     </div>
// // //   );
// // // };

// // // export default Categories;

// // import React, { useState, useEffect } from 'react';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Search, Plus, Edit, Trash2, Folder, FolderTree, Tag, ChevronDown, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";

// // import adminApiService from '@/contexts/adminApiService';

// // // Unified Category interface that handles all levels
// // interface Category {
// //   id: string;
// //   name: string;
// //   description?: string;
// //   slug: string;
// //   parentId?: string | null;
// //   level: number;
// //   sortOrder?: number;
// //   isActive?: boolean;
// //   children?: Category[];
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // interface CategoryFormData {
// //   name: string;
// //   description: string;
// //   slug: string;
// //   parentId?: string;
// //   level: number;
// // }

// // const Categories = () => {
// //   const [categories, setCategories] = useState<Category[]>([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
// //   const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
// //   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
// //   const [editingSubcategory, setEditingSubcategory] = useState<Category | null>(null);
// //   const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const { toast } = useToast();

// //   const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
// //     name: "",
// //     description: "",
// //     slug: "",
// //     level: 1
// //   });

// //   const [subcategoryForm, setSubcategoryForm] = useState<CategoryFormData>({
// //     name: "",
// //     description: "",
// //     slug: "",
// //     parentId: "",
// //     level: 2
// //   });

// //   // Fetch categories from API
// //   const fetchData = async () => {
// //     try {
// //       setIsLoading(true);
// //       setError(null);
      
// //       console.log('🔄 Fetching categories from API...');
// //       const response = await adminApiService.getCategories();
// //       console.log('✅ Categories response:', response);
      
// //       // Handle different response formats
// //       let categoriesData = [];
      
// //       if (Array.isArray(response)) {
// //         categoriesData = response;
// //       } else if (response && response.categories) {
// //         categoriesData = response.categories;
// //       } else if (response && response.data) {
// //         categoriesData = response.data;
// //       } else {
// //         categoriesData = response;
// //       }
      
// //       console.log('📦 Processed categories data:', categoriesData);
// //       setCategories(categoriesData);
// //     } catch (err: any) {
// //       console.error('❌ Failed to fetch categories:', err);
// //       const errorMessage = err.message || 'Failed to load categories. Please try again.';
// //       setError(errorMessage);
// //       toast({
// //         variant: "destructive",
// //         title: "Error loading categories",
// //         description: errorMessage,
// //       });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   // Filter categories and their subcategories
// //   const filteredCategories = categories.filter(cat =>
// //     cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //     cat.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //     (cat.children && cat.children.some(child => 
// //       child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       child.slug?.toLowerCase().includes(searchTerm.toLowerCase())
// //     ))
// //   );

// //   // Get categories by level
// //   const getCategoriesByLevel = (level: number) => {
// //     return categories.filter(cat => cat.level === level);
// //   };

// //   // Get top-level categories (level 1)
// //   const topLevelCategories = getCategoriesByLevel(1);

// //   // Get subcategories for a category
// //   const getSubcategories = (categoryId: string) => {
// //     return categories.filter(cat => cat.parentId === categoryId);
// //   };

// //   // Get level 2 categories (for subcategory parent selection)
// //   const level2Categories = getCategoriesByLevel(2);

// //   // Toggle category expansion
// //   const toggleCategory = (categoryId: string) => {
// //     const newExpanded = new Set(expandedCategories);
// //     if (newExpanded.has(categoryId)) {
// //       newExpanded.delete(categoryId);
// //     } else {
// //       newExpanded.add(categoryId);
// //     }
// //     setExpandedCategories(newExpanded);
// //   };

// //   // Calculate stats
// //   const totalLevel1 = getCategoriesByLevel(1).length;
// //   const totalLevel2 = getCategoriesByLevel(2).length;
// //   const totalLevel3 = getCategoriesByLevel(3).length;

// //   const handleAddCategory = () => {
// //     setEditingCategory(null);
// //     setCategoryForm({ 
// //       name: "", 
// //       description: "", 
// //       slug: "", 
// //       level: 1 
// //     });
// //     setCategoryDialogOpen(true);
// //   };

// //   const handleEditCategory = (category: Category) => {
// //     setEditingCategory(category);
// //     setCategoryForm({
// //       name: category.name,
// //       description: category.description || "",
// //       slug: category.slug || "",
// //       level: category.level
// //     });
// //     setCategoryDialogOpen(true);
// //   };

// //   const handleDeleteCategory = async (id: string) => {
// //     const relatedSubs = getSubcategories(id);
// //     if (relatedSubs.length > 0) {
// //       toast({
// //         variant: "destructive",
// //         title: "Cannot delete",
// //         description: "Please delete all subcategories first"
// //       });
// //       return;
// //     }

// //     if (!confirm('Are you sure you want to delete this category?')) {
// //       return;
// //     }

// //     try {
// //       await adminApiService.deleteCategory(id);
// //       setCategories(categories.filter(cat => cat.id !== id));
// //       toast({ 
// //         title: "Category deleted", 
// //         description: "Category has been removed successfully" 
// //       });
// //     } catch (err) {
// //       console.error('Failed to delete category:', err);
// //       toast({
// //         variant: "destructive",
// //         title: "Error deleting category",
// //         description: "Could not delete the category. Please try again.",
// //       });
// //     }
// //   };

// //   const handleCategorySubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     if (!categoryForm.name || !categoryForm.slug) {
// //       toast({
// //         variant: "destructive",
// //         title: "Missing fields",
// //         description: "Please fill in all required fields"
// //       });
// //       return;
// //     }

// //     setIsSubmitting(true);

// //     try {
// //       const categoryData = {
// //         name: categoryForm.name,
// //         description: categoryForm.description,
// //         slug: categoryForm.slug,
// //         level: categoryForm.level
// //       };

// //       if (editingCategory) {
// //         const updatedCategory = await adminApiService.updateCategory(editingCategory.id, categoryData);
// //         setCategories(categories.map(cat => 
// //           cat.id === editingCategory.id ? updatedCategory : cat
// //         ));
// //         toast({ 
// //           title: "Category updated", 
// //           description: "Category has been updated successfully" 
// //         });
// //       } else {
// //         const newCategory = await adminApiService.createCategory(categoryData);
// //         setCategories([...categories, newCategory]);
// //         toast({ 
// //           title: "Category added", 
// //           description: "Category has been added successfully" 
// //         });
// //       }
// //       setCategoryDialogOpen(false);
// //     } catch (err: any) {
// //       console.error('Failed to save category:', err);
// //       toast({
// //         variant: "destructive",
// //         title: "Error saving category",
// //         description: err.message || "Could not save the category. Please try again.",
// //       });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleAddSubcategory = () => {
// //     setEditingSubcategory(null);
// //     setSubcategoryForm({ 
// //       name: "", 
// //       parentId: "", 
// //       slug: "", 
// //       description: "", 
// //       level: 2 
// //     });
// //     setSubcategoryDialogOpen(true);
// //   };

// //   const handleEditSubcategory = (subcategory: Category) => {
// //     setEditingSubcategory(subcategory);
// //     setSubcategoryForm({
// //       name: subcategory.name,
// //       parentId: subcategory.parentId || "",
// //       slug: subcategory.slug || "",
// //       description: subcategory.description || "",
// //       level: subcategory.level
// //     });
// //     setSubcategoryDialogOpen(true);
// //   };

// //   const handleDeleteSubcategory = async (id: string) => {
// //     if (!confirm('Are you sure you want to delete this subcategory?')) {
// //       return;
// //     }

// //     try {
// //       await adminApiService.deleteCategory(id);
// //       setCategories(categories.filter(cat => cat.id !== id));
// //       toast({ 
// //         title: "Subcategory deleted", 
// //         description: "Subcategory has been removed successfully" 
// //       });
// //     } catch (err) {
// //       console.error('Failed to delete subcategory:', err);
// //       toast({
// //         variant: "destructive",
// //         title: "Error deleting subcategory",
// //         description: "Could not delete the subcategory. Please try again.",
// //       });
// //     }
// //   };

// //   const handleSubcategorySubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     if (!subcategoryForm.name || !subcategoryForm.parentId || !subcategoryForm.slug) {
// //       toast({
// //         variant: "destructive",
// //         title: "Missing fields",
// //         description: "Please fill in all required fields"
// //       });
// //       return;
// //     }

// //     setIsSubmitting(true);

// //     try {
// //       const subcategoryData = {
// //         name: subcategoryForm.name,
// //         parentId: subcategoryForm.parentId,
// //         slug: subcategoryForm.slug,
// //         description: subcategoryForm.description,
// //         level: subcategoryForm.level
// //       };

// //       if (editingSubcategory) {
// //         const updatedSubcategory = await adminApiService.updateCategory(editingSubcategory.id, subcategoryData);
// //         setCategories(categories.map(cat => 
// //           cat.id === editingSubcategory.id ? updatedSubcategory : cat
// //         ));
// //         toast({ 
// //           title: "Subcategory updated", 
// //           description: "Subcategory has been updated successfully" 
// //         });
// //       } else {
// //         const newSubcategory = await adminApiService.createCategory(subcategoryData);
// //         setCategories([...categories, newSubcategory]);
// //         toast({ 
// //           title: "Subcategory added", 
// //           description: "Subcategory has been added successfully" 
// //         });
// //       }
// //       setSubcategoryDialogOpen(false);
// //     } catch (err: any) {
// //       console.error('Failed to save subcategory:', err);
// //       toast({
// //         variant: "destructive",
// //         title: "Error saving subcategory",
// //         description: err.message || "Could not save the subcategory. Please try again.",
// //       });
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   // Get available parent categories based on level
// //   const getAvailableParents = (currentLevel: number) => {
// //     if (currentLevel === 2) {
// //       return topLevelCategories; // Level 2 can have Level 1 parents
// //     } else if (currentLevel === 3) {
// //       return level2Categories; // Level 3 can have Level 2 parents
// //     }
// //     return [];
// //   };

// //   const SkeletonRow = () => (
// //     <tr className="border-b hover:bg-muted/50">
// //       <td className="p-4 align-middle">
// //         <div className="flex items-center gap-2">
// //           <div className="h-6 w-6 bg-muted rounded animate-pulse" />
// //           <div className="h-4 w-4 bg-muted rounded animate-pulse" />
// //           <div className="h-4 bg-muted rounded animate-pulse w-32" />
// //         </div>
// //       </td>
// //       <td className="p-4 align-middle">
// //         <div className="h-4 bg-muted rounded animate-pulse w-20" />
// //       </td>
// //       <td className="p-4 align-middle">
// //         <div className="h-4 bg-muted rounded animate-pulse w-40" />
// //       </td>
// //       <td className="p-4 align-middle">
// //         <div className="h-6 bg-muted rounded animate-pulse w-12" />
// //       </td>
// //       <td className="p-4 align-middle">
// //         <div className="h-4 bg-muted rounded animate-pulse w-16" />
// //       </td>
// //       <td className="p-4 align-middle">
// //         <div className="flex gap-2">
// //           <div className="h-8 w-8 bg-muted rounded animate-pulse" />
// //           <div className="h-8 w-8 bg-muted rounded animate-pulse" />
// //         </div>
// //       </td>
// //     </tr>
// //   );

// //   if (error && categories.length === 0) {
// //     return (
// //       <div className="space-y-6">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
// //             <p className="text-muted-foreground">Manage categories and subcategories for your products</p>
// //           </div>
// //           <Button onClick={fetchData} variant="outline">
// //             <RefreshCw className="mr-2 h-4 w-4" />
// //             Retry
// //           </Button>
// //         </div>
// //         <Card>
// //           <CardContent className="flex flex-col items-center justify-center py-12">
// //             <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
// //             <p className="text-lg font-medium mb-2">Failed to load categories</p>
// //             <p className="text-muted-foreground text-center mb-4">{error}</p>
// //             <Button onClick={fetchData}>
// //               <RefreshCw className="mr-2 h-4 w-4" />
// //               Try Again
// //             </Button>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
// //           <p className="text-muted-foreground">Manage categories and subcategories for your products</p>
// //         </div>
// //         <div className="flex gap-2">
// //           <Button onClick={fetchData} variant="outline" disabled={isLoading}>
// //             <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
// //             Refresh
// //           </Button>
// //           <Button onClick={handleAddCategory} disabled={isLoading}>
// //             <Plus className="mr-2 h-4 w-4" />
// //             Add Category
// //           </Button>
// //           <Button onClick={handleAddSubcategory} variant="outline" disabled={isLoading || topLevelCategories.length === 0}>
// //             <Plus className="mr-2 h-4 w-4" />
// //             Add Subcategory
// //           </Button>
// //         </div>
// //       </div>

// //       {/* Stats Cards */}
// //       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-medium">Level 1 Categories</CardTitle>
// //             <Folder className="h-4 w-4 text-muted-foreground" />
// //           </CardHeader>
// //           <CardContent>
// //             {isLoading ? (
// //               <>
// //                 <div className="h-8 bg-muted rounded animate-pulse mb-2" />
// //                 <div className="h-4 bg-muted rounded animate-pulse" />
// //               </>
// //             ) : (
// //               <>
// //                 <div className="text-2xl font-bold">{totalLevel1}</div>
// //                 <p className="text-xs text-muted-foreground">Main categories</p>
// //               </>
// //             )}
// //           </CardContent>
// //         </Card>
// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-medium">Level 2 Categories</CardTitle>
// //             <FolderTree className="h-4 w-4 text-muted-foreground" />
// //           </CardHeader>
// //           <CardContent>
// //             {isLoading ? (
// //               <>
// //                 <div className="h-8 bg-muted rounded animate-pulse mb-2" />
// //                 <div className="h-4 bg-muted rounded animate-pulse" />
// //               </>
// //             ) : (
// //               <>
// //                 <div className="text-2xl font-bold">{totalLevel2}</div>
// //                 <p className="text-xs text-muted-foreground">Subcategories</p>
// //               </>
// //             )}
// //           </CardContent>
// //         </Card>
// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-medium">Level 3 Categories</CardTitle>
// //             <Tag className="h-4 w-4 text-muted-foreground" />
// //           </CardHeader>
// //           <CardContent>
// //             {isLoading ? (
// //               <>
// //                 <div className="h-8 bg-muted rounded animate-pulse mb-2" />
// //                 <div className="h-4 bg-muted rounded animate-pulse" />
// //               </>
// //             ) : (
// //               <>
// //                 <div className="text-2xl font-bold">{totalLevel3}</div>
// //                 <p className="text-xs text-muted-foreground">Items</p>
// //               </>
// //             )}
// //           </CardContent>
// //         </Card>
// //         <Card>
// //           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
// //             <CardTitle className="text-sm font-medium">Total Items</CardTitle>
// //             <Tag className="h-4 w-4 text-muted-foreground" />
// //           </CardHeader>
// //           <CardContent>
// //             {isLoading ? (
// //               <>
// //                 <div className="h-8 bg-muted rounded animate-pulse mb-2" />
// //                 <div className="h-4 bg-muted rounded animate-pulse" />
// //               </>
// //             ) : (
// //               <>
// //                 <div className="text-2xl font-bold">{categories.length}</div>
// //                 <p className="text-xs text-muted-foreground">All levels</p>
// //               </>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Search */}
// //       <div className="relative w-full md:w-96">
// //         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
// //         <Input
// //           placeholder="Search categories..."
// //           className="pl-8"
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           disabled={isLoading}
// //         />
// //       </div>

// //       {/* Categories Table */}
// //       <Card>
// //         <CardHeader>
// //           <CardTitle>Categories & Subcategories</CardTitle>
// //           <CardDescription>
// //             Manage your product categories and their subcategories in a structured table format
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="rounded-md border">
// //             <table className="w-full text-sm">
// //               <thead>
// //                 <tr className="border-b bg-muted/50">
// //                   <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
// //                   <th className="h-12 px-4 text-left align-middle font-medium">Slug</th>
// //                   <th className="h-12 px-4 text-left align-middle font-medium">Level</th>
// //                   <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
// //                   <th className="h-12 px-4 text-left align-middle font-medium">Children</th>
// //                   <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
// //                   <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {isLoading ? (
// //                   Array.from({ length: 3 }).map((_, index) => (
// //                     <SkeletonRow key={index} />
// //                   ))
// //                 ) : filteredCategories.length > 0 ? (
// //                   filteredCategories.map(category => {
// //                     const categorySubs = getSubcategories(category.id);
// //                     const isExpanded = expandedCategories.has(category.id);
                    
// //                     return (
// //                       <React.Fragment key={category.id}>
// //                         {/* Category Row */}
// //                         <tr className="border-b hover:bg-muted/50">
// //                           <td className="p-4 align-middle">
// //                             <div className="flex items-center gap-2">
// //                               {category.level < 3 && (
// //                                 <Button
// //                                   variant="ghost"
// //                                   size="sm"
// //                                   className="h-6 w-6 p-0"
// //                                   onClick={() => toggleCategory(category.id)}
// //                                   disabled={categorySubs.length === 0 || isLoading}
// //                                 >
// //                                   {categorySubs.length > 0 ? (
// //                                     isExpanded ? (
// //                                       <ChevronDown className="h-4 w-4" />
// //                                     ) : (
// //                                       <ChevronRight className="h-4 w-4" />
// //                                     )
// //                                   ) : (
// //                                     <Folder className="h-4 w-4" />
// //                                   )}
// //                                 </Button>
// //                               )}
// //                               {category.level === 1 && <Folder className="h-4 w-4 text-blue-500" />}
// //                               {category.level === 2 && <FolderTree className="h-4 w-4 text-green-500" />}
// //                               {category.level === 3 && <Tag className="h-4 w-4 text-orange-500" />}
// //                               <span className="font-medium">{category.name}</span>
// //                             </div>
// //                           </td>
// //                           <td className="p-4 align-middle">
// //                             <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
// //                               {category.slug}
// //                             </code>
// //                           </td>
// //                           <td className="p-4 align-middle">
// //                             <Badge variant={category.level === 1 ? "default" : category.level === 2 ? "secondary" : "outline"}>
// //                               Level {category.level}
// //                             </Badge>
// //                           </td>
// //                           <td className="p-4 align-middle">
// //                             {category.description || 'No description'}
// //                           </td>
// //                           <td className="p-4 align-middle">
// //                             <Badge variant="secondary">{categorySubs.length}</Badge>
// //                           </td>
// //                           <td className="p-4 align-middle text-muted-foreground">
// //                             {new Date(category.createdAt).toLocaleDateString()}
// //                           </td>
// //                           <td className="p-4 align-middle">
// //                             <div className="flex gap-2">
// //                               <Button
// //                                 variant="outline"
// //                                 size="sm"
// //                                 onClick={() => category.level === 1 ? handleEditCategory(category) : handleEditSubcategory(category)}
// //                                 disabled={isLoading}
// //                               >
// //                                 <Edit className="h-3 w-3" />
// //                               </Button>
// //                               <Button
// //                                 variant="outline"
// //                                 size="sm"
// //                                 onClick={() => category.level === 1 ? handleDeleteCategory(category.id) : handleDeleteSubcategory(category.id)}
// //                                 disabled={isLoading}
// //                               >
// //                                 <Trash2 className="h-3 w-3" />
// //                               </Button>
// //                             </div>
// //                           </td>
// //                         </tr>

// //                         {/* Subcategory Rows */}
// //                         {isExpanded && categorySubs.map(subcategory => (
// //                           <tr key={subcategory.id} className="border-b hover:bg-muted/30 bg-muted/20">
// //                             <td className="p-4 align-middle pl-12">
// //                               <div className="flex items-center gap-2">
// //                                 {subcategory.level === 2 && <FolderTree className="h-4 w-4 text-green-500" />}
// //                                 {subcategory.level === 3 && <Tag className="h-4 w-4 text-orange-500" />}
// //                                 <span>{subcategory.name}</span>
// //                               </div>
// //                             </td>
// //                             <td className="p-4 align-middle">
// //                               <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
// //                                 {subcategory.slug}
// //                               </code>
// //                             </td>
// //                             <td className="p-4 align-middle">
// //                               <Badge variant={subcategory.level === 2 ? "secondary" : "outline"}>
// //                                 Level {subcategory.level}
// //                               </Badge>
// //                             </td>
// //                             <td className="p-4 align-middle text-muted-foreground">
// //                               <span className="text-xs">{subcategory.description || 'No description'}</span>
// //                             </td>
// //                             <td className="p-4 align-middle">
// //                               <Badge variant="outline">-</Badge>
// //                             </td>
// //                             <td className="p-4 align-middle text-muted-foreground">
// //                               {new Date(subcategory.createdAt).toLocaleDateString()}
// //                             </td>
// //                             <td className="p-4 align-middle">
// //                               <div className="flex gap-2">
// //                                 <Button
// //                                   variant="outline"
// //                                   size="sm"
// //                                   onClick={() => handleEditSubcategory(subcategory)}
// //                                   disabled={isLoading}
// //                                 >
// //                                   <Edit className="h-3 w-3" />
// //                                 </Button>
// //                                 <Button
// //                                   variant="outline"
// //                                   size="sm"
// //                                   onClick={() => handleDeleteSubcategory(subcategory.id)}
// //                                   disabled={isLoading}
// //                                 >
// //                                   <Trash2 className="h-3 w-3" />
// //                                 </Button>
// //                               </div>
// //                             </td>
// //                           </tr>
// //                         ))}
// //                       </React.Fragment>
// //                     );
// //                   })
// //                 ) : (
// //                   <tr>
// //                     <td colSpan={7} className="p-8 text-center text-muted-foreground">
// //                       <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
// //                       <p>No categories found</p>
// //                       <p className="text-sm">
// //                         {searchTerm ? "Try adjusting your search" : "Get started by adding your first category"}
// //                       </p>
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Add/Edit Category Dialog */}
// //       <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
// //         <DialogContent className="sm:max-w-[500px]">
// //           <DialogHeader>
// //             <DialogTitle>
// //               {editingCategory ? "Edit Category" : "Add New Category"}
// //             </DialogTitle>
// //             <DialogDescription>
// //               {editingCategory ? "Update category details" : "Add a new product category (Level 1)"}
// //             </DialogDescription>
// //           </DialogHeader>
// //           <form onSubmit={handleCategorySubmit}>
// //             <div className="grid gap-4 py-4">
// //               <div className="grid gap-2">
// //                 <Label htmlFor="cat-name">Category Name *</Label>
// //                 <Input
// //                   id="cat-name"
// //                   placeholder="e.g., Clothes"
// //                   value={categoryForm.name}
// //                   onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
// //                   disabled={isSubmitting}
// //                 />
// //               </div>
// //               <div className="grid gap-2">
// //                 <Label htmlFor="cat-slug">Slug *</Label>
// //                 <Input
// //                   id="cat-slug"
// //                   placeholder="e.g., clothes"
// //                   value={categoryForm.slug}
// //                   onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
// //                   disabled={isSubmitting}
// //                 />
// //               </div>
// //               <div className="grid gap-2">
// //                 <Label htmlFor="cat-description">Description</Label>
// //                 <Textarea
// //                   id="cat-description"
// //                   placeholder="Category description"
// //                   value={categoryForm.description}
// //                   onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
// //                   disabled={isSubmitting}
// //                 />
// //               </div>
// //             </div>
// //             <DialogFooter>
// //               <Button 
// //                 type="button" 
// //                 variant="outline" 
// //                 onClick={() => setCategoryDialogOpen(false)}
// //                 disabled={isSubmitting}
// //               >
// //                 Cancel
// //               </Button>
// //               <Button type="submit" disabled={isSubmitting}>
// //                 {isSubmitting ? (
// //                   <>
// //                     <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
// //                     {editingCategory ? "Updating..." : "Adding..."}
// //                   </>
// //                 ) : (
// //                   editingCategory ? "Update Category" : "Add Category"
// //                 )}
// //               </Button>
// //             </DialogFooter>
// //           </form>
// //         </DialogContent>
// //       </Dialog>

// //       {/* Add/Edit Subcategory Dialog */}
// //       <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
// //         <DialogContent className="sm:max-w-[500px]">
// //           <DialogHeader>
// //             <DialogTitle>
// //               {editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}
// //             </DialogTitle>
// //             <DialogDescription>
// //               {editingSubcategory ? "Update subcategory details" : "Add a new subcategory under a parent category"}
// //             </DialogDescription>
// //           </DialogHeader>
// //           <form onSubmit={handleSubcategorySubmit}>
// //             <div className="grid gap-4 py-4">
// //               <div className="grid gap-2">
// //                 <Label htmlFor="parent">Parent Category *</Label>
// //                 <Select
// //                   value={subcategoryForm.parentId}
// //                   onValueChange={(value) => setSubcategoryForm({ ...subcategoryForm, parentId: value })}
// //                   disabled={isSubmitting || topLevelCategories.length === 0}
// //                 >
// //                   <SelectTrigger id="parent">
// //                     <SelectValue placeholder={topLevelCategories.length === 0 ? "No categories available" : "Select parent category"} />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     {topLevelCategories.map(cat => (
// //                       <SelectItem key={cat.id} value={cat.id}>
// //                         {cat.name} (Level {cat.level})
// //                       </SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //                 {topLevelCategories.length === 0 && (
// //                   <p className="text-xs text-muted-foreground">
// //                     Please create a category first before adding subcategories
// //                   </p>
// //                 )}
// //               </div>
// //               <div className="grid gap-2">
// //                 <Label htmlFor="sub-name">Subcategory Name *</Label>
// //                 <Input
// //                   id="sub-name"
// //                   placeholder="e.g., Men's Clothing"
// //                   value={subcategoryForm.name}
// //                   onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
// //                   disabled={isSubmitting}
// //                 />
// //               </div>
// //               <div className="grid gap-2">
// //                 <Label htmlFor="sub-slug">Slug *</Label>
// //                 <Input
// //                   id="sub-slug"
// //                   placeholder="e.g., mens-clothing"
// //                   value={subcategoryForm.slug}
// //                   onChange={(e) => setSubcategoryForm({ ...subcategoryForm, slug: e.target.value })}
// //                   disabled={isSubmitting}
// //                 />
// //               </div>
// //               <div className="grid gap-2">
// //                 <Label htmlFor="sub-description">Description</Label>
// //                 <Textarea
// //                   id="sub-description"
// //                   placeholder="Subcategory description"
// //                   value={subcategoryForm.description}
// //                   onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
// //                   disabled={isSubmitting}
// //                 />
// //               </div>
// //             </div>
// //             <DialogFooter>
// //               <Button 
// //                 type="button" 
// //                 variant="outline" 
// //                 onClick={() => setSubcategoryDialogOpen(false)}
// //                 disabled={isSubmitting}
// //               >
// //                 Cancel
// //               </Button>
// //               <Button type="submit" disabled={isSubmitting || topLevelCategories.length === 0}>
// //                 {isSubmitting ? (
// //                   <>
// //                     <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
// //                     {editingSubcategory ? "Updating..." : "Adding..."}
// //                   </>
// //                 ) : (
// //                   editingSubcategory ? "Update Subcategory" : "Add Subcategory"
// //                 )}
// //               </Button>
// //             </DialogFooter>
// //           </form>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // };

// // export default Categories;

// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Search, Plus, Edit, Trash2, Folder, FolderTree, Tag, ChevronDown, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// import adminApiService from '@/contexts/adminApiService';

// // Unified Category interface that handles all levels
// interface Category {
//   id: string;
//   name: string;
//   description?: string;
//   slug: string;
//   parentId?: string | null;
//   level: number;
//   sortOrder?: number;
//   isActive?: boolean;
//   children?: Category[];
//   createdAt: string;
//   updatedAt: string;
// }

// interface CategoryFormData {
//   name: string;
//   description: string;
//   slug: string;
//   parentId?: string;
//   level: number;
// }

// const Categories = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
//   const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [editingSubcategory, setEditingSubcategory] = useState<Category | null>(null);
//   const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { toast } = useToast();

//   const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
//     name: "",
//     description: "",
//     slug: "",
//     level: 1
//   });

//   const [subcategoryForm, setSubcategoryForm] = useState<CategoryFormData>({
//     name: "",
//     description: "",
//     slug: "",
//     parentId: "",
//     level: 2
//   });

//   // Fetch categories from API
//   const fetchData = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
      
//       console.log('🔄 Fetching categories from API...');
//       const response = await adminApiService.getCategories();
//       console.log('✅ Categories response:', response);
      
//       // Handle different response formats
//       let categoriesData = [];
      
//       if (Array.isArray(response)) {
//         categoriesData = response;
//       } else if (response && response.categories) {
//         categoriesData = response.categories;
//       } else if (response && response.data) {
//         categoriesData = response.data;
//       } else {
//         categoriesData = response;
//       }
      
//       console.log('📦 Processed categories data:', categoriesData);
//       setCategories(categoriesData);
//     } catch (err: any) {
//       console.error('❌ Failed to fetch categories:', err);
//       const errorMessage = err.message || 'Failed to load categories. Please try again.';
//       setError(errorMessage);
//       toast({
//         variant: "destructive",
//         title: "Error loading categories",
//         description: errorMessage,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Filter categories and their subcategories
//   const filteredCategories = categories.filter(cat =>
//     cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     cat.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (cat.children && cat.children.some(child => 
//       child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       child.slug?.toLowerCase().includes(searchTerm.toLowerCase())
//     ))
//   );

//   // Get categories by level
//   const getCategoriesByLevel = (level: number) => {
//     return categories.filter(cat => cat.level === level);
//   };

//   // Get top-level categories (level 1)
//   const topLevelCategories = getCategoriesByLevel(1);

//   // Get level 2 categories
//   const level2Categories = getCategoriesByLevel(2);

//   // Get level 3 categories
//   const level3Categories = getCategoriesByLevel(3);

//   // Get subcategories for a category
//   const getSubcategories = (categoryId: string) => {
//     return categories.filter(cat => cat.parentId === categoryId);
//   };

//   // Get available parent categories for the current level
//   const getAvailableParents = (currentLevel: number) => {
//     if (currentLevel === 2) {
//       return topLevelCategories; // Level 2 can have Level 1 parents
//     } else if (currentLevel === 3) {
//       return level2Categories; // Level 3 can have Level 2 parents
//     }
//     return [];
//   };

//   // Toggle category expansion
//   const toggleCategory = (categoryId: string) => {
//     const newExpanded = new Set(expandedCategories);
//     if (newExpanded.has(categoryId)) {
//       newExpanded.delete(categoryId);
//     } else {
//       newExpanded.add(categoryId);
//     }
//     setExpandedCategories(newExpanded);
//   };

//   // Calculate stats
//   const totalLevel1 = topLevelCategories.length;
//   const totalLevel2 = level2Categories.length;
//   const totalLevel3 = level3Categories.length;

//   const handleAddCategory = () => {
//     setEditingCategory(null);
//     setCategoryForm({ 
//       name: "", 
//       description: "", 
//       slug: "", 
//       level: 1 
//     });
//     setCategoryDialogOpen(true);
//   };

//   const handleEditCategory = (category: Category) => {
//     setEditingCategory(category);
//     setCategoryForm({
//       name: category.name,
//       description: category.description || "",
//       slug: category.slug || "",
//       level: category.level
//     });
//     setCategoryDialogOpen(true);
//   };

//   const handleDeleteCategory = async (id: string) => {
//     const relatedSubs = getSubcategories(id);
//     if (relatedSubs.length > 0) {
//       toast({
//         variant: "destructive",
//         title: "Cannot delete",
//         description: "Please delete all subcategories first"
//       });
//       return;
//     }

//     if (!confirm('Are you sure you want to delete this category?')) {
//       return;
//     }

//     try {
//       await adminApiService.deleteCategory(id);
//       setCategories(categories.filter(cat => cat.id !== id));
//       toast({ 
//         title: "Category deleted", 
//         description: "Category has been removed successfully" 
//       });
//     } catch (err) {
//       console.error('Failed to delete category:', err);
//       toast({
//         variant: "destructive",
//         title: "Error deleting category",
//         description: "Could not delete the category. Please try again.",
//       });
//     }
//   };

//   const handleCategorySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!categoryForm.name || !categoryForm.slug) {
//       toast({
//         variant: "destructive",
//         title: "Missing fields",
//         description: "Please fill in all required fields"
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const categoryData = {
//         name: categoryForm.name,
//         description: categoryForm.description,
//         slug: categoryForm.slug,
//         level: categoryForm.level
//       };

//       if (editingCategory) {
//         const updatedCategory = await adminApiService.updateCategory(editingCategory.id, categoryData);
//         setCategories(categories.map(cat => 
//           cat.id === editingCategory.id ? updatedCategory : cat
//         ));
//         toast({ 
//           title: "Category updated", 
//           description: "Category has been updated successfully" 
//         });
//       } else {
//         const newCategory = await adminApiService.createCategory(categoryData);
//         setCategories([...categories, newCategory]);
//         toast({ 
//           title: "Category added", 
//           description: "Category has been added successfully" 
//         });
//       }
//       setCategoryDialogOpen(false);
//     } catch (err: any) {
//       console.error('Failed to save category:', err);
//       toast({
//         variant: "destructive",
//         title: "Error saving category",
//         description: err.message || "Could not save the category. Please try again.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleAddSubcategory = () => {
//     setEditingSubcategory(null);
//     setSubcategoryForm({ 
//       name: "", 
//       parentId: "", 
//       slug: "", 
//       description: "", 
//       level: 2 
//     });
//     setSubcategoryDialogOpen(true);
//   };

//   const handleEditSubcategory = (subcategory: Category) => {
//     setEditingSubcategory(subcategory);
//     setSubcategoryForm({
//       name: subcategory.name,
//       parentId: subcategory.parentId || "",
//       slug: subcategory.slug || "",
//       description: subcategory.description || "",
//       level: subcategory.level
//     });
//     setSubcategoryDialogOpen(true);
//   };

//   const handleDeleteSubcategory = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this subcategory?')) {
//       return;
//     }

//     try {
//       await adminApiService.deleteCategory(id);
//       setCategories(categories.filter(cat => cat.id !== id));
//       toast({ 
//         title: "Subcategory deleted", 
//         description: "Subcategory has been removed successfully" 
//       });
//     } catch (err) {
//       console.error('Failed to delete subcategory:', err);
//       toast({
//         variant: "destructive",
//         title: "Error deleting subcategory",
//         description: "Could not delete the subcategory. Please try again.",
//       });
//     }
//   };

// const handleSubcategorySubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
  
//   if (!subcategoryForm.name || !subcategoryForm.parentId || !subcategoryForm.slug) {
//     toast({
//       variant: "destructive",
//       title: "Missing fields",
//       description: "Please fill in all required fields"
//     });
//     return;
//   }

//   setIsSubmitting(true);

//   try {
//     // Determine the level based on parent selection
//     const selectedParent = categories.find(cat => cat.id === subcategoryForm.parentId);
//     const level = selectedParent?.level === 1 ? 2 : 3;

//     // Send as JSON, not FormData
//     const subcategoryData = {
//       name: subcategoryForm.name,
//       parentId: subcategoryForm.parentId,
//       slug: subcategoryForm.slug,
//       description: subcategoryForm.description,
//       level: level,
//       sortOrder: 1 // Add default sortOrder
//     };

//     console.log('📤 Creating subcategory with data:', subcategoryData);

//     if (editingSubcategory) {
//       // Use updateCategory with JSON data
//       const updatedSubcategory = await adminApiService.updateCategory(
//         editingSubcategory.id, 
//         subcategoryData // Send as plain object, not FormData
//       );
//       setCategories(categories.map(cat => 
//         cat.id === editingSubcategory.id ? updatedSubcategory : cat
//       ));
//       toast({ 
//         title: "Subcategory updated", 
//         description: "Subcategory has been updated successfully" 
//       });
//     } else {
//       // Use createCategory with JSON data
//       const newSubcategory = await adminApiService.createCategory(subcategoryData);
//       setCategories([...categories, newSubcategory]);
//       toast({ 
//         title: "Subcategory added", 
//         description: "Subcategory has been added successfully" 
//       });
//     }
//     setSubcategoryDialogOpen(false);
//   } catch (err: any) {
//     console.error('Failed to save subcategory:', err);
//     toast({
//       variant: "destructive",
//       title: "Error saving subcategory",
//       description: err.message || "Could not save the subcategory. Please try again.",
//     });
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   // Get display name for category level
//   const getLevelDisplayName = (level: number): string => {
//     switch (level) {
//       case 1: return 'Main Category';
//       case 2: return 'Subcategory';
//       case 3: return 'Item';
//       default: return 'Category';
//     }
//   };

//   // Get icon for category level
//   const getLevelIcon = (level: number) => {
//     switch (level) {
//       case 1: return <Folder className="h-4 w-4 text-blue-500" />;
//       case 2: return <FolderTree className="h-4 w-4 text-green-500" />;
//       case 3: return <Tag className="h-4 w-4 text-orange-500" />;
//       default: return <Folder className="h-4 w-4 text-gray-500" />;
//     }
//   };

//   const SkeletonRow = () => (
//     <tr className="border-b hover:bg-muted/50">
//       <td className="p-4 align-middle">
//         <div className="flex items-center gap-2">
//           <div className="h-6 w-6 bg-muted rounded animate-pulse" />
//           <div className="h-4 w-4 bg-muted rounded animate-pulse" />
//           <div className="h-4 bg-muted rounded animate-pulse w-32" />
//         </div>
//       </td>
//       <td className="p-4 align-middle">
//         <div className="h-4 bg-muted rounded animate-pulse w-20" />
//       </td>
//       <td className="p-4 align-middle">
//         <div className="h-4 bg-muted rounded animate-pulse w-40" />
//       </td>
//       <td className="p-4 align-middle">
//         <div className="h-6 bg-muted rounded animate-pulse w-12" />
//       </td>
//       <td className="p-4 align-middle">
//         <div className="h-4 bg-muted rounded animate-pulse w-16" />
//       </td>
//       <td className="p-4 align-middle">
//         <div className="flex gap-2">
//           <div className="h-8 w-8 bg-muted rounded animate-pulse" />
//           <div className="h-8 w-8 bg-muted rounded animate-pulse" />
//         </div>
//       </td>
//     </tr>
//   );

//   if (error && categories.length === 0) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
//             <p className="text-muted-foreground">Manage categories and subcategories for your products</p>
//           </div>
//           <Button onClick={fetchData} variant="outline">
//             <RefreshCw className="mr-2 h-4 w-4" />
//             Retry
//           </Button>
//         </div>
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-12">
//             <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
//             <p className="text-lg font-medium mb-2">Failed to load categories</p>
//             <p className="text-muted-foreground text-center mb-4">{error}</p>
//             <Button onClick={fetchData}>
//               <RefreshCw className="mr-2 h-4 w-4" />
//               Try Again
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
//           <p className="text-muted-foreground">Manage categories and subcategories for your products</p>
//         </div>
//         <div className="flex gap-2">
//           <Button onClick={fetchData} variant="outline" disabled={isLoading}>
//             <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>
//           <Button onClick={handleAddCategory} disabled={isLoading}>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Main Category
//           </Button>
//           <Button onClick={handleAddSubcategory} variant="outline" disabled={isLoading || topLevelCategories.length === 0}>
//             <Plus className="mr-2 h-4 w-4" />
//             Add Subcategory/Item
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Main Categories</CardTitle>
//             <Folder className="h-4 w-4 text-blue-500" />
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <>
//                 <div className="h-8 bg-muted rounded animate-pulse mb-2" />
//                 <div className="h-4 bg-muted rounded animate-pulse" />
//               </>
//             ) : (
//               <>
//                 <div className="text-2xl font-bold">{totalLevel1}</div>
//                 <p className="text-xs text-muted-foreground">Level 1 categories</p>
//               </>
//             )}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
//             <FolderTree className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <>
//                 <div className="h-8 bg-muted rounded animate-pulse mb-2" />
//                 <div className="h-4 bg-muted rounded animate-pulse" />
//               </>
//             ) : (
//               <>
//                 <div className="text-2xl font-bold">{totalLevel2}</div>
//                 <p className="text-xs text-muted-foreground">Level 2 subcategories</p>
//               </>
//             )}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Items</CardTitle>
//             <Tag className="h-4 w-4 text-orange-500" />
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <>
//                 <div className="h-8 bg-muted rounded animate-pulse mb-2" />
//                 <div className="h-4 bg-muted rounded animate-pulse" />
//               </>
//             ) : (
//               <>
//                 <div className="text-2xl font-bold">{totalLevel3}</div>
//                 <p className="text-xs text-muted-foreground">Level 3 items</p>
//               </>
//             )}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total</CardTitle>
//             <Folder className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <>
//                 <div className="h-8 bg-muted rounded animate-pulse mb-2" />
//                 <div className="h-4 bg-muted rounded animate-pulse" />
//               </>
//             ) : (
//               <>
//                 <div className="text-2xl font-bold">{categories.length}</div>
//                 <p className="text-xs text-muted-foreground">All categories</p>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Search */}
//       <div className="relative w-full md:w-96">
//         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search categories..."
//           className="pl-8"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           disabled={isLoading}
//         />
//       </div>

//       {/* Categories Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Categories Hierarchy</CardTitle>
//           <CardDescription>
//             Manage your product categories in a 3-level hierarchy: Main Categories → Subcategories → Items
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-md border">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b bg-muted/50">
//                   <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
//                   <th className="h-12 px-4 text-left align-middle font-medium">Slug</th>
//                   <th className="h-12 px-4 text-left align-middle font-medium">Level</th>
//                   <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
//                   <th className="h-12 px-4 text-left align-middle font-medium">Children</th>
//                   <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
//                   <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isLoading ? (
//                   Array.from({ length: 3 }).map((_, index) => (
//                     <SkeletonRow key={index} />
//                   ))
//                 ) : filteredCategories.length > 0 ? (
//                   filteredCategories.map(category => {
//                     const categorySubs = getSubcategories(category.id);
//                     const isExpanded = expandedCategories.has(category.id);
//                     const canExpand = categorySubs.length > 0 && category.level < 3;
                    
//                     return (
//                       <React.Fragment key={category.id}>
//                         {/* Category Row */}
//                         <tr className="border-b hover:bg-muted/50">
//                           <td className="p-4 align-middle">
//                             <div className="flex items-center gap-2">
//                               {canExpand && (
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-6 w-6 p-0"
//                                   onClick={() => toggleCategory(category.id)}
//                                   disabled={isLoading}
//                                 >
//                                   {isExpanded ? (
//                                     <ChevronDown className="h-4 w-4" />
//                                   ) : (
//                                     <ChevronRight className="h-4 w-4" />
//                                   )}
//                                 </Button>
//                               )}
//                               {!canExpand && <div className="w-6" />}
//                               {getLevelIcon(category.level)}
//                               <span className="font-medium">{category.name}</span>
//                             </div>
//                           </td>
//                           <td className="p-4 align-middle">
//                             <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
//                               {category.slug}
//                             </code>
//                           </td>
//                           <td className="p-4 align-middle">
//                             <Badge variant={
//                               category.level === 1 ? "default" : 
//                               category.level === 2 ? "secondary" : "outline"
//                             }>
//                               {getLevelDisplayName(category.level)}
//                             </Badge>
//                           </td>
//                           <td className="p-4 align-middle">
//                             {category.description || 'No description'}
//                           </td>
//                           <td className="p-4 align-middle">
//                             <Badge variant="secondary">{categorySubs.length}</Badge>
//                           </td>
//                           <td className="p-4 align-middle text-muted-foreground">
//                             {new Date(category.createdAt).toLocaleDateString()}
//                           </td>
//                           <td className="p-4 align-middle">
//                             <div className="flex gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => category.level === 1 ? handleEditCategory(category) : handleEditSubcategory(category)}
//                                 disabled={isLoading}
//                               >
//                                 <Edit className="h-3 w-3" />
//                               </Button>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => category.level === 1 ? handleDeleteCategory(category.id) : handleDeleteSubcategory(category.id)}
//                                 disabled={isLoading}
//                               >
//                                 <Trash2 className="h-3 w-3" />
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>

//                         {/* Subcategory Rows */}
//                         {isExpanded && categorySubs.map(subcategory => (
//                           <tr key={subcategory.id} className="border-b hover:bg-muted/30 bg-muted/20">
//                             <td className="p-4 align-middle pl-12">
//                               <div className="flex items-center gap-2">
//                                 {getLevelIcon(subcategory.level)}
//                                 <span>{subcategory.name}</span>
//                               </div>
//                             </td>
//                             <td className="p-4 align-middle">
//                               <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
//                                 {subcategory.slug}
//                               </code>
//                             </td>
//                             <td className="p-4 align-middle">
//                               <Badge variant={subcategory.level === 2 ? "secondary" : "outline"}>
//                                 {getLevelDisplayName(subcategory.level)}
//                               </Badge>
//                             </td>
//                             <td className="p-4 align-middle text-muted-foreground">
//                               <span className="text-xs">{subcategory.description || 'No description'}</span>
//                             </td>
//                             <td className="p-4 align-middle">
//                               <Badge variant="outline">-</Badge>
//                             </td>
//                             <td className="p-4 align-middle text-muted-foreground">
//                               {new Date(subcategory.createdAt).toLocaleDateString()}
//                             </td>
//                             <td className="p-4 align-middle">
//                               <div className="flex gap-2">
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => handleEditSubcategory(subcategory)}
//                                   disabled={isLoading}
//                                 >
//                                   <Edit className="h-3 w-3" />
//                                 </Button>
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => handleDeleteSubcategory(subcategory.id)}
//                                   disabled={isLoading}
//                                 >
//                                   <Trash2 className="h-3 w-3" />
//                                 </Button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </React.Fragment>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan={7} className="p-8 text-center text-muted-foreground">
//                       <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                       <p>No categories found</p>
//                       <p className="text-sm">
//                         {searchTerm ? "Try adjusting your search" : "Get started by adding your first category"}
//                       </p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Add/Edit Category Dialog */}
//       <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>
//               {editingCategory ? "Edit Main Category" : "Add New Main Category"}
//             </DialogTitle>
//             <DialogDescription>
//               {editingCategory ? "Update main category details" : "Add a new main product category (Level 1)"}
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleCategorySubmit}>
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="cat-name">Category Name *</Label>
//                 <Input
//                   id="cat-name"
//                   placeholder="e.g., Clothes"
//                   value={categoryForm.name}
//                   onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
//                   disabled={isSubmitting}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="cat-slug">Slug *</Label>
//                 <Input
//                   id="cat-slug"
//                   placeholder="e.g., clothes"
//                   value={categoryForm.slug}
//                   onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
//                   disabled={isSubmitting}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="cat-description">Description</Label>
//                 <Textarea
//                   id="cat-description"
//                   placeholder="Category description"
//                   value={categoryForm.description}
//                   onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => setCategoryDialogOpen(false)}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                     {editingCategory ? "Updating..." : "Adding..."}
//                   </>
//                 ) : (
//                   editingCategory ? "Update Category" : "Add Category"
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Enhanced Add/Edit Subcategory Dialog */}
//       <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>
//               {editingSubcategory 
//                 ? `Edit ${getLevelDisplayName(editingSubcategory.level)}` 
//                 : 'Add New Subcategory/Item'
//               }
//             </DialogTitle>
//             <DialogDescription>
//               {editingSubcategory 
//                 ? `Update ${getLevelDisplayName(editingSubcategory.level).toLowerCase()} details`
//                 : 'Add a new subcategory (Level 2) or item (Level 3) under a parent category'
//               }
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleSubcategorySubmit}>
//             <div className="grid gap-4 py-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="parent">Parent Category *</Label>
         

//          <Select
//   value={subcategoryForm.parentId}
//   onValueChange={(value) => {
//     const selectedParent = categories.find(cat => cat.id === value);
//     const newLevel = selectedParent?.level === 1 ? 2 : 3;
//     setSubcategoryForm({ 
//       ...subcategoryForm, 
//       parentId: value,
//       level: newLevel
//     });
//   }}
//   disabled={isSubmitting || categories.length === 0}
// >
//   <SelectTrigger id="parent">
//     <SelectValue placeholder={categories.length === 0 ? "No categories available" : "Select parent category"} />
//   </SelectTrigger>
//   <SelectContent>
//     {/* Level 1 Categories */}
//     {topLevelCategories.length > 0 && (
//       <>
//         <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
//           📁 Main Categories (Creates Level 2)
//         </div>
//         {topLevelCategories.map(cat => (
//           <SelectItem key={cat.id} value={cat.id} className="pl-6">
//             <div className="flex items-center gap-2">
//               <Folder className="h-3 w-3 text-blue-500" />
//               {cat.name}
//             </div>
//           </SelectItem>
//         ))}
//       </>
//     )}
    
//     {/* Level 2 Categories */}
//     {level2Categories.length > 0 && (
//       <>
//         <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-2">
//           📂 Subcategories (Creates Level 3)
//         </div>
//         {level2Categories.map(cat => (
//           <SelectItem key={cat.id} value={cat.id} className="pl-6">
//             <div className="flex items-center gap-2">
//               <FolderTree className="h-3 w-3 text-green-500" />
//               {cat.name}
//             </div>
//           </SelectItem>
//         ))}
//       </>
//     )}
//   </SelectContent>
// </Select>
//                 {subcategoryForm.parentId && (
//                   <p className="text-xs text-muted-foreground">
//                     This will create a {getLevelDisplayName(subcategoryForm.level).toLowerCase()} under the selected parent
//                   </p>
//                 )}
//               </div>
              
//               <div className="grid gap-2">
//                 <Label htmlFor="sub-name">
//                   {getLevelDisplayName(subcategoryForm.level)} Name *
//                 </Label>
//                 <Input
//                   id="sub-name"
//                   placeholder={
//                     subcategoryForm.level === 2 
//                       ? "e.g., Men's Clothing" 
//                       : "e.g., African Wear"
//                   }
//                   value={subcategoryForm.name}
//                   onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
//                   disabled={isSubmitting}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="sub-slug">Slug *</Label>
//                 <Input
//                   id="sub-slug"
//                   placeholder={
//                     subcategoryForm.level === 2 
//                       ? "e.g., mens-clothing" 
//                       : "e.g., african-wear"
//                   }
//                   value={subcategoryForm.slug}
//                   onChange={(e) => setSubcategoryForm({ ...subcategoryForm, slug: e.target.value })}
//                   disabled={isSubmitting}
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="sub-description">Description</Label>
//                 <Textarea
//                   id="sub-description"
//                   placeholder={
//                     subcategoryForm.level === 2 
//                       ? "Subcategory description" 
//                       : "Item description"
//                   }
//                   value={subcategoryForm.description}
//                   onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={() => setSubcategoryDialogOpen(false)}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting || !subcategoryForm.parentId}>
//                 {isSubmitting ? (
//                   <>
//                     <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
//                     {editingSubcategory ? "Updating..." : "Adding..."}
//                   </>
//                 ) : (
//                   editingSubcategory 
//                     ? `Update ${getLevelDisplayName(editingSubcategory.level)}`
//                     : `Add ${getLevelDisplayName(subcategoryForm.level)}`
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Categories;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Search, Plus, Edit, Trash2, Folder, FolderTree, Tag, ChevronDown, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService from '@/contexts/adminApiService';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Unified Category interface that handles all levels
interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string | null;
  level: number;
  sortOrder?: number;
  isActive?: boolean;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  level: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: "",
    description: "",
    slug: "",
    level: 1
  });

  const [subcategoryForm, setSubcategoryForm] = useState<CategoryFormData>({
    name: "",
    description: "",
    slug: "",
    parentId: "",
    level: 2
  });

  // Fetch categories from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching categories from API...');
      const response = await adminApiService.getCategories();
      console.log('✅ Categories response:', response);
      
      // Handle different response formats
      let categoriesData = [];
      
      if (Array.isArray(response)) {
        categoriesData = response;
      } else if (response && response.categories) {
        categoriesData = response.categories;
      } else if (response && response.data) {
        categoriesData = response.data;
      } else {
        categoriesData = response;
      }
      
      console.log('📦 Processed categories data:', categoriesData);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error('❌ Failed to fetch categories:', err);
      const errorMessage = err.message || 'Failed to load categories. Please try again.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error loading categories",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get categories by level
  const getCategoriesByLevel = (level: number) => {
    return categories.filter(cat => cat.level === level);
  };

  // Get top-level categories (level 1)
  const topLevelCategories = getCategoriesByLevel(1);

  // Get level 2 categories
  const level2Categories = getCategoriesByLevel(2);

  // Get level 3 categories
  const level3Categories = getCategoriesByLevel(3);

  // Get subcategories for a category
  const getSubcategories = (categoryId: string) => {
    return categories.filter(cat => cat.parentId === categoryId);
  };

  // Filter categories and their subcategories
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (getSubcategories(cat.id).some(child => 
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Calculate stats
  const totalLevel1 = topLevelCategories.length;
  const totalLevel2 = level2Categories.length;
  const totalLevel3 = level3Categories.length;

  // Category Management Functions
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ 
      name: "", 
      description: "", 
      slug: "", 
      level: 1 
    });
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      slug: category.slug || "",
      level: category.level
    });
    setCategoryDialogOpen(true);
  };

  const handleAddSubcategory = () => {
    setEditingSubcategory(null);
    setSubcategoryForm({ 
      name: "", 
      parentId: "", 
      slug: "", 
      description: "", 
      level: 2 
    });
    setSubcategoryDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: Category) => {
    setEditingSubcategory(subcategory);
    setSubcategoryForm({
      name: subcategory.name,
      parentId: subcategory.parentId || "",
      slug: subcategory.slug || "",
      description: subcategory.description || "",
      level: subcategory.level
    });
    setSubcategoryDialogOpen(true);
  };

  // Form Submission Handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.name || !categoryForm.slug) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryData = {
        name: categoryForm.name,
        description: categoryForm.description,
        slug: categoryForm.slug,
        level: categoryForm.level
      };

      if (editingCategory) {
        const updatedCategory = await adminApiService.updateCategory(editingCategory.id, categoryData);
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? updatedCategory : cat
        ));
        toast({ 
          title: "Category updated", 
          description: "Category has been updated successfully" 
        });
      } else {
        const newCategory = await adminApiService.createCategory(categoryData);
        setCategories([...categories, newCategory]);
        toast({ 
          title: "Category added", 
          description: "Category has been added successfully" 
        });
      }
      setCategoryDialogOpen(false);
    } catch (err: any) {
      console.error('Failed to save category:', err);
      toast({
        variant: "destructive",
        title: "Error saving category",
        description: err.message || "Could not save the category. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subcategoryForm.name || !subcategoryForm.parentId || !subcategoryForm.slug) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine the level based on parent selection
      const selectedParent = categories.find(cat => cat.id === subcategoryForm.parentId);
      const level = selectedParent?.level === 1 ? 2 : 3;

      const subcategoryData = {
        name: subcategoryForm.name,
        parentId: subcategoryForm.parentId,
        slug: subcategoryForm.slug,
        description: subcategoryForm.description,
        level: level,
        sortOrder: 1
      };

      console.log('📤 Creating subcategory with data:', subcategoryData);

      if (editingSubcategory) {
        const updatedSubcategory = await adminApiService.updateCategory(
          editingSubcategory.id, 
          subcategoryData
        );
        setCategories(categories.map(cat => 
          cat.id === editingSubcategory.id ? updatedSubcategory : cat
        ));
        toast({ 
          title: "Subcategory updated", 
          description: "Subcategory has been updated successfully" 
        });
      } else {
        const newSubcategory = await adminApiService.createCategory(subcategoryData);
        setCategories([...categories, newSubcategory]);
        toast({ 
          title: "Subcategory added", 
          description: "Subcategory has been added successfully" 
        });
      }
      setSubcategoryDialogOpen(false);
    } catch (err: any) {
      console.error('Failed to save subcategory:', err);
      toast({
        variant: "destructive",
        title: "Error saving subcategory",
        description: err.message || "Could not save the subcategory. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Functions
  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      setIsLoading(true);
      const relatedSubs = getSubcategories(categoryToDelete.id);
      
      if (relatedSubs.length > 0) {
        await adminApiService.deleteCategory(categoryToDelete.id, { 
          deleteSubcategories: true 
        });
        toast({ 
          title: "Category deleted", 
          description: `"${categoryToDelete.name}" and ${relatedSubs.length} subcategor${relatedSubs.length === 1 ? 'y' : 'ies'} have been removed successfully` 
        });
      } else {
        await adminApiService.deleteCategory(categoryToDelete.id);
        toast({ 
          title: `${getLevelDisplayName(categoryToDelete.level)} deleted`, 
          description: `"${categoryToDelete.name}" has been removed successfully` 
        });
      }
      
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      
      if (expandedCategories.has(categoryToDelete.id)) {
        const newExpanded = new Set(expandedCategories);
        newExpanded.delete(categoryToDelete.id);
        setExpandedCategories(newExpanded);
      }
      
    } catch (err: any) {
      console.error('❌ Failed to delete category:', err);
      toast({
        variant: "destructive",
        title: "Error deleting category",
        description: err.message || "Could not delete the category. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleBulkDeleteSubcategories = async (parentCategory: Category) => {
    const subcategories = getSubcategories(parentCategory.id);
    
    if (subcategories.length === 0) {
      toast({
        variant: "destructive",
        title: "No subcategories",
        description: "This category doesn't have any subcategories to delete."
      });
      return;
    }

    // Use the existing delete dialog for confirmation
    openDeleteDialog(parentCategory);
  };

  // Helper Functions
  const getLevelDisplayName = (level: number): string => {
    switch (level) {
      case 1: return 'Main Category';
      case 2: return 'Subcategory';
      case 3: return 'Item';
      default: return 'Category';
    }
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return <Folder className="h-4 w-4 text-blue-500" />;
      case 2: return <FolderTree className="h-4 w-4 text-green-500" />;
      case 3: return <Tag className="h-4 w-4 text-orange-500" />;
      default: return <Folder className="h-4 w-4 text-gray-500" />;
    }
  };

  const SkeletonRow = () => (
    <tr className="border-b hover:bg-muted/50">
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-muted rounded animate-pulse" />
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-32" />
        </div>
      </td>
      <td className="p-4 align-middle">
        <div className="h-4 bg-muted rounded animate-pulse w-20" />
      </td>
      <td className="p-4 align-middle">
        <div className="h-4 bg-muted rounded animate-pulse w-40" />
      </td>
      <td className="p-4 align-middle">
        <div className="h-6 bg-muted rounded animate-pulse w-12" />
      </td>
      <td className="p-4 align-middle">
        <div className="h-4 bg-muted rounded animate-pulse w-16" />
      </td>
      <td className="p-4 align-middle">
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </div>
      </td>
    </tr>
  );

  if (error && categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
            <p className="text-muted-foreground">Manage categories and subcategories for your products</p>
          </div>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Failed to load categories</p>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
          <p className="text-muted-foreground">Manage categories and subcategories for your products</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {/* <Button onClick={handleAddCategory} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Add Main Category
          </Button> */}
          <Button onClick={handleAddSubcategory} variant="outline" disabled={isLoading || topLevelCategories.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subcategory/Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground">All levels combined</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Category Breakdown</CardTitle>
            <FolderTree className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Folder className="h-3 w-3 text-blue-500" />
                    <span className="font-semibold">{totalLevel1}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FolderTree className="h-3 w-3 text-green-500" />
                    <span className="font-semibold">{totalLevel2}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-orange-500" />
                    <span className="font-semibold">{totalLevel3}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Level 1 • Level 2 • Level 3</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Main Categories</CardTitle>
            <Folder className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{totalLevel1}</div>
                <p className="text-xs text-muted-foreground">Top-level categories</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories Hierarchy</CardTitle>
          <CardDescription>
            Manage your product categories in a 3-level hierarchy: Main Categories → Subcategories → Items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Slug</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Level</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Children</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : paginatedCategories.length > 0 ? (
                  paginatedCategories.map(category => {
                    const categorySubs = getSubcategories(category.id);
                    const isExpanded = expandedCategories.has(category.id);
                    const canExpand = categorySubs.length > 0 && category.level < 3;
                    
                    return (
                      <React.Fragment key={category.id}>
                        {/* Category Row */}
                        <tr className="border-b hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              {canExpand && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => toggleCategory(category.id)}
                                  disabled={isLoading}
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                              {!canExpand && <div className="w-6" />}
                              {getLevelIcon(category.level)}
                              <span className="font-medium">{category.name}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                              {category.slug}
                            </code>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge variant={
                              category.level === 1 ? "default" : 
                              category.level === 2 ? "secondary" : "outline"
                            }>
                              {getLevelDisplayName(category.level)}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            {category.description || 'No description'}
                          </td>
                          <td className="p-4 align-middle">
                            <Badge variant="secondary">{categorySubs.length}</Badge>
                          </td>
                          <td className="p-4 align-middle text-muted-foreground">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => category.level === 1 ? handleEditCategory(category) : handleEditSubcategory(category)}
                                disabled={isLoading}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteDialog(category)}
                                disabled={isLoading}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                              {category.level === 1 && categorySubs.length > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleBulkDeleteSubcategories(category)}
                                  disabled={isLoading}
                                  title="Delete all subcategories"
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Subcategory Rows */}
                        {isExpanded && categorySubs.map(subcategory => (
                          <tr key={subcategory.id} className="border-b hover:bg-muted/30 bg-muted/20">
                            <td className="p-4 align-middle pl-12">
                              <div className="flex items-center gap-2">
                                {getLevelIcon(subcategory.level)}
                                <span>{subcategory.name}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                                {subcategory.slug}
                              </code>
                            </td>
                            <td className="p-4 align-middle">
                              <Badge variant={subcategory.level === 2 ? "secondary" : "outline"}>
                                {getLevelDisplayName(subcategory.level)}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle text-muted-foreground">
                              <span className="text-xs">{subcategory.description || 'No description'}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <Badge variant="outline">-</Badge>
                            </td>
                            <td className="p-4 align-middle text-muted-foreground">
                              {new Date(subcategory.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditSubcategory(subcategory)}
                                  disabled={isLoading}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDeleteDialog(subcategory)}
                                  disabled={isLoading}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No categories found</p>
                      <p className="text-sm">
                        {searchTerm ? "Try adjusting your search" : "Get started by adding your first category"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {paginatedCategories.length > 0 && (
            <div className="flex justify-between items-center py-4 mt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} categories
              </div>
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Main Category" : "Add New Main Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update main category details" : "Add a new main product category (Level 1)"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cat-name">Category Name *</Label>
                <Input
                  id="cat-name"
                  placeholder="e.g., Clothes"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cat-slug">Slug *</Label>
                <Input
                  id="cat-slug"
                  placeholder="e.g., clothes"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cat-description">Description</Label>
                <Textarea
                  id="cat-description"
                  placeholder="Category description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCategoryDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {editingCategory ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingCategory ? "Update Category" : "Add Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Subcategory Dialog */}
      <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSubcategory 
                ? `Edit ${getLevelDisplayName(editingSubcategory.level)}` 
                : 'Add New Subcategory/Item'
              }
            </DialogTitle>
            <DialogDescription>
              {editingSubcategory 
                ? `Update ${getLevelDisplayName(editingSubcategory.level).toLowerCase()} details`
                : 'Add a new subcategory (Level 2) or item (Level 3) under a parent category'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubcategorySubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="parent">Parent Category *</Label>
                <Select
                  value={subcategoryForm.parentId}
                  onValueChange={(value) => {
                    const selectedParent = categories.find(cat => cat.id === value);
                    const newLevel = selectedParent?.level === 1 ? 2 : 3;
                    setSubcategoryForm({ 
                      ...subcategoryForm, 
                      parentId: value,
                      level: newLevel
                    });
                  }}
                  disabled={isSubmitting || categories.length === 0}
                >
                  <SelectTrigger id="parent">
                    <SelectValue placeholder={categories.length === 0 ? "No categories available" : "Select parent category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Level 1 Categories */}
                    {topLevelCategories.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                          📁 Main Categories (Creates Level 2)
                        </div>
                        {topLevelCategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id} className="pl-6">
                            <div className="flex items-center gap-2">
                              <Folder className="h-3 w-3 text-blue-500" />
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                    
                    {/* Level 2 Categories */}
                    {level2Categories.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-2">
                          📂 Subcategories (Creates Level 3)
                        </div>
                        {level2Categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id} className="pl-6">
                            <div className="flex items-center gap-2">
                              <FolderTree className="h-3 w-3 text-green-500" />
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
                {subcategoryForm.parentId && (
                  <p className="text-xs text-muted-foreground">
                    This will create a {getLevelDisplayName(subcategoryForm.level).toLowerCase()} under the selected parent
                  </p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sub-name">
                  {getLevelDisplayName(subcategoryForm.level)} Name *
                </Label>
                <Input
                  id="sub-name"
                  placeholder={
                    subcategoryForm.level === 2 
                      ? "e.g., Men's Clothing" 
                      : "e.g., African Wear"
                  }
                  value={subcategoryForm.name}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sub-slug">Slug *</Label>
                <Input
                  id="sub-slug"
                  placeholder={
                    subcategoryForm.level === 2 
                      ? "e.g., mens-clothing" 
                      : "e.g., african-wear"
                  }
                  value={subcategoryForm.slug}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, slug: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sub-description">Description</Label>
                <Textarea
                  id="sub-description"
                  placeholder={
                    subcategoryForm.level === 2 
                      ? "Subcategory description" 
                      : "Item description"
                  }
                  value={subcategoryForm.description}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSubcategoryDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !subcategoryForm.parentId}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {editingSubcategory ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingSubcategory 
                    ? `Update ${getLevelDisplayName(editingSubcategory.level)}`
                    : `Add ${getLevelDisplayName(subcategoryForm.level)}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-xl">Delete Category</DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-base pt-2">
              {categoryToDelete && (
                <div className="space-y-3">
                  <p>
                    Are you sure you want to delete <strong className="text-foreground">"{categoryToDelete.name}"</strong>?
                  </p>
                  {getSubcategories(categoryToDelete.id).length > 0 && (
                    <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900">
                      <p className="text-sm text-amber-900 dark:text-amber-200 font-medium flex items-center gap-2">
                        <span>⚠️</span>
                        <span>This will also delete {getSubcategories(categoryToDelete.id).length} subcategor{getSubcategories(categoryToDelete.id).length === 1 ? 'y' : 'ies'}</span>
                      </p>
                    </div>
                  )}
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900">
                    <p className="text-sm text-red-900 dark:text-red-200 font-medium">
                      ⚠️ This action cannot be undone
                    </p>
                    <p className="text-xs text-red-800 dark:text-red-300 mt-1">
                      All category data and relationships will be permanently deleted.
                    </p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isLoading}
              className="sm:mr-2"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isLoading}
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;