import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Package, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProductsList() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            All generated products across projects
          </p>
        </div>
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
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Card
              key={product.id}
              className="p-6 hover-elevate transition-all duration-200"
              data-testid={`card-product-${product.id}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {product.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {product.description || "No description"}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {product.stripeProductId && (
                  <Badge variant="outline">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Stripe
                  </Badge>
                )}
                {product.lemonSqueezyProductId && (
                  <Badge variant="outline">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    LemonSqueezy
                  </Badge>
                )}
              </div>

              <Link href={`/dashboard/products/${product.id}`}>
                <Button variant="outline" className="w-full hover-elevate active-elevate-2">
                  View Details
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground mb-6">
              Create a project first, then add products to it
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
