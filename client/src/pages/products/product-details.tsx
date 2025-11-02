import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/apiRequest";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Copy, Check, Info, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const CopyableField = ({ label, value }) => {
    const { toast } = useToast();
    const [hasCopied, setHasCopied] = useState(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        setHasCopied(true);
        toast({ title: `Copied ${label} to clipboard!`});
        setTimeout(() => setHasCopied(false), 2000);
    };
    return (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
                <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                <code className="text-sm font-mono">{value}</code>
            </div>
            <Button size="icon" variant="ghost" onClick={copyToClipboard} className="h-8 w-8">
                {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
        </div>
    )
}

const ProductDetailsSkeleton = () => (
    <div>
        <Skeleton className="h-8 w-1/4 mb-2" />
        <Skeleton className="h-5 w-1/2 mb-4" />
        <div className="flex gap-2 mb-8"><Skeleton className="h-9 w-32" /><Skeleton className="h-9 w-32" /></div>
        <Card><CardHeader><Skeleton className="h-6 w-1/3"/></CardHeader><CardContent><Skeleton className="h-24 w-full"/></CardContent></Card>
    </div>
)

export default function ProductDetailsPage() {
    const { productId } = useParams();

    const { data: product, isLoading, isError, error } = useQuery<any>({
        queryKey: ["product", productId],
        queryFn: () => apiRequest("GET", `/api/products/${productId}`),
        enabled: !!productId,
    });

    if (isError) return <div className="p-8">Error: {(error as Error).message}</div>;

    return (
        <div>
            {isLoading ? <ProductDetailsSkeleton /> : !product ? (
                <Card className="text-center p-12"><Info className="mx-auto h-12 w-12 text-muted-foreground/50"/><h3 className="mt-4 text-lg font-semibold">Product Not Found</h3><p className="mt-2 text-sm text-muted-foreground">This product could not be found.</p><Button asChild className="mt-6"><Link href="/dashboard/projects"><ArrowLeft className="h-4 w-4 mr-2"/>Back to Projects</Link></Button></Card>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">{product.name}</h1>
                            <p className="text-muted-foreground">{product.description}</p>
                        </div>
                        <div className="flex gap-2">
                            {product?.stripeProductId && <Button variant="outline" size="sm" asChild><a href={`https://dashboard.stripe.com/products/${product.stripeProductId}`} target="_blank"><ExternalLink className="h-4 w-4 mr-2" />View in Stripe</a></Button>}
                            {product?.lemonSqueezyProductId && <Button variant="outline" size="sm" asChild><a href={`https://app.lemonsqueezy.com/products/${product.lemonSqueezyProductId}`} target="_blank"><ExternalLink className="h-4 w-4 mr-2" />View in Lemon Squeezy</a></Button>}
                        </div>
                    </div>
                    <Tabs defaultValue="overview">
                        <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="pricing">Pricing</TabsTrigger><TabsTrigger value="integration">Integration</TabsTrigger></TabsList>
                        <TabsContent value="overview" className="pt-6">
                            <Card>
                                <CardHeader><CardTitle>Product IDs</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {product.stripeProductId && <CopyableField label="Stripe Product ID" value={product.stripeProductId} />}
                                    {product.lemonSqueezyProductId && <CopyableField label="Lemon Squeezy Product ID" value={product.lemonSqueezyProductId} />}
                                    {product.lemonSqueezyStoreId && <CopyableField label="Lemon Squeezy Store ID" value={product.lemonSqueezyStoreId} />}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="pricing" className="pt-6">
                            <Card>
                                <CardHeader><CardTitle>Pricing Plans</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {product.variants?.length > 0 ? product.variants.map(v => (
                                        <Card key={v.id} className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-semibold">{v.name}</p>
                                                    <p className="text-sm text-muted-foreground">{(v.price / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} / {v.interval}</p>
                                                </div>
                                                <Badge variant={v.isUsageBased ? "secondary" : "default"}>{v.isUsageBased ? "Usage-Based" : "Fixed"}</Badge>
                                            </div>
                                            {v.stripePriceId && <CopyableField label="Stripe Price ID" value={v.stripePriceId} />}
                                            {v.lemonSqueezyVariantId && <CopyableField label="Lemon Squeezy Variant ID" value={v.lemonSqueezyVariantId} />}
                                        </Card>
                                    )) : <p className="text-sm text-muted-foreground">No pricing plans found for this product.</p>}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="integration" className="pt-6">
                            <Card>
                                <CardHeader><CardTitle>Generated Code Snippets</CardTitle></CardHeader>
                                <CardContent>
                                        <pre className="bg-muted/50 p-4 rounded-lg text-sm font-mono overflow-x-auto">{JSON.stringify({product: { id: product.id, name: product.name }, variants: product.variants}, null, 2)}</pre>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
}
