import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import adminApiService, { User } from "./adminApiService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{
    success: boolean;
    message: string;
    user?: User;
  }>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const initializedRef = useRef(false);

  const logout = () => {
    console.log("Logout called");
    console.trace("Logout trace:"); // See where logout is called from
    setUser(null);
    setError(null);
    adminApiService.clearToken();
    localStorage.removeItem("e-commerce-admin-user");
    localStorage.removeItem("e-commerce-admin-token");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (initializedRef.current) {
      console.log("Auth already initialized, skipping");
      return;
    }
    initializedRef.current = true;

    console.log("=== Auth Initialization Started ===");
    
    const storedUser = localStorage.getItem("e-commerce-admin-user");
    const storedToken = localStorage.getItem("e-commerce-admin-token");
    
    console.log("Stored user exists:", !!storedUser);
    console.log("Stored token exists:", !!storedToken);
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        console.log("Parsed user data:", userData.email, "Role:", userData.role);
        
        // Set token in API service
        adminApiService.setToken(storedToken);
        
        // Set user state
        setUser(userData);
        
        console.log("✅ User restored successfully");
      } catch (error) {
        console.error("❌ Error parsing stored user data:", error);
        localStorage.removeItem("e-commerce-admin-user");
        localStorage.removeItem("e-commerce-admin-token");
      }
    } else {
      console.log("No stored credentials found");
    }
    
    setIsLoading(false);
    console.log("=== Auth Initialization Complete ===");
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Login attempt for:", email);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await adminApiService.login(email, password);
      console.log("Login response received:", response);
      
      const userData = response.admin;
      const token = response.token;
      
      if (!userData || !token) {
        throw new Error("Invalid response format from server");
      }

      if (userData.role !== 'admin') {
        console.log("❌ User is not admin, role:", userData.role);
        toast({
          variant: "destructive",
          title: "Access denied",
          description: "You don't have admin privileges.",
        });
        throw new Error("Access denied: Admin privileges required");
      }
      
      console.log("✅ Login successful, setting user state");
      
      // Set user state FIRST
      setUser(userData);
      
      // Then set token and localStorage
      adminApiService.setToken(token);
      localStorage.setItem("e-commerce-admin-user", JSON.stringify(userData));
      localStorage.setItem("e-commerce-admin-token", token);
      
      console.log("User and token saved to localStorage");
      
      toast({
        title: "Login successful",
        description: "Welcome back to the dashboard!",
      });
    } catch (err) {
      console.error("❌ Login failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Corrected changePassword function
  const changePassword = async (currentPassword: string, newPassword: string): Promise<{
    success: boolean;
    message: string;
    user?: User;
  }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🔑 Changing password...");
      
      // Correct usage of adminApiService.changePassword()
      const response = await adminApiService.changePassword(currentPassword, newPassword);
      
      console.log("✅ Password change response:", response);
      
      if (response.success) {
        // Update user in state if needed
        if (response.admin) {
          setUser(response.admin);
          localStorage.setItem("e-commerce-admin-user", JSON.stringify(response.admin));
        }
        
        toast({
          title: "Password updated",
          description: "Your password has been changed successfully.",
        });
        
        return {
          success: response.success,
          message: response.message,
          user: response.admin
        };
      } else {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (err) {
      console.error("❌ Password change failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Password change failed. Please try again.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Password change failed",
        description: errorMessage,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  console.log("AuthProvider render - isAuthenticated:", !!user, "isLoading:", isLoading);

  return (
    <AuthContext.Provider value={{ 
      changePassword,
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};