import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/apiRequest";

export default function CreateProject() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const project = await apiRequest<any>("POST", "/api/projects", formData);

      toast({
        title: "Project created!",
        description: "Your project has been created successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setLocation(`/dashboard/projects/${project.id}`);
    } catch (error: any) {
      toast({
        title: "Failed to create project",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Button
        variant="ghost"
        onClick={() => setLocation("/dashboard/projects")}
        className="mb-6 hover-elevate active-elevate-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
        <p className="text-muted-foreground">
          Organize your payment products into projects
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="e.g., AI Resume Writer, SaaS Dashboard"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              data-testid="input-project-name"
              className="hover-elevate"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this project..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              data-testid="input-project-description"
              className="hover-elevate resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Describe what this project is about
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 hover-elevate active-elevate-2"
              disabled={loading}
              data-testid="button-create-project"
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/dashboard/projects")}
              className="hover-elevate active-elevate-2"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
