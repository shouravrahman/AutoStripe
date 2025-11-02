import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Folder, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";

interface Project {
   id: string;
   name: string;
}

export default function ProjectsList() {
   const queryClient = useQueryClient();
   const { toast } = useToast();

   const {
      data: projects,
      isLoading,
      isError,
      error,
   } = useQuery({
      queryKey: ["projects"],
      queryFn: () => apiRequest<Project[]>("GET", "/api/projects"),
   });

   const deleteMutation = useMutation({
      mutationFn: (id: string) => apiRequest<void>("DELETE", `/api/projects/${id}`),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["projects"] });
         toast({ title: "Project deleted successfully" });
      },
      onError: (error: any) => {
         toast({
            title: "Error deleting project",
            description: error.message,
            variant: "destructive",
         });
      },
   });

   if (isError) {
      return <div>Error: {error.message}</div>;
   }

   return (
      <div className="max-w-4xl mx-auto p-8">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h1 className="text-3xl font-bold mb-2">Projects</h1>
               <p className="text-muted-foreground">
                  Manage your AutoBill projects
               </p>
            </div>
            <Link href="/dashboard/projects/new">
               <Button className="hover-elevate active-elevate-2">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
               </Button>
            </Link>
         </div>

         {isLoading ? (
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 animate-pulse">
                     <div className="h-6 bg-muted rounded w-1/3" />
                  </Card>
               ))}
            </div>
         ) : projects && projects.length > 0 ? (
            <div className="space-y-4">
               {projects.map((project: any) => (
                  <Card key={project.id} className="p-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <Folder className="h-6 w-6 text-primary" />
                           <span className="font-semibold">{project.name}</span>
                        </div>
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => deleteMutation.mutate(project.id)}
                           disabled={deleteMutation.isPending && deleteMutation.variables === project.id}
                        >
                           <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                     </div>
                  </Card>
               ))}
            </div>
         ) : (
            <Card className="p-12 text-center">
               <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
               <p className="text-muted-foreground mb-6">
                  Create your first project to get started.
               </p>
            </Card>
         )}
      </div>
   );
}
