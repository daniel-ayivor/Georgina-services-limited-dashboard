import React, { useState, useEffect } from 'react';
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
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Clock, 
  RefreshCw,
  AlertCircle,
  Sparkles,
  Building2,
  Home,
  Droplets,
  Wind,
  Brush,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService from '@/contexts/adminApiService';

// Import the CORRECT CleaningService type from adminApiService
import type { CleaningService } from '@/contexts/adminApiService';

// Predefined service templates that match your backend model
const SERVICE_TEMPLATES = [
  {
    id: 'office-cleaning',
    name: 'office-cleaning',
    displayName: 'Office Cleaning',
    description: 'Professional office space cleaning and maintenance for businesses',
    defaultPrice: 150,
    defaultDuration: 3,
    defaultFeatures: [
      'Desk and workspace cleaning',
      'Floor mopping and vacuuming',
      'Trash and recycling removal',
      'Surface sanitizing',
      'Window cleaning'
    ],
    icon: 'building',
    category: 'commercial' as const
  },
  {
    id: 'kitchen-cleaning',
    name: 'kitchen-cleaning',
    displayName: 'Kitchen Cleaning',
    description: 'Thorough kitchen deep cleaning and degreasing service',
    defaultPrice: 200,
    defaultDuration: 4,
    defaultFeatures: [
      'Appliance deep cleaning',
      'Cabinet and drawer wiping',
      'Countertop sanitizing',
      'Floor scrubbing',
      'Sink and faucet polishing'
    ],
    icon: 'home',
    category: 'residential' as const
  },
  {
    id: 'bathroom-cleaning',
    name: 'bathroom-cleaning',
    displayName: 'Bathroom Cleaning',
    description: 'Complete bathroom sanitization and deep cleaning',
    defaultPrice: 100,
    defaultDuration: 2,
    defaultFeatures: [
      'Toilet cleaning and sanitizing',
      'Shower and tub scrubbing',
      'Mirror and glass polishing',
      'Floor mopping',
      'Fixture shining'
    ],
    icon: 'droplets',
    category: 'residential' as const
  },
  {
    id: 'dusting-service',
    name: 'dusting-service',
    displayName: 'Dusting Service',
    description: 'Comprehensive dusting for all surfaces and hard-to-reach areas',
    defaultPrice: 80,
    defaultDuration: 2,
    defaultFeatures: [
      'Furniture dusting',
      'Ceiling fan cleaning',
      'Baseboards and moldings',
      'Window sills and ledges',
      'Decorative items'
    ],
    icon: 'wind',
    category: 'residential' as const
  },
  {
    id: 'mopping-service',
    name: 'mopping-service',
    displayName: 'Mopping Service',
    description: 'Professional floor mopping and cleaning service',
    defaultPrice: 90,
    defaultDuration: 2,
    defaultFeatures: [
      'All hard floor surfaces',
      'Grout cleaning',
      'Stain removal',
      'Floor sanitizing',
      'Streak-free finish'
    ],
    icon: 'brush',
    category: 'residential' as const
  },
  {
    id: 'vacuuming-service',
    name: 'vacuuming-service',
    displayName: 'Vacuuming Service',
    description: 'Deep vacuuming for carpets, rugs, and upholstery',
    defaultPrice: 85,
    defaultDuration: 2,
    defaultFeatures: [
      'Carpet deep cleaning',
      'Upholstery vacuuming',
      'Rug cleaning',
      'Edge and corner cleaning',
      'Pet hair removal'
    ],
    icon: 'zap',
    category: 'residential' as const
  }
];
// Add: normalize backend responses into CleaningService
const normalizeService = (raw: any): CleaningService => {
  const statusFromRaw = (() => {
    if (!raw) return 'inactive' as 'active' | 'inactive';
    if (typeof raw.status === 'string') {
      const s = raw.status.toLowerCase();
      if (s === 'active' || s === 'inactive') return s as 'active' | 'inactive';
      if (s === 'enabled') return 'active';
      if (s === 'disabled') return 'inactive';
    }
    if (typeof raw.isActive === 'boolean') return raw.isActive ? 'active' : 'inactive';
    if (typeof raw.enabled === 'boolean') return raw.enabled ? 'active' : 'inactive';
    if (typeof raw.statusCode === 'number') return raw.statusCode === 1 ? 'active' : 'inactive';
    return 'inactive';
  })();

  const features = Array.isArray(raw?.features)
    ? raw.features
    : typeof raw?.features === 'string'
    ? raw.features.split(',').map((f: string) => f.trim()).filter(Boolean)
    : Array.isArray(raw?.featureList)
    ? raw.featureList
    : [];

  // Provide sensible defaults for fields required by the CleaningService type
  const nowIso = new Date().toISOString();

  return {
    id: raw?.id ?? raw?._id ?? String(raw?.name ?? ''),
    name: raw?.name ?? raw?.id ?? raw?._id ?? '',
    displayName: raw?.displayName ?? raw?.title ?? raw?.name ?? '',
    description: raw?.description ?? raw?.desc ?? raw?.details ?? '',
    price: Number(raw?.price ?? raw?.cost ?? raw?.amount ?? 0),
    duration: Number(raw?.duration ?? raw?.hours ?? 0),
    features,
    icon: raw?.icon ?? raw?.iconName ?? 'default-icon',
    category: (raw?.category ?? 'residential') as 'residential' | 'commercial' | 'specialized',
    displayOrder: Number(raw?.displayOrder ?? raw?.order ?? 0),
    status: statusFromRaw,
    // required timestamps (use backend values if present, otherwise use now)
    createdAt: raw?.createdAt ?? raw?.created_at ?? raw?.created ?? nowIso,
    updatedAt: raw?.updatedAt ?? raw?.updated_at ?? raw?.modified ?? raw?.updated ?? nowIso,
  };
};

const CreateServices = () => {
  const [services, setServices] = useState<CleaningService[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<CleaningService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [serviceForm, setServiceForm] = useState({
    selectedTemplate: "",
    name: "",
    displayName: "",
    description: "",
    price: "",
    duration: "",
    features: "",
    icon: "default-icon",
    category: "residential" as 'residential' | 'commercial' | 'specialized',
    displayOrder: "0",
    status: "active" as 'active' | 'inactive'
  });

  // Fetch services from backend
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // treat response as unknown and normalize
      const response: any = await adminApiService.getCleaningServices();
      console.log('API Response:', response);

      let servicesData: any[] = [];

      if (Array.isArray(response)) {
        servicesData = response;
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) {
          servicesData = response.data;
        } else if (Array.isArray(response.services)) {
          servicesData = response.services;
        } else if (response.data && Array.isArray(response.data.services)) {
          servicesData = response.data.services;
        } else if (Array.isArray(response.items)) {
          servicesData = response.items;
        } else if (Array.isArray(response.results)) {
          servicesData = response.results;
        } else {
          servicesData = [response];
        }
      }

      const normalized = servicesData.map(normalizeService);
      console.log('Processed services:', normalized);
      setServices(normalized);
      
    } catch (err: any) {
      console.error('Failed to fetch services:', err);
      const errorMessage = err?.message || 'Failed to load services. Please check your API connection.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = SERVICE_TEMPLATES.find(template => template.id === templateId);
    
    if (selectedTemplate) {
      setServiceForm({
        selectedTemplate: templateId,
        name: selectedTemplate.name,
        displayName: selectedTemplate.displayName,
        description: selectedTemplate.description,
        price: selectedTemplate.defaultPrice.toString(),
        duration: selectedTemplate.defaultDuration.toString(),
        features: selectedTemplate.defaultFeatures.join(', '),
        icon: selectedTemplate.icon,
        category: selectedTemplate.category,
        displayOrder: "0",
        status: "active"
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services
  const filteredServices = services.filter(service =>
    service.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Analytics calculations
  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 'active').length;
  const totalRevenuePotential = services.reduce((sum, service) => sum + service.price, 0);

  const handleAddService = () => {
    setEditingService(null);
    setServiceForm({
      selectedTemplate: "",
      name: "",
      displayName: "",
      description: "",
      price: "",
      duration: "",
      features: "",
      icon: "default-icon",
      category: "residential",
      displayOrder: "0",
      status: "active"
    });
    setServiceDialogOpen(true);
  };

  const handleEditService = (service: CleaningService) => {
    setEditingService(service);
    setServiceForm({
      selectedTemplate: service.name,
      name: service.name,
      displayName: service.displayName,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      features: Array.isArray(service.features) ? service.features.join(', ') : '',
      icon: service.icon || 'default-icon',
      category: service.category,
      displayOrder: service.displayOrder.toString(),
      status: service.status
    });
    setServiceDialogOpen(true);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      await adminApiService.deleteCleaningService(id);
      setServices(services.filter(service => service.id !== id));
      toast({ 
        title: "Service deleted", 
        description: "The service has been removed successfully" 
      });
    } catch (err: any) {
      console.error('Failed to delete service:', err);
      toast({
        variant: "destructive",
        title: "Error deleting service",
        description: err.message,
      });
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!serviceForm.name || !serviceForm.displayName || !serviceForm.price || !serviceForm.duration) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields (Name, Display Name, Price, Duration)"
      });
      return;
    }

    if (parseFloat(serviceForm.price) < 0) {
      toast({
        variant: "destructive",
        title: "Invalid price",
        description: "Price cannot be negative"
      });
      return;
    }

    if (parseInt(serviceForm.duration) < 1) {
      toast({
        variant: "destructive",
        title: "Invalid duration",
        description: "Duration must be at least 1 hour"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceData = {
        name: serviceForm.name.trim(),
        displayName: serviceForm.displayName.trim(),
        description: serviceForm.description.trim(),
        price: parseFloat(serviceForm.price),
        duration: parseInt(serviceForm.duration),
        features: serviceForm.features.split(',').map(f => f.trim()).filter(f => f),
        icon: serviceForm.icon,
        category: serviceForm.category,
        displayOrder: parseInt(serviceForm.displayOrder),
        status: serviceForm.status
      };

      if (editingService) {
        // Update existing service
        const response: any = await adminApiService.updateCleaningService(editingService.id, serviceData);
        const rawUpdated = response?.data ?? response?.service ?? response;
        const updatedService: CleaningService = normalizeService(rawUpdated);
        
        setServices(prev => prev.map(s => s.id === editingService.id ? updatedService : s));
        toast({ 
          title: "Service updated", 
          description: "Service has been updated successfully" 
        });
      } else {
        // Create new service
        const response: any = await adminApiService.createCleaningService(serviceData);
        const rawNew = response?.data ?? response?.service ?? response;
        const newService: CleaningService = normalizeService(rawNew);
        
        setServices(prev => [...prev, newService]);
        toast({ 
          title: "Service created", 
          description: "Service has been added successfully" 
        });
      }
      
      setServiceDialogOpen(false);
    } catch (err: any) {
      console.error('Failed to save service:', err);
      toast({
        variant: "destructive",
        title: "Error saving service",
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleServiceStatus = async (service: CleaningService) => {
    try {
      const newStatus = service.status === 'active' ? 'inactive' : 'active';
      
      const response: any = await adminApiService.updateCleaningServiceStatus(service.id, newStatus);
      const rawUpdated = response?.data ?? response?.service ?? response;
      const updatedService: CleaningService = normalizeService(rawUpdated);
      
      setServices(prev => prev.map(s => s.id === service.id ? updatedService : s));
      
      toast({
        title: "Service updated",
        description: `Service ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      });
    } catch (err: any) {
      console.error('Failed to update service status:', err);
      toast({
        variant: "destructive",
        title: "Error updating service",
        description: err?.message,
      });
    }
  };

  // Icon component mapping
  const getIconComponent = (iconName: string) => {
    const iconProps = { className: "h-4 w-4" };
    switch (iconName) {
      case 'building': return <Building2 {...iconProps} />;
      case 'home': return <Home {...iconProps} />;
      case 'droplets': return <Droplets {...iconProps} />;
      case 'wind': return <Wind {...iconProps} />;
      case 'brush': return <Brush {...iconProps} />;
      case 'zap': return <Zap {...iconProps} />;
      default: return <Sparkles {...iconProps} />;
    }
  };

  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-24" />
          <div className="h-3 bg-muted rounded animate-pulse w-32" />
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded animate-pulse w-20" />
      </TableCell>
      <TableCell>
        <div className="h-4 bg-muted rounded animate-pulse w-12" />
      </TableCell>
      <TableCell>
        <div className="h-6 bg-muted rounded animate-pulse w-16" />
      </TableCell>
      <TableCell>
        <div className="h-8 bg-muted rounded animate-pulse w-32 ml-auto" />
      </TableCell>
    </TableRow>
  );

  if (error && services.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cleaning Services</h1>
            <p className="text-muted-foreground">Manage your cleaning service offerings</p>
          </div>
          <Button onClick={fetchServices} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Failed to load data</p>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchServices}>
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
          <h1 className="text-3xl font-bold tracking-tight">Cleaning Services</h1>
          <p className="text-muted-foreground">Manage your cleaning service offerings and pricing</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchServices} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddService} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{totalServices}</div>
                <p className="text-xs text-muted-foreground">Service offerings</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{activeServices}</div>
                <p className="text-xs text-muted-foreground">Available for booking</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
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
                <div className="text-2xl font-bold">${(totalRevenuePotential ?? 0).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total service value</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Service Catalog</CardTitle>
          <CardDescription>Manage your cleaning service offerings and pricing</CardDescription>
          <div className="relative w-full md:w-96 mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : filteredServices.length > 0 ? (
                filteredServices.map(service => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getIconComponent(service.icon || 'default-icon')}
                        </div>
                        <div>
                          <div className="font-medium">{service.displayName}</div>
                          <div className="text-sm text-muted-foreground">{service.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">${(service.price ?? 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{service.duration} hrs</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={service.status === 'active' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleServiceStatus(service)}
                          disabled={isLoading}
                        >
                          {service.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditService(service)}
                          disabled={isLoading}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-lg font-medium">No services found</p>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? "Try adjusting your search terms" : "Add your first service to get started"}
                    </p>
                    <Button onClick={handleAddService} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Service
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Service Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService ? "Update service details" : "Create a new cleaning service offering"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleServiceSubmit}>
            <div className="grid gap-4 py-4">
              {/* Service Template Selection */}
              {!editingService && (
                <div className="grid gap-2">
                  <Label htmlFor="template">Quick Start Template (Optional)</Label>
                  <Select 
                    value={serviceForm.selectedTemplate} 
                    onValueChange={handleTemplateSelect}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service template" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TEMPLATES.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center gap-2">
                            {getIconComponent(template.icon)}
                            {template.displayName} - ${template.defaultPrice}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select a template to auto-fill common service details
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Service ID *</Label>
                  <Input
                    id="name"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    placeholder="office-cleaning"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">Unique identifier (lowercase, hyphens)</p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    value={serviceForm.displayName}
                    onChange={(e) => setServiceForm({ ...serviceForm, displayName: e.target.value })}
                    placeholder="Office Cleaning"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="150.00"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (hours) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="8"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    placeholder="3"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={serviceForm.category} 
                    onValueChange={(value: any) => setServiceForm({ ...serviceForm, category: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="specialized">Specialized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    min="0"
                    value={serviceForm.displayOrder}
                    onChange={(e) => setServiceForm({ ...serviceForm, displayOrder: e.target.value })}
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Describe the service and what it includes..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="features">Features (comma separated)</Label>
                <Textarea
                  id="features"
                  value={serviceForm.features}
                  onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                  placeholder="Desk cleaning, Floor mopping, Window cleaning, Trash removal"
                  rows={3}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">Separate each feature with a comma</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={serviceForm.status} 
                  onValueChange={(value: any) => setServiceForm({ ...serviceForm, status: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setServiceDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {editingService ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  editingService ? "Update Service" : "Create Service"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateServices;