import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Folder, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Project {
   id: string;
   name: string;
}

const ProjectListSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-6 w-48 rounded-md" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                </CardContent>
            </Card>
        ))}
    </div>
);

const EmptyState = () => (
    <Card className="text-center p-12 border-2 border-dashed">
        <Folder className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">Get started by creating your first project.</p>
        <Button asChild className="mt-6">
            <Link href="/dashboard/projects/create">
                <Plus className="h-4 w-4 mr-2" />
                New Project
            </Link>
        </Button>
    </Card>
);

export default function ProjectsList() {
   const queryClient = useQueryClient();
   const { toast } = useToast();

   const { data: projects, isLoading, isError, error } = useQuery<Project[]>({ 
    queryKey: ["projects"], 
    queryFn: () => apiRequest("GET", "/api/projects")
   });

   const deleteMutation = useMutation<void, Error, string>({
      mutationFn: (id: string) => apiRequest("DELETE", `/api/projects/${id}`),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["projects"] });
         toast({ title: "Project deleted" });
      },
      onError: (error) => {
         toast({ title: "Error deleting project", description: error.message, variant: "destructive" });
      },
   });
   
   if (isError) {
       return <div className="p-8">Error: {error.message}</div>;
   }

   return (
    <div>
      <div className="flex items-center justify-between mb-8">
          <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Projects</h1>
              <p className="text-muted-foreground">Create and manage your code generation projects.</p>
          </div>
          <Button asChild>
              <Link href="/dashboard/projects/create"><Plus className="h-4 w-4 mr-2" />New Project</Link>
          </Button>
      </div>
      {isLoading ? (
          <ProjectListSkeleton />
      ) : projects && projects.length > 0 ? (
          <Card>
              <CardContent className="p-0">
                  <div className="divide-y">
                      {projects.map((project) => (
                          <div key={project.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                              <Link href={`/dashboard/projects/${project.id}`} className="flex items-center gap-4 flex-grow">
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                                      <Folder className="h-5 w-5 text-primary" />
                                  </div>
                                  <span className="font-semibold text-sm">{project.name}</span>
                              </Link>
                              <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                          <MoreVertical className="h-4 w-4" />
                                      </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                      <DropdownMenuItem onSelect={() => deleteMutation.mutate(project.id)} className="text-destructive">
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                      </DropdownMenuItem>
                                  </DropdownMenuContent>
                              </DropdownMenu>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
      ) : (
          <EmptyState />
      )}
    </div>
   );
}
