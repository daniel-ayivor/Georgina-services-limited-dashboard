
import { Bell, Search, CheckCheck, Clock, Menu, MenuSquareIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/components/UserProfile";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { AppNotification } from '@/contexts/adminApiService';
import { useNotifications } from "@/contexts/useNotifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate based on search query type
      if (searchQuery.toUpperCase().startsWith('ORD-')) {
        // Navigate to order details
        navigate(`/admin/orders/${searchQuery}`);
      } else if (searchQuery.toUpperCase().startsWith('BOOK-') || searchQuery.toLowerCase().includes('booking')) {
        // Navigate to bookings
        navigate('/bookings');
      } else if (searchQuery.toLowerCase().includes('customer') || searchQuery.toLowerCase().includes('user')) {
        // Navigate to customers
        navigate('/users');
      } else {
        // Default: navigate to products page
        navigate('/products');
      }
      // Clear search after navigation
      setSearchQuery("");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '🛍️';
      case 'booking':
        return '📅';
      case 'contact':
        return '✉️';
      case 'product':
        return '📦';
      case 'system':
        return '⚙️';
      case 'info':
      case 'success':
        return '✅';
      case 'warning':
      case 'error':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    switch (notification.type) {
      case 'order':
        window.location.href = '/admin/orders';
        break;
      case 'booking':
        window.location.href = '/admin/bookings';
        break;
      case 'contact':
        window.location.href = '/admin/contact-messages';
        break;
      case 'product':
        window.location.href = '/admin/products';
        break;
      default:
        break;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Some time ago';
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile Menu Trigger - Only shows on small screens */}
        <SidebarTrigger className="md:hidden mr-2">
          <MenuSquareIcon className="h-5 w-5" />
        </SidebarTrigger>

        <div className="ml-auto flex items-center gap-2">
          <form className="hidden md:flex" onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders, products..."
                className="w-[200px] pl-8 md:w-[240px] lg:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 max-h-[80vh] overflow-y-auto">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="h-auto p-0 text-xs"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {isLoading ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`p-3 cursor-pointer border-b last:border-b-0 ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3 w-full">
                        <div className="flex-shrink-0 text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium ${
                              !notification.read ? 'text-blue-900 dark:text-blue-100' : 'text-foreground'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge 
                              variant="secondary" 
                              className="text-xs capitalize"
                            >
                              {notification.type}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(notification.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
              
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-xs text-center text-muted-foreground justify-center cursor-pointer"
                    onClick={() => window.location.href = '/admin/notifications'}
                  >
                    View all notifications
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </header>
  );
}