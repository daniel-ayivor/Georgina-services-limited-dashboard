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
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService, { CleaningService } from '@/contexts/adminApiService';

// Predefined service types with their details
const PREDEFINED_SERVICE_TYPES = [
  {
    id: 'office-cleaning',
    name: 'office-cleaning',
    displayName: 'Office Cleaning',
    description: 'Professional cleaning service for offices and workspaces',
    defaultPrice: 299.99,
    defaultDuration: 5,
    defaultFeatures: ['Desk sanitization', 'Floor cleaning', 'Window cleaning', 'Restroom cleaning', 'Trash disposal']
  },
  {
    id: 'kitchen-cleaning',
    name: 'kitchen-cleaning',
    displayName: 'Kitchen Cleaning',
    description: 'Deep cleaning and sanitization of kitchen areas',
    defaultPrice: 199.99,
    defaultDuration: 3,
    defaultFeatures: ['Countertop cleaning', 'Appliance exterior cleaning', 'Sink sanitization', 'Cabinet wiping', 'Floor mopping']
  },
  {
    id: 'bathroom-cleaning',
    name: 'bathroom-cleaning',
    displayName: 'Bathroom Cleaning',
    description: 'Thorough cleaning and disinfection of bathroom facilities',
    defaultPrice: 149.99,
    defaultDuration: 2,
    defaultFeatures: ['Toilet sanitization', 'Shower/tub cleaning', 'Mirror polishing', 'Sink cleaning', 'Floor disinfection']
  },
  {
    id: 'dusting',
    name: 'dusting',
    displayName: 'Dusting Service',
    description: 'Comprehensive dusting of all surfaces and hard-to-reach areas',
    defaultPrice: 99.99,
    defaultDuration: 2,
    defaultFeatures: ['Surface dusting', 'Blind cleaning', 'Light fixture dusting', 'Furniture dusting', 'Decorative item cleaning']
  },
  {
    id: 'mopping',
    name: 'mopping',
    displayName: 'Mopping Service',
    description: 'Professional floor mopping and cleaning',
    defaultPrice: 79.99,
    defaultDuration: 1,
    defaultFeatures: ['Floor mopping', 'Stain removal', 'Corner cleaning', 'Baseboard wiping', 'Floor drying']
  },
  {
    id: 'vacuuming',
    name: 'vacuuming',
    displayName: 'Vacuuming Service',
    description: 'Thorough vacuuming of carpets and hard floors',
    defaultPrice: 89.99,
    defaultDuration: 2,
    defaultFeatures: ['Carpet vacuuming', 'Hard floor vacuuming', 'Under furniture cleaning', 'Stair vacuuming', 'Edge cleaning']
  }
];

// Define API response types
interface ApiResponseWithServices {
  services: CleaningService[];
}

interface ApiResponseWithData {
  data: CleaningService[];
}

type ApiResponse = CleaningService[] | ApiResponseWithServices | ApiResponseWithData;

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
    selectedServiceType: "",
    name: "",
    displayName: "",
    description: "",
    price: "",
    duration: "",
    features: "",
    status: "active"
  });

  // Fetch services from API - ADMIN ONLY
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // This calls the ADMIN endpoint to get all services
      const response = await adminApiService.getCleaningServices() as ApiResponse;
      
      // Handle different response structures with proper type checking
      let servicesData: CleaningService[] = [];
      
      if (Array.isArray(response)) {
        // Response is directly the array of services
        servicesData = response;
      } else if (response && 'services' in response) {
        // Response has a services property
        servicesData = response.services;
      } else if (response && 'data' in response) {
        // Response has a data property
        servicesData = response.data;
      }
      
      console.log('Fetched services:', servicesData);
      setServices(servicesData);
      
    } catch (err: any) {
      console.error('Failed to fetch services:', err);
      const errorMessage = err.message || 'Failed to load services data. Please try again.';
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

  // Handle service type selection
  const handleServiceTypeSelect = (serviceTypeId: string) => {
    const selectedService = PREDEFINED_SERVICE_TYPES.find(service => service.id === serviceTypeId);
    
    if (selectedService) {
      setServiceForm({
        selectedServiceType: serviceTypeId,
        name: selectedService.name,
        displayName: selectedService.displayName,
        description: selectedService.description,
        price: selectedService.defaultPrice.toString(),
        duration: selectedService.defaultDuration.toString(),
        features: selectedService.defaultFeatures.join(', '),
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
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Analytics calculations
  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 'active').length;
  const totalRevenuePotential = services.reduce((sum, service) => sum + service.price, 0);

  const handleAddService = () => {
    setEditingService(null);
    setServiceForm({
      selectedServiceType: "",
      name: "",
      displayName: "",
      description: "",
      price: "",
      duration: "",
      features: "",
      status: "active"
    });
    setServiceDialogOpen(true);
  };

  const handleEditService = (service: CleaningService) => {
    setEditingService(service);
    setServiceForm({
      selectedServiceType: service.name,
      name: service.name,
      displayName: service.displayName,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      features: Array.isArray(service.features) ? service.features.join(', ') : '',
      status: service.status
    });
    setServiceDialogOpen(true);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      // Call ADMIN API to delete service
      await adminApiService.deleteCleaningService(id);
      setServices(services.filter(service => service.id !== id));
      toast({ 
        title: "Service deleted", 
        description: "The service has been removed successfully" 
      });
    } catch (err: any) {
      console.error('Failed to delete service:', err);
      const errorMessage = err.message || 'Could not delete the service. Please try again.';
      toast({
        variant: "destructive",
        title: "Error deleting service",
        description: errorMessage,
      });
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceForm.name || !serviceForm.displayName || !serviceForm.price || !serviceForm.duration) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare service data for ADMIN API
      const serviceData = {
        name: serviceForm.name,
        displayName: serviceForm.displayName,
        description: serviceForm.description,
        price: parseFloat(serviceForm.price),
        duration: parseInt(serviceForm.duration),
        features: serviceForm.features.split(',').map(f => f.trim()).filter(f => f),
        status: serviceForm.status as 'active' | 'inactive'
      };

      if (editingService) {
        // Update existing service via ADMIN API
        const response = await adminApiService.updateCleaningService(editingService.id, serviceData);
        
        // Extract the service from response with proper type checking
        let updatedService: CleaningService;
        
        if (Array.isArray(response)) {
          updatedService = response[0];
        } else if (response && typeof response === 'object') {
          updatedService = (response as any).service || (response as any).data || response;
        } else {
          throw new Error('Invalid response format');
        }
        
        setServices(services.map(service => 
          service.id === editingService.id ? updatedService : service
        ));
        toast({ 
          title: "Service updated", 
          description: "Service has been updated successfully" 
        });
      } else {
        // Create new service via ADMIN API
        const response = await adminApiService.createCleaningService(serviceData);
        
        // Extract the service from response with proper type checking
        let newService: CleaningService;
        
        if (Array.isArray(response)) {
          newService = response[0];
        } else if (response && typeof response === 'object') {
          newService = (response as any).service || (response as any).data || response;
        } else {
          throw new Error('Invalid response format');
        }
        
        setServices([...services, newService]);
        toast({ 
          title: "Service added", 
          description: "Service has been added successfully" 
        });
      }
      
      setServiceDialogOpen(false);
    } catch (err: any) {
      console.error('Failed to save service:', err);
      const errorMessage = err.message || "Could not save the service. Please try again.";
      toast({
        variant: "destructive",
        title: "Error saving service",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      // Update service status via ADMIN API
      const response = await adminApiService.updateCleaningService(serviceId, { status: newStatus });
      
      // Extract the service from response with proper type checking
      let updatedService: CleaningService;
      
      if (Array.isArray(response)) {
        updatedService = response[0];
      } else if (response && typeof response === 'object') {
        updatedService = (response as any).service || (response as any).data || response;
      } else {
        throw new Error('Invalid response format');
      }
      
      setServices(services.map(service =>
        service.id === serviceId ? updatedService : service
      ));
      toast({
        title: "Service updated",
        description: `Service ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      });
    } catch (err: any) {
      console.error('Failed to update service status:', err);
      const errorMessage = err.message || "Could not update service status. Please try again.";
      toast({
        variant: "destructive",
        title: "Error updating service",
        description: errorMessage,
      });
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
                <div className="text-2xl font-bold">${totalRevenuePotential.toFixed(2)}</div>
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
                <TableHead>Service Name</TableHead>
                <TableHead>Description</TableHead>
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
                      <div>
                        <div className="font-medium">{service.displayName}</div>
                        <div className="text-sm text-muted-foreground">{service.name}</div>
                        {service.features && service.features.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Features: {Array.isArray(service.features) ? service.features.join(', ') : service.features}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-md">
                        {service.description}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${service.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{service.duration} hours</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={service.status === 'active' ? 'default' : 'secondary'}
                      >
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleServiceStatus(service.id, service.status)}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {editingService ? "Update service details" : "Select a service type and customize it"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleServiceSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select 
                  value={serviceForm.selectedServiceType} 
                  onValueChange={handleServiceTypeSelect}
                  disabled={isSubmitting || editingService !== null}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PREDEFINED_SERVICE_TYPES.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.displayName} - ${service.defaultPrice} ({service.defaultDuration} hours)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {editingService ? "Service type cannot be changed when editing" : "Select a service type to auto-fill the details"}
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={serviceForm.displayName}
                  onChange={(e) => setServiceForm({ ...serviceForm, displayName: e.target.value })}
                  placeholder="e.g., Basic Cleaning, Deep Cleaning"
                  required
                  disabled={isSubmitting}
                />
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
                    placeholder="0.00"
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
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    placeholder="2"
                    required
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
                  placeholder="e.g., Dusting, Vacuuming, Surface cleaning, Kitchen & bathroom"
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={serviceForm.status} 
                  onValueChange={(value) => setServiceForm({ ...serviceForm, status: value })}
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
                    {editingService ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingService ? "Update Service" : "Add Service"
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