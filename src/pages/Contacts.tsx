import { useState, useEffect } from "react";
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
import { Search, Mail, Trash2, RefreshCw, MessageSquare, Clock, User, AlertCircle, ExternalLink } from "lucide-react";
import adminApiService, { ContactMessage } from '@/contexts/adminApiService';
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminApiService.getAllContactMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages. Please try again.');
      toast({
        variant: "destructive",
        title: "Error loading messages",
        description: "Could not fetch contact messages.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter(
    (message) =>
      (message.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (message.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (message.message?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Stats calculations
  const totalMessages = messages.length;
  const todayMessages = messages.filter(msg => {
    const messageDate = new Date(msg.createdAt);
    const today = new Date();
    return messageDate.toDateString() === today.toDateString();
  }).length;

  const weekMessages = messages.filter(msg => {
    const messageDate = new Date(msg.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return messageDate >= weekAgo;
  }).length;

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setDialogOpen(true);
  };

  const handleDeleteMessage = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await adminApiService.deleteContactMessage(id);
      setMessages(messages.filter((msg) => msg.id !== id));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
        setDialogOpen(false);
      }

      toast({
        title: "Message deleted",
        description: "The message has been removed successfully"
      });
    } catch (err) {
      console.error('Failed to delete message:', err);
      toast({
        variant: "destructive",
        title: "Error deleting message",
        description: "Could not delete the message. Please try again.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      if (hours === 0) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      }
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const SkeletonRow = () => (
    <tr className="border-b">
      <td className="p-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-32" />
          <div className="h-3 bg-muted rounded animate-pulse w-48" />
        </div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-muted rounded animate-pulse w-40" />
      </td>
      <td className="p-4">
        <div className="h-4 bg-muted rounded animate-pulse w-64" />
      </td>
      <td className="p-4">
        <div className="h-4 bg-muted rounded animate-pulse w-24" />
      </td>
      <td className="p-4">
        <div className="flex justify-end gap-2">
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
        </div>
      </td>
    </tr>
  );

  if (error && messages.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
          <Button onClick={fetchMessages} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Failed to load messages</p>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchMessages}>
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
        <Button onClick={fetchMessages} variant="outline" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{totalMessages}</div>
                <p className="text-xs text-muted-foreground">All time messages</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
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
                <div className="text-2xl font-bold">{weekMessages}</div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{todayMessages}</div>
                <p className="text-xs text-muted-foreground">Received today</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Messages</CardTitle>
          <CardDescription>View and manage contact form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left text-sm font-medium">From</th>
                  <th className="p-4 text-left text-sm font-medium">Email</th>
                  <th className="p-4 text-left text-sm font-medium">Message</th>
                  <th className="p-4 text-left text-sm font-medium">Date</th>
                  <th className="p-4 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : paginatedMessages.length > 0 ? (
                  paginatedMessages.map((message) => (
                    <tr 
                      key={message.id}
                      className="border-b cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleViewMessage(message)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{message.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {message.id}</div>
                          </div>
                        </div>  
                        </td>
                        <td className="p-4">{message.email}</td>
                        <td className="p-4 truncate max-w-sm">{message.message}</td>
                        <td className="p-4">{formatDate(message.createdAt)}</td>
                        <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => handleDeleteMessage(message.id, e)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </td>
                    </tr>   
                    ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-sm text-muted-foreground">
                        No messages found.
                    </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {paginatedMessages.length > 0 && (
            <div className="flex justify-between items-center py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredMessages.length)} of {filteredMessages.length} messages
              </div>
              {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>   
        {/* View Message Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
            <DialogHeader>  
            <DialogTitle>Contact Message Details</DialogTitle>
            <DialogDescription>
                View the details of the contact message below.
            </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-4">
            {selectedMessage ? (
                <>
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">From</h3>
                    <p className="text-lg font-semibold">{selectedMessage.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Message</h3>
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Received</h3>
                    <p>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                </>
            ) : (
                <p className="text-sm text-muted-foreground">No message selected.</p>
            )}
            </div>
            <DialogFooter>  
            <Button variant="destructive" onClick={() => selectedMessage && handleDeleteMessage(selectedMessage.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Message
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    </div>
  );
}  