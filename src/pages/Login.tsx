
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import ecommerceBg from "@/assets/ecommerce-bg.jpg";
import { LoginForm } from "@/components/LoginForm";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fade-in"
        style={{ backgroundImage: `url(${ecommerceBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70 backdrop-blur-[2px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen grid md:grid-cols-2 items-center">
        <div className="hidden md:flex flex-col p-10 text-primary-foreground animate-slide-in-left">
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            {/*<h1 className="text-5xl font-bold tracking-tight mb-4 animate-fade-in">*/}
            {/*  E-Commerce Dashboard*/}
            {/*</h1>*/}
            <div className="p-2 bg-white rounded-md w-fit mb-6">
              <img
              src="/gina_logo.png"
              alt="Gina E-Commerce Logo"
              className="h-16 animate-fade-in [animation-delay:100ms]"
              />
            </div>
            <p className="text-xl text-primary-foreground/90 mb-12 animate-fade-in [animation-delay:200ms]">
              Manage your products, orders, and customer data all in one place.
            </p>
            <div className="grid gap-8 animate-fade-in [animation-delay:400ms]">
              <div className="flex items-center gap-6 hover:translate-x-2 transition-transform duration-300">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                  <svg 
                    className="h-7 w-7" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Product Management</h3>
                  <p className="text-primary-foreground/80">Add, update, and track your inventory</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 hover:translate-x-2 transition-transform duration-300">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                  <svg 
                    className="h-7 w-7" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Order Tracking</h3>
                  <p className="text-primary-foreground/80">Process orders and update delivery status</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 hover:translate-x-2 transition-transform duration-300">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                  <svg 
                    className="h-7 w-7" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Analytics & Reporting</h3>
                  <p className="text-primary-foreground/80">Gain insights with detailed sales reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col p-4 md:p-10 animate-slide-in-right">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-scale-in [animation-delay:600ms]">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
