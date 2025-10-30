import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Copy, ExternalLink, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetails() {
  const { productId } = useParams();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", productId],
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied!` });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Card className="p-8 animate-pulse">
          <div className="h-8 bg-muted rounded mb-4 w-1/3" />
          <div className="h-4 bg-muted rounded mb-2 w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Card className="p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">Product not found</h3>
          <Link href="/dashboard/products">
            <Button variant="outline" className="mt-4">Back to Products</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="mb-6 hover-elevate active-elevate-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          <Badge>{product.status}</Badge>
        </div>

        <div className="flex gap-2">
          {product.stripeProductId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://dashboard.stripe.com/products/${product.stripeProductId}`, "_blank")}
              className="hover-elevate active-elevate-2"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View in Stripe
            </Button>
          )}
          {product.lemonSqueezyProductId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://app.lemonsqueezy.com/products/${product.lemonSqueezyProductId}`, "_blank")}
              className="hover-elevate active-elevate-2"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View in LemonSqueezy
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Product IDs</h3>
            <div className="space-y-3">
              {product.stripeProductId && (
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Stripe Product ID</p>
                    <code className="text-sm font-mono">{product.stripeProductId}</code>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(product.stripeProductId, "Stripe Product ID")}
                    className="hover-elevate"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {product.lemonSqueezyProductId && (
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">LemonSqueezy Product ID</p>
                    <code className="text-sm font-mono">{product.lemonSqueezyProductId}</code>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(product.lemonSqueezyProductId, "LemonSqueezy Product ID")}
                    className="hover-elevate"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Pricing Plans</h3>
            {product.pricingPlans && product.pricingPlans.length > 0 ? (
              <div className="space-y-3">
                {product.pricingPlans.map((plan: any) => (
                  <div key={plan.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{plan.name}</h4>
                      <Badge>${(plan.amount / 100).toFixed(2)}/{plan.interval}</Badge>
                    </div>
                    {plan.stripePriceId && (
                      <div className="flex items-center justify-between text-sm">
                        <code className="font-mono text-xs">{plan.stripePriceId}</code>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(plan.stripePriceId, "Price ID")}
                          className="h-6 w-6 hover-elevate"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No pricing plans found</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5" />
              <h3 className="font-semibold">Code Snippets</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">JSON Config</p>
                <pre className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto">
{JSON.stringify({
  productId: product.stripeProductId || product.lemonSqueezyProductId,
  name: product.name,
  plans: product.pricingPlans?.map((p: any) => ({
    name: p.name,
    priceId: p.stripePriceId || p.lemonSqueezyVariantId,
    amount: p.amount,
    interval: p.interval,
  })),
}, null, 2)}
                </pre>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
