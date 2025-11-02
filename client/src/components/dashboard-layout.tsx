import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { LayoutDashboard, FolderOpen, Package, Key, Settings, LogOut, ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderOpen, label: "Projects", href: "/dashboard/projects" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: Key, label: "API Credentials", href: "/dashboard/credentials" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export default function DashboardLayout({ children, title, description, showBackButton }: DashboardLayoutProps) {
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await apiRequest<void>("POST", "/api/auth/logout");
      queryClient.invalidateQueries({ queryKey: ["user"] }); // Invalidate user query
      setLocation("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if API call fails, try to redirect to login
      setLocation("/login");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-6">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer mb-8">
                  <Logo className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">StripeSyncer</span>
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
                onClick={handleLogout}
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
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              {showBackButton && (
                <Button variant="ghost" size="icon" onClick={() => history.back()}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                {title && <h1 className="text-xl font-semibold">{title}</h1>}
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
