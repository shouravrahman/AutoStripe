import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/apiRequest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const ProjectDetailsSkeleton = () => (
    <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-64 mb-8" />
        <div className="space-y-6">
            <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
        </div>
    </div>
);

export default function ProjectDetailsPage() {
    const { projectId } = useParams();

    const { data: project, isLoading, isError, error } = useQuery({
        queryKey: ["projects", projectId],
        queryFn: () => apiRequest("GET", `/api/projects/${projectId}`),
        enabled: !!projectId,
    });

    const { data: products, isLoading: isLoadingProducts } = useQuery({
        queryKey: ["products", { projectId }],
        queryFn: () => apiRequest("GET", `/api/products?projectId=${projectId}`),
        enabled: !!projectId,
    });

    if (isError) return <div className="p-8">Error: {error.message}</div>;

    return (
        <div>
            {isLoading ? <ProjectDetailsSkeleton /> : (
                <div className="space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div><CardTitle>Products</CardTitle><CardDescription>Digital products and services.</CardDescription></div>
                            <Button asChild size="sm"><Link href={`/dashboard/products/new?projectId=${projectId}`}><Plus className="h-4 w-4 mr-2"/>New Product</Link></Button>
                        </CardHeader>
                        <CardContent>
                            {isLoadingProducts ? <Skeleton className="h-10"/> : products?.length > 0 ? (
                                <div className="divide-y">
                                    {products.map(p => (
                                        <Link key={p.id} href={`/dashboard/products/${p.id}`}>
                                            <div className="p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer">
                                                <p className="font-medium">{p.name}</p>
                                                <Badge variant="secondary">{p.stripeProductId ? 'Stripe' : 'LemonSqueezy'}</Badge>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                    <Package className="mx-auto h-10 w-10 text-muted-foreground/50"/>
                                    <p className="mt-4 text-sm text-muted-foreground">No products have been created for this project yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
