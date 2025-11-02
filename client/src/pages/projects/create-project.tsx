import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";

export default function CreateProject() {
   const queryClient = useQueryClient();
   const { toast } = useToast();
   const [, setLocation] = useLocation();
   const [projectName, setProjectName] = useState("");

   const createProjectMutation = useMutation({
      mutationFn: (newProject: { name: string }) =>
         apiRequest("POST", "/api/projects", newProject),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["projects"] });
         toast({ title: "Project created successfully" });
         setLocation("/dashboard/projects");
      },
      onError: (error: any) => {
         toast({
            title: "Error creating project",
            description: error.message,
            variant: "destructive",
         });
      },
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!projectName.trim()) {
         toast({ title: "Project name cannot be empty", variant: "destructive" });
         return;
      }
      createProjectMutation.mutate({ name: projectName });
   };

   return (
      <div className="max-w-2xl mx-auto">
         <Card>
            <CardHeader>
               <CardTitle>Project Details</CardTitle>
               <CardDescription>
                  Give your new project a name to get started.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <Label htmlFor="projectName">Project Name</Label>
                     <Input
                        id="projectName"
                        placeholder="e.g., My Awesome SaaS"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                     />
                  </div>
                  <Button type="submit" disabled={createProjectMutation.isPending}>
                     {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
