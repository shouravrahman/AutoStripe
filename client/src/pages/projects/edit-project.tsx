import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/apiRequest";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function EditProject() {
  const params = useParams();
  const projectId = params.projectId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => apiRequest<any>("GET", `/api/projects/${projectId}`),
    enabled: !!projectId,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || "",
      });
    }
  }, [project]);

  const updateProjectMutation = useMutation({
    mutationFn: (updatedData: typeof formData) =>
      apiRequest<any>("PATCH", `/api/projects/${projectId}`, updatedData),
    onSuccess: () => {
      toast({
        title: "Project updated!",
        description: "Your project has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setLocation(`/dashboard/projects/${projectId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectMutation.mutate(formData);
  };

  if (isLoadingProject) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <Card className="p-8">
          <div className="h-8 w-1/2 bg-muted rounded mb-4" />
          <div className="h-4 w-full bg-muted rounded mb-2" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-muted-foreground">
        Project not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Project: {project.name}</h1>
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={updateProjectMutation.isPending}>
            {updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
