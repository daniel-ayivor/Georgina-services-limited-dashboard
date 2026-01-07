

// export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Bookings from "./pages/Bookings";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import CreateServices from "./pages/CreateService";
import ContactMessagesAdmin from "./pages/Contacts";
import ProductDetails from "./pages/ProductDetails";
import ProductEdit from "./pages/ProductEdit";
import Customers from "./pages/Customer";
import OrderDetailsPage from "./pages/OrderDeatils";
import Reviews from "./pages/Review";
import BookingDetails from "./pages/BookingDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/admin/products" element={<Products />} />
                  <Route path="/admin/products/:id" element={<ProductDetails />} />
                  <Route path="/admin/products/:id/edit" element={<ProductEdit />} />
                   <Route path="/review" element={<Reviews />} />
                   <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/admin/orders/:orderId" element={<OrderDetailsPage />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/admin/bookings/:id" element={<BookingDetails />} />
                  <Route path="/contacts" element={<ContactMessagesAdmin />} />
                  <Route path="/create-service" element={<CreateServices/>} />
                   <Route path="/users" element={<Customers />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>
              
              {/* Redirect root to login for unauthenticated users */}
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch all - redirect to login */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;