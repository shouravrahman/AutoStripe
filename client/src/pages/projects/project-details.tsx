import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/apiRequest";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, Key, Webhook, Badge } from "lucide-react";
import { Link } from "wouter";

export default function ProjectDetails() {
   const params = useParams();
   const projectId = params.projectId;
   const [, setLocation] = useLocation();
   const queryClient = useQueryClient();

   const { data: project, isLoading: isLoadingProject, isError: isErrorProject, error: errorProject } = useQuery({
      queryKey: ["project", projectId],
      queryFn: () => apiRequest<any>("GET", `/api/projects/${projectId}`),
      enabled: !!projectId,
   });

   const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts, error: errorProducts } = useQuery({
      queryKey: ["products", projectId],
      queryFn: () => apiRequest<any>("GET", `/api/products?projectId=${projectId}`),
      enabled: !!projectId,
   });

   const { data: credentials, isLoading: isLoadingCredentials, isError: isErrorCredentials, error: errorCredentials } = useQuery({
      queryKey: ["credentials", projectId],
      queryFn: () => apiRequest<any>("GET", `/api/credentials?projectId=${projectId}`),
      enabled: !!projectId,
   });

   const { data: webhooks, isLoading: isLoadingWebhooks, isError: isErrorWebhooks, error: errorWebhooks } = useQuery({
      queryKey: ["webhooks", projectId],
      queryFn: () => apiRequest<any>("GET", `/api/webhooks?projectId=${projectId}`),
      enabled: !!projectId,
   });

   if (isLoadingProject || isLoadingProducts || isLoadingCredentials || isLoadingWebhooks) {
      return (
         <div className="max-w-7xl mx-auto p-8">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
               <Card className="p-6"><Skeleton className="h-6 w-1/3 mb-4" /><Skeleton className="h-4 w-full" /></Card>
               <Card className="p-6"><Skeleton className="h-6 w-1/3 mb-4" /><Skeleton className="h-4 w-full" /></Card>
            </div>
         </div>
      );
   }

   if (isErrorProject) {
      return (
         <div className="max-w-7xl mx-auto p-8 text-red-500">
            Error loading project: {errorProject?.message}
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
         <div className="flex items-center justify-between mb-8">
            <div>
               <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
               <p className="text-muted-foreground">{project.description || "No description"}</p>
            </div>
            <Link href={`/dashboard/projects/${projectId}/edit`}>
               <Button variant="outline">Edit Project</Button>
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Products</h2>
                  <Link href={`/dashboard/projects/${projectId}/products/new`}>
                     <Button size="sm"><Plus className="h-4 w-4 mr-2" /> New Product</Button>
                  </Link>
               </div>
               {isLoadingProducts ? (
                  <Skeleton className="h-24 w-full" />
               ) : products && products.length > 0 ? (
                  <div className="space-y-4">
                     {products.map((product: any) => (
                        <div key={product.id} className="flex items-center justify-between">
                           <Link href={`/dashboard/products/${product.id}`}>
                              <span className="font-medium hover:underline cursor-pointer">{product.name}</span>
                           </Link>
                           <Badge>{product.status}</Badge>
                        </div>
                     ))}
                  </div>
               ) : (
                  <p className="text-muted-foreground">No products yet. Create one to get started.</p>
               )}
            </Card>

            <Card className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">API Credentials</h2>
                  <Link href={`/dashboard/credentials?projectId=${projectId}`}>
                     <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add Credential</Button>
                  </Link>
               </div>
               {isLoadingCredentials ? (
                  <Skeleton className="h-24 w-full" />
               ) : credentials && credentials.length > 0 ? (
                  <div className="space-y-4">
                     {credentials.map((credential: any) => (
                        <div key={credential.id} className="flex items-center justify-between">
                           <span className="font-medium">{credential.platform}</span>
                           <Badge>{credential.status}</Badge>
                        </div>
                     ))}
                  </div>
               ) : (
                  <p className="text-muted-foreground">No credentials connected for this project.</p>
               )}
            </Card>
         </div>

         {/* Webhooks Section */}
         <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-semibold">Webhooks</h2>
               <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" /> Add Webhook</Button>
            </div>
            {isLoadingWebhooks ? (
               <Skeleton className="h-24 w-full" />
            ) : webhooks && webhooks.length > 0 ? (
               <div className="space-y-4">
                  {webhooks.map((webhook: any) => (
                     <div key={webhook.id} className="flex items-center justify-between">
                        <span className="font-medium">{webhook.url}</span>
                        <Badge >{webhook.provider}</Badge>
                     </div>
                  ))}
               </div>
            ) : (
               <p className="text-muted-foreground">No webhooks configured for this project.</p>
            )}
         </Card>
      </div>
   );
}
