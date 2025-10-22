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
import { Search, Plus, Edit, Trash2, Folder, FolderTree, Tag, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCategories, createCategory, updateCategory, deleteCategory, getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image?: string;
  createdAt: Date;
}

interface Subcategory {
  id: string;
  parentId: string;
  name: string;
  slug: string;
  createdAt: Date;
}

const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Men Clothes',
    description: 'Clothing for men',
    slug: 'men-clothes',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'cat-2',
    name: 'Women Clothes',
    description: 'Clothing for women',
    slug: 'women-clothes',
    createdAt: new Date('2024-01-02')
  }
];

const initialSubcategories: Subcategory[] = [
  {
    id: 'sub-1',
    parentId: 'cat-1',
    name: 'Suits',
    slug: 'suits',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'sub-2',
    parentId: 'cat-1',
    name: 'Casual Wear',
    slug: 'casual-wear',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'sub-3',
    parentId: 'cat-2',
    name: 'Dresses',
    slug: 'dresses',
    createdAt: new Date('2024-01-02')
  }
];

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, subcategoriesData] = await Promise.all([
        getCategories(),
        getSubCategories()
      ]);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load categories and subcategories"
      });
    } finally {
      setLoading(false);
    }
  };

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    slug: ""
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    parentId: "",
    slug: ""
  });

  // Filter categories
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get subcategories for a category
  const getSubcategories = (categoryId: string) => {
    return subcategories.filter(sub => sub.parentId === categoryId);
  };

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

  // Stats
  const totalCategories = categories.length;
  const totalSubcategories = subcategories.length;

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "", slug: "" });
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      slug: category.slug
    });
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    const relatedSubs = subcategories.filter(sub => sub.parentId === id);
    if (relatedSubs.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot delete",
        description: "Please delete all subcategories first"
      });
      return;
    }
    
    try {
      setSaving(true);
      await deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      toast({ title: "Category deleted", description: "Category has been removed successfully" });
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category"
      });
    } finally {
      setSaving(false);
    }
  };

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

    try {
      setSaving(true);
      if (editingCategory) {
        const updatedCategory = await updateCategory(editingCategory.id, {
          name: categoryForm.name,
          description: categoryForm.description,
          slug: categoryForm.slug
        });
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? updatedCategory : cat
        ));
        toast({ title: "Category updated", description: "Category has been updated successfully" });
      } else {
        const newCategory = await createCategory({
          name: categoryForm.name,
          description: categoryForm.description,
          slug: categoryForm.slug
        });
        setCategories([...categories, newCategory]);
        toast({ title: "Category added", description: "Category has been added successfully" });
      }
      setCategoryDialogOpen(false);
    } catch (error) {
      console.error('Failed to save category:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save category"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubcategory = () => {
    setEditingSubcategory(null);
    setSubcategoryForm({ name: "", parentId: "", slug: "" });
    setSubcategoryDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryForm({
      name: subcategory.name,
      parentId: subcategory.parentId,
      slug: subcategory.slug
    });
    setSubcategoryDialogOpen(true);
  };

  const handleDeleteSubcategory = async (id: string) => {
    try {
      setSaving(true);
      await deleteSubCategory(id);
      setSubcategories(subcategories.filter(sub => sub.id !== id));
      toast({ title: "Subcategory deleted", description: "Subcategory has been removed successfully" });
    } catch (error) {
      console.error('Failed to delete subcategory:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete subcategory"
      });
    } finally {
      setSaving(false);
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

    try {
      setSaving(true);
      if (editingSubcategory) {
        const updatedSubcategory = await updateSubCategory(editingSubcategory.id, {
          name: subcategoryForm.name,
          parentId: subcategoryForm.parentId,
          slug: subcategoryForm.slug
        });
        setSubcategories(subcategories.map(sub => 
          sub.id === editingSubcategory.id ? updatedSubcategory : sub
        ));
        toast({ title: "Subcategory updated", description: "Subcategory has been updated successfully" });
      } else {
        const newSubcategory = await createSubCategory({
          name: subcategoryForm.name,
          parentId: subcategoryForm.parentId,
          slug: subcategoryForm.slug
        });
        setSubcategories([...subcategories, newSubcategory]);
        toast({ title: "Subcategory added", description: "Subcategory has been added successfully" });
      }
      setSubcategoryDialogOpen(false);
    } catch (error) {
      console.error('Failed to save subcategory:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save subcategory"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading categories...</span>
        </div>
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
          <Button onClick={handleAddCategory} disabled={saving}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <Button onClick={handleAddSubcategory} variant="outline" disabled={saving}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subcategory
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">Main categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subcategories</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubcategories}</div>
            <p className="text-xs text-muted-foreground">All subcategories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories + totalSubcategories}</div>
            <p className="text-xs text-muted-foreground">Combined total</p>
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
        />
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories & Subcategories</CardTitle>
          <CardDescription>
            Manage your product categories and their subcategories in a structured table format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Slug</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Subcategories</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map(category => {
                  const categorySubs = getSubcategories(category.id);
                  const isExpanded = expandedCategories.has(category.id);
                  
                  return (
                    <React.Fragment key={category.id}>
                      {/* Category Row */}
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => toggleCategory(category.id)}
                              disabled={categorySubs.length === 0}
                            >
                              {categorySubs.length > 0 ? (
                                isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )
                              ) : (
                                <Folder className="h-4 w-4" />
                              )}
                            </Button>
                            <Folder className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                            {category.slug}
                          </code>
                        </td>
                        <td className="p-4 align-middle">{category.description}</td>
                        <td className="p-4 align-middle">
                          <Badge variant="secondary">{categorySubs.length}</Badge>
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {category.createdAt.toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* Subcategory Rows */}
                      {isExpanded && categorySubs.map(subcategory => (
                        <tr key={subcategory.id} className="border-b hover:bg-muted/30 bg-muted/20">
                          <td className="p-4 align-middle pl-12">
                            <div className="flex items-center gap-2">
                              <FolderTree className="h-4 w-4 text-muted-foreground" />
                              <span>{subcategory.name}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                              {subcategory.slug}
                            </code>
                          </td>
                          <td className="p-4 align-middle text-muted-foreground">
                            <span className="text-xs">Subcategory of {category.name}</span>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge variant="outline">Subcategory</Badge>
                          </td>
                          <td className="p-4 align-middle text-muted-foreground">
                            {subcategory.createdAt.toLocaleDateString()}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSubcategory(subcategory)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSubcategory(subcategory.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {filteredCategories.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No categories found</p>
                <p className="text-sm">Try adjusting your search or add a new category</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update category details" : "Add a new product category"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cat-name">Category Name *</Label>
                <Input
                  id="cat-name"
                  placeholder="e.g., Men Clothes"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cat-slug">Slug *</Label>
                <Input
                  id="cat-slug"
                  placeholder="e.g., men-clothes"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cat-description">Description</Label>
                <Textarea
                  id="cat-description"
                  placeholder="Category description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCategory ? "Update" : "Add"} Category
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
              {editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}
            </DialogTitle>
            <DialogDescription>
              {editingSubcategory ? "Update subcategory details" : "Add a new subcategory under a parent category"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubcategorySubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="parent">Parent Category *</Label>
                <Select
                  value={subcategoryForm.parentId}
                  onValueChange={(value) => setSubcategoryForm({ ...subcategoryForm, parentId: value })}
                >
                  <SelectTrigger id="parent">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sub-name">Subcategory Name *</Label>
                <Input
                  id="sub-name"
                  placeholder="e.g., Suits"
                  value={subcategoryForm.name}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sub-slug">Slug *</Label>
                <Input
                  id="sub-slug"
                  placeholder="e.g., suits"
                  value={subcategoryForm.slug}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, slug: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSubcategoryDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingSubcategory ? "Update" : "Add"} Subcategory
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;