import type { ReactNode } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { TopNavBar } from "./TopNavBar";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface LayoutSelectorProps {
  children: ReactNode;
}

export function LayoutSelector({ children }: LayoutSelectorProps) {
  const { token } = useAuthStore();
  const location = useLocation();

  // Define public routes
  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // If not logged in and trying to access private route, redirect to login
  if (!token && !isPublicRoute) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in and trying to access login/signup, redirect to dashboard
  if (token && (location.pathname === "/login" || location.pathname === "/signup")) {
    return <Navigate to="/dashboard" replace />;
  }

  // Dashboard Layout
  if (token && !isPublicRoute) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-lg font-semibold">
                {location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2)}
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Public Layout
  return (
    <div className="relative min-h-screen flex flex-col">
      <TopNavBar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
