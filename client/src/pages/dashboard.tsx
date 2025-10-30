import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/apiRequest";
import { DollarSign, FolderOpen, Key, LayoutDashboard, LogOut, Package, Plus, Zap } from "lucide-react";
import Settings from "./settings";
import { useQuery } from "@tanstack/react-query";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";
import { Activity } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderOpen, label: "Projects", href: "/dashboard/projects" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: Key, label: "API Credentials", href: "/dashboard/credentials" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Dashboard() {
   const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ["/api/stats"],
     queryFn: async () => {
        const response = await apiRequest.get("/api/stats");
        return response.data;
     },
  });

   if (isError) {
      return (
         <div className="flex items-center justify-center h-screen">
            <div className="text-red-500">
               Error: {error.message}
            </div>
         </div>
      );
   }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-6">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer mb-8">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">AutoBill</span>
                </div>
              </Link>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild className="hover-elevate">
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="p-6 mt-auto">
              <Button
                variant="outline"
                className="w-full justify-start hover-elevate active-elevate-2"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                  <p className="text-muted-foreground">
                    Welcome back! Here's your overview
                  </p>
                </div>
                <Link href="/dashboard/projects/new">
                  <Button className="hover-elevate active-elevate-2" data-testid="button-new-project">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </Link>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                          {isLoading ? <Skeleton className="h-8 w-1/2" /> : <p className="text-3xl font-bold" data-testid="text-total-projects">{stats?.totalProjects || 0}</p>}
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Products Created</p>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                          {isLoading ? <Skeleton className="h-8 w-1/2" /> : <p className="text-3xl font-bold" data-testid="text-total-products">{stats?.totalProducts || 0}</p>}
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Active Webhooks</p>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                          {isLoading ? <Skeleton className="h-8 w-1/2" /> : <p className="text-3xl font-bold" data-testid="text-total-webhooks">{stats?.totalWebhooks || 0}</p>}
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Platforms Connected</p>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                          {isLoading ? <Skeleton className="h-8 w-1/2" /> : <p className="text-3xl font-bold" data-testid="text-platforms-connected">{stats?.platformsConnected || 0}</p>}
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full mt-2" />
                                <Skeleton className="h-4 w-2/3 mt-2" />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent activity. Create your first project to get started!
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
