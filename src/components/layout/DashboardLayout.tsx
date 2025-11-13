

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
          <footer className="py-3 px-6 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} E-Commerce Admin. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}