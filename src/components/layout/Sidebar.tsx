
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { 
  BarChartBig, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  CalendarCheck,
  WrapText,
  FolderTree,
  MessageCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
}

function SidebarItem({ icon: Icon, label, path, active }: SidebarItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={label}>
        <Link to={path} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function DashboardSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { state } = useSidebar();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-col items-center justify-center py-6">
        <div className={cn(
          "transition-opacity duration-200",
          state === "collapsed" ? "opacity-0" : "opacity-100"
        )}>
          <h1 className="text-2xl font-bold">E-Commerce</h1>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full justify-between">
        <div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarItem 
                  icon={BarChartBig} 
                  label="Dashboard" 
                  path="/dashboard" 
                  active={isActive("/dashboard") || isActive("/")} 
                />
                <SidebarItem 
                  icon={Package} 
                  label="Products" 
                  path="/products" 
                  active={isActive("/products")} 
                />
                <SidebarItem 
                  icon={FolderTree} 
                  label="Categories" 
                  path="/categories" 
                  active={isActive("/categories")} 
                />
                <SidebarItem 
                  icon={ShoppingCart} 
                  label="Orders" 
                  path="/orders" 
                  active={isActive("/orders")} 
                />
                <SidebarItem 
                  icon={CalendarCheck} 
                  label="Bookings" 
                  path="/bookings" 
                  active={isActive("/bookings")} 
                />
                  <SidebarItem 
                  icon={WrapText} 
                  label="Create Services" 
                  path="/create-service" 
                  active={isActive("/create-services")} 
                />
                <SidebarItem 
                  icon={BarChartBig} 
                  label="Analytics" 
                  path="/analytics" 
                  active={isActive("/analytics")} 
                />
                <SidebarItem 
                  icon={Users} 
                  label="Customers" 
                  path="/customers" 
                  active={isActive("/customers")} 
                />
                      <SidebarItem 
                  icon={MessageCircle} 
                  label="Contacts" 
                  path="/contacts" 
                  active={isActive("/contacts")} 
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup className="mt-auto pt-6">
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarItem 
                  icon={Settings} 
                  label="Settings" 
                  path="/settings" 
                  active={isActive("/settings")} 
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
