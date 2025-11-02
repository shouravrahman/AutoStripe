import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export default function ProductsList() {
   const {
      data: products,
      isLoading,
      isError,
      error,
   } = useQuery({
      queryKey: ["products"],
      queryFn: () => apiRequest<Product[]>("GET", "/api/products"),
   });

   if (isError) {
      return <div>Error: {error.message}</div>;
   }

   return (
      <div className="max-w-4xl mx-auto p-8">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h1 className="text-3xl font-bold mb-2">Products</h1>
               <p className="text-muted-foreground">
                  Manage all your generated products
               </p>
            </div>
         </div>

         {isLoading ? (
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 animate-pulse">
                     <div className="h-6 bg-muted rounded w-1/3 mb-2" />
                     <div className="h-4 bg-muted rounded w-2/3" />
                  </Card>
               ))}
            </div>
         ) : products && products.length > 0 ? (
               <div className="space-y-4">
                  {products.map((product) => (
                     <Link key={product.id} href={`/dashboard/products/${product.id}`}>
                        <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <Package className="h-6 w-6 text-primary" />
                                 <div>
                                 <span className="font-semibold">{product.name}</span>
                                 <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              {product.stripeProductId && <Badge variant="secondary">Stripe</Badge>}
                              {product.lemonSqueezyProductId && <Badge variant="secondary">LemonSqueezy</Badge>}
                           </div>
                        </div>
                     </Card>
                  </Link>
               ))}
               </div>
            ) : (
                  <Card className="p-12 text-center">
                     <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                     <p className="text-muted-foreground mb-6">
                        Create your first product from the projects page.
                     </p>
            </Card>
         )}
      </div>
   );
}
