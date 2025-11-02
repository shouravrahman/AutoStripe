import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FolderOpen, Package, MoreVertical, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";

export default function ProjectsList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiRequest<any>("GET", "/api/projects"),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) =>
      apiRequest<void>("DELETE", `/api/projects/${projectId}`),
    onSuccess: () => {
      toast({
        title: "Project deleted!",
        description: "Your project has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Organize your products into projects
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="hover-elevate active-elevate-2" data-testid="button-new-project">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-muted rounded mb-4 w-3/4" />
              <div className="h-4 bg-muted rounded mb-2 w-full" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </Card>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Card
              key={project.id}
              className="p-6 hover-elevate transition-all duration-200"
              data-testid={`card-project-${project.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover-elevate active-elevate-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/projects/${project.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing immediately
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            project and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProjectMutation.mutate(project.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {project.description || "No description"}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{project.productsCount || 0} products</span>
                </div>
              </div>

              <Link href={`/dashboard/projects/${project.id}`}>
                <Button variant="outline" className="w-full mt-4 hover-elevate active-elevate-2">
                  View Project
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first project to start organizing your products
            </p>
            <Link href="/dashboard/projects/new">
              <Button className="hover-elevate active-elevate-2">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
