import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import { Skeleton } from "@/components/ui/skeleton";

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

  const { data: project, isLoading, isError, error } = useQuery<any>({
    queryKey: ["project", projectId],
    queryFn: () => apiRequest("GET", `/api/projects/${projectId}`),
    enabled: !!projectId,
  });

  useEffect(() => {
    if (project) {
      setFormData({ name: project.name, description: project.description || "" });
    }
  }, [project]);

  const mutation = useMutation({
    mutationFn: (updatedData: any) => apiRequest("PATCH", `/api/projects/${projectId}`, updatedData),
    onSuccess: (data) => {
      toast({ title: "Project Updated", description: "Your changes have been saved." });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setLocation(`/dashboard/projects/${projectId}`);
    },
    onError: (error: Error) => toast({ title: "Update Failed", description: error.message, variant: "destructive" }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isError) {
      return <div>Error: {(error as Error).message}</div>
  }

  return (
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
  );
}
