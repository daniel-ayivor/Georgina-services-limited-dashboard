
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored auth data on component mount
    const storedUser = localStorage.getItem("e-commerce-admin-user");
    const storedToken = localStorage.getItem("e-commerce-admin-token");
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      apiService.setToken(storedToken);
      
      // Verify token is still valid by fetching user info
      apiService.getUserInfo()
        .then(userData => {
          // If role is not admin, log them out
          if (userData.role !== 'admin') {
            logout();
            toast({
              variant: "destructive",
              title: "Access denied",
              description: "You don't have admin privileges.",
            });
          }
        })
        .catch(() => {
          // If token is invalid, log them out
          logout();
        });
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.login(email, password);
      
      // Verify user is an admin
      if (response.user.role !== 'admin') {
        toast({
          variant: "destructive",
          title: "Access denied",
          description: "You don't have admin privileges.",
        });
        throw new Error("Access denied: Admin privileges required");
      }
      
      // Store user data and token
      setUser(response.user);
      apiService.setToken(response.token);
      localStorage.setItem("e-commerce-admin-user", JSON.stringify(response.user));
      localStorage.setItem("e-commerce-admin-token", response.token);
      
      toast({
        title: "Login successful",
        description: "Welcome back to the dashboard!",
      });
    } catch (err) {
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

  const logout = () => {
    setUser(null);
    apiService.clearToken();
    localStorage.removeItem("e-commerce-admin-user");
    localStorage.removeItem("e-commerce-admin-token");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
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
