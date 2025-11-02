import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Zap, LayoutDashboard, Folder, Package, Key, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Folder, label: "Projects", href: "/dashboard/projects" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: Key, label: "API Credentials", href: "/dashboard/credentials" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const EditProjectSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
            </div>
        </CardContent>
        <CardFooter className="flex justify-end bg-muted/50 p-4">
            <Skeleton className="h-10 w-32" />
        </CardFooter>
    </Card>
)

export default function EditProjectPage() {
  const { projectId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", description: "" });

  const { data: project, isLoading, isError, error } = useQuery({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => (await apiRequest.get(`/api/projects/${projectId}`)).data,
    enabled: !!projectId,
  });

  useEffect(() => {
    if (project) {
      setFormData({ name: project.name, description: project.description || "" });
    }
  }, [project]);

  const mutation = useMutation({
    mutationFn: (updatedData) => apiRequest.patch(`/api/projects/${projectId}`, updatedData),
    onSuccess: (data) => {
      toast({ title: "Project Updated", description: "Your changes have been saved." });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      setLocation(`/dashboard/projects/${projectId}`);
    },
    onError: (error) => toast({ title: "Update Failed", description: error.message, variant: "destructive" }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isError) {
      return <div>Error: {error.message}</div>
  }

  return (
    <SidebarProvider>
        <div className="flex h-screen w-full bg-muted/40">
            <Sidebar>
                <SidebarContent>
                    <div className="p-4 border-b"><Link href="/"><div className="flex items-center gap-2 cursor-pointer"><Zap className="h-6 w-6 text-primary" /><span className="text-xl font-bold">AutoBill</span></div></Link></div>
                    <div className="p-4">
                        <SidebarGroup>
                            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                            <SidebarGroupContent><SidebarMenu>{menuItems.map((item) => (<SidebarMenuItem key={item.href}><SidebarMenuButton asChild><Link href={item.href}><item.icon className="h-5 w-5 mr-2" /><span>{item.label}</span></Link></SidebarMenuButton></SidebarMenuItem>))}</SidebarMenu></SidebarGroupContent>
                        </SidebarGroup>
                    </div>
                    <div className="p-4 mt-auto border-t"><Button variant="ghost" className="w-full justify-start"><LogOut className="h-4 w-4 mr-2" />Log out</Button></div>
                </SidebarContent>
            </Sidebar>
            <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b bg-background h-16"><SidebarTrigger /><ThemeToggle /></header>
                <main className="flex-1 overflow-auto p-4 sm:p-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8">
                            <Button variant="ghost" asChild className="mb-4"><Link href={`/dashboard/projects/${projectId}`}><ArrowLeft className="h-4 w-4 mr-2" />Back to Project</Link></Button>
                            <h1 className="text-3xl font-extrabold tracking-tight">Edit Project</h1>
                            <p className="text-muted-foreground">Update the details of your project.</p>
                        </div>
                        {isLoading ? <EditProjectSkeleton /> : (
                            <form onSubmit={handleSubmit}>
                                <Card>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Project Name</Label>
                                            <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description (Optional)</Label>
                                            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end gap-2 bg-muted/50 p-4">
                                        <Button type="button" variant="ghost" asChild><Link href={`/dashboard/projects/${projectId}`}>Cancel</Link></Button>
                                        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save Changes'}</Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        )}
                    </div>
                </main>
            </div>
        </div>
    </SidebarProvider>
  );
}
