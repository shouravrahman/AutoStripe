
import { Link } from "wouter";
import { Zap, LayoutDashboard, Folder, Package, Key, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Folder, label: "Projects", href: "/dashboard/projects" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: Key, label: "API Credentials", href: "/dashboard/credentials" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export const DashboardLayout = ({ children, title, description }) => (
    <SidebarProvider>
        <div className="flex h-screen w-full bg-muted/40">
            <Sidebar>
                <SidebarContent>
                     <div className="p-4 border-b"><Link href="/"><div className="flex items-center gap-2 cursor-pointer"><Zap className="h-6 w-6 text-primary" /><span className="text-xl font-bold">AutoBill</span></div></Link></div>
                     <div className="p-4">
                         <SidebarGroup>
                             <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                             <SidebarGroupContent>
                                 <SidebarMenu>{menuItems.map((item) => (<SidebarMenuItem key={item.href}><SidebarMenuButton asChild><Link href={item.href}><item.icon className="h-5 w-5 mr-2" /><span>{item.label}</span></Link></SidebarMenuButton></SidebarMenuItem>))}</SidebarMenu>
                             </SidebarGroupContent>
                         </SidebarGroup>
                     </div>
                     <div className="p-4 mt-auto border-t"><Button variant="ghost" className="w-full justify-start"><LogOut className="h-4 w-4 mr-2" />Log out</Button></div>
                </SidebarContent>
            </Sidebar>
            <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b bg-background h-16"><SidebarTrigger /><ThemeToggle /></header>
                <main className="flex-1 overflow-auto p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto">
                         <div className="mb-8">
                            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
                            <p className="text-muted-foreground">{description}</p>
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    </SidebarProvider>
);
