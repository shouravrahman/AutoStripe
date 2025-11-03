import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/apiRequest";
import { Badge } from "@/components/ui/badge";

interface Product {
   id: string;
   name: string;
   description: string;
   stripeProductId?: string;
   lemonSqueezyProductId?: string;
   createdAt: string;
}

const ProductListSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <Card key={i}>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32 rounded-md" />
                            <Skeleton className="h-4 w-48 rounded-md" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-24 rounded-md" />
                </CardContent>
            </Card>
        ))}
    </div>
);

const EmptyState = () => (
    <Card className="text-center p-12 border-2 border-dashed">
        <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No products yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">Your products will appear here once you generate them from a project.</p>
        <Button asChild className="mt-6">
            <Link href="/dashboard/projects">
                Go to Projects
            </Link>
        </Button>
    </Card>
);

export default function ProductsList() {
   const { data: products, isLoading, isError, error } = useQuery<Product[]>({
      queryKey: ["products"],
      queryFn: () => apiRequest("GET", "/api/products"),
   });

   if (isError) {
      return <div className="p-8">Error: {(error as Error).message}</div>;
   }

   return (
    <div>
         <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage all products generated across your projects.</p>
        </div>
        {isLoading ? (
            <ProductListSkeleton />
        ) : products && products.length > 0 ? (
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                    {products.map((product) => (
                        <Link key={product.id} href={`/dashboard/products/${product.id}`}>
                            <div className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer">
                             <div className="flex items-center gap-4 grow">
                                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                                        <Package className="h-5 w-5 text-primary" />
                                    </div>
                                <div className="grow">
                                        <p className="font-semibold text-sm">{product.name}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{product.description || 'No description'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {product.stripeProductId && <Badge variant="secondary">Stripe</Badge>}
                                    {product.lemonSqueezyProductId && <Badge variant="secondary">LemonSqueezy</Badge>}
                                </div>
                            </div>
                        </Link>
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
