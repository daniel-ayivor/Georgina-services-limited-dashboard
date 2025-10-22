import React, { useState } from 'react';
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
import { Search, Plus, Edit, Trash2, Folder, FolderTree, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const { toast } = useToast();

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

  const handleDeleteCategory = (id: string) => {
    const relatedSubs = subcategories.filter(sub => sub.parentId === id);
    if (relatedSubs.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot delete",
        description: "Please delete all subcategories first"
      });
      return;
    }
    setCategories(categories.filter(cat => cat.id !== id));
    toast({ title: "Category deleted", description: "Category has been removed successfully" });
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.name || !categoryForm.slug) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields"
      });
      return;
    }

    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? {
          ...cat,
          name: categoryForm.name,
          description: categoryForm.description,
          slug: categoryForm.slug
        } : cat
      ));
      toast({ title: "Category updated", description: "Category has been updated successfully" });
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name,
        description: categoryForm.description,
        slug: categoryForm.slug,
        createdAt: new Date()
      };
      setCategories([...categories, newCategory]);
      toast({ title: "Category added", description: "Category has been added successfully" });
    }
    setCategoryDialogOpen(false);
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

  const handleDeleteSubcategory = (id: string) => {
    setSubcategories(subcategories.filter(sub => sub.id !== id));
    toast({ title: "Subcategory deleted", description: "Subcategory has been removed successfully" });
  };

  const handleSubcategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subcategoryForm.name || !subcategoryForm.parentId || !subcategoryForm.slug) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields"
      });
      return;
    }

    if (editingSubcategory) {
      setSubcategories(subcategories.map(sub => 
        sub.id === editingSubcategory.id ? {
          ...sub,
          name: subcategoryForm.name,
          parentId: subcategoryForm.parentId,
          slug: subcategoryForm.slug
        } : sub
      ));
      toast({ title: "Subcategory updated", description: "Subcategory has been updated successfully" });
    } else {
      const newSubcategory: Subcategory = {
        id: `sub-${Date.now()}`,
        parentId: subcategoryForm.parentId,
        name: subcategoryForm.name,
        slug: subcategoryForm.slug,
        createdAt: new Date()
      };
      setSubcategories([...subcategories, newSubcategory]);
      toast({ title: "Subcategory added", description: "Subcategory has been added successfully" });
    }
    setSubcategoryDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Categories</h1>
          <p className="text-muted-foreground">Manage categories and subcategories for your products</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
          <Button onClick={handleAddSubcategory} variant="outline">
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

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.map(category => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5" />
                    {category.name}
                    <Badge variant="secondary">{getSubcategories(category.id).length} subcategories</Badge>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                  <p className="text-xs text-muted-foreground">Slug: {category.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {getSubcategories(category.id).map(subcategory => (
                  <div key={subcategory.id} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
                    <FolderTree className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{subcategory.name}</span>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleEditSubcategory(subcategory)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleDeleteSubcategory(subcategory.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {getSubcategories(category.id).length === 0 && (
                  <p className="text-sm text-muted-foreground">No subcategories yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
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
              <Button type="button" variant="outline" onClick={() => setSubcategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
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
