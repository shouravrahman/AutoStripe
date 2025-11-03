
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/apiRequest";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, Check, Eye, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@//components/ui/select";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth

interface AIPricingPlanSuggestion {
    name: string;
    price: number; // Changed from amount to price for consistency with scraped data
    interval: "month" | "year" | "once";
    features: string; // Comma-separated features
}

interface AIPricingSuggestionResponse {
    refinedDescription: string;
    pricingTiers: AIPricingPlanSuggestion[];
    monetizationStrategy: string;
    featureBundlingIdeas: string[];
}

export default function DryRunPage() {
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const queryClient = useQueryClient();
    const { user } = useAuth(); // Get user status

    const { scrapedData, apiCallPreviews } = history.state as any || {};

    const [productName, setProductName] = useState(scrapedData?.name || "");
    const [productDescription, setProductDescription] = useState(scrapedData?.description || "");
    const [pricingPlans, setPricingPlans] = useState(scrapedData?.pricing || []);
    const [backendStack, setBackendStack] = useState("nextjs-api"); // Default for now

    // State for additional AI suggestions
    const [monetizationStrategy, setMonetizationStrategy] = useState("");
    const [featureBundlingIdeas, setFeatureBundlingIdeas] = useState<string[]>([]);

    const [codePreview, setCodePreview] = useState<Record<string, string> | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);

    const finalCreateMutation = useMutation({
        mutationFn: (data: any) => apiRequest("POST", "/api/projects", data),
        onSuccess: (newProject) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast({ title: "Project Created!", description: "Next, connect your payment providers." });
            setLocation(`/onboarding?projectId=${newProject.id}`);
        },
        onError: (error: any) => {
            toast({ title: "Error creating project", description: error.message, variant: "destructive" });
        }
    });

    const suggestPricingMutation = useMutation({
        mutationFn: (data: { productName: string; productDescription: string; existingPricingPlans: any[] }) =>
            apiRequest<AIPricingSuggestionResponse>("POST", "/api/ai/suggest", data),
        onSuccess: (data) => {
            if (data.refinedDescription) setProductDescription(data.refinedDescription);

            if (data.pricingTiers && data.pricingTiers.length > 0) {
                const formattedPlans = data.pricingTiers.map(plan => ({
                    name: plan.name,
                    price: plan.price * 100, // Convert to cents
                    interval: plan.interval,
                    features: plan.features,
                }));
                setPricingPlans(formattedPlans);
                toast({ title: "AI pricing suggestions applied!", description: "Review the suggested tiers." });
            } else {
                toast({ title: "No AI pricing suggestions received.", variant: "destructive" });
            }
            if (data.monetizationStrategy) setMonetizationStrategy(data.monetizationStrategy);
            if (data.featureBundlingIdeas) setFeatureBundlingIdeas(data.featureBundlingIdeas);
        },
        onError: (error: any) => {
            toast({ title: "AI suggestion failed", description: error.message, variant: "destructive" });
        }
    });

    useEffect(() => {
        const fetchPreview = async () => {
            if (!productName || pricingPlans.length === 0) return;
            setIsPreviewLoading(true);
            try {
                const response = await apiRequest("POST", "/api/ai/preview-code", {
                    productData: { name: productName, description: productDescription },
                    pricingPlans,
                    backendStack,
                    paymentProviders: ["stripe", "lemonsqueezy"],
                });
                setCodePreview(response.code);
            } catch (error: any) {
                toast({ title: "Error fetching code preview", description: error.message, variant: "destructive" });
            }
            setIsPreviewLoading(false);
        };

        const debounce = setTimeout(fetchPreview, 500);
        return () => clearTimeout(debounce);
    }, [productName, productDescription, pricingPlans, backendStack, toast]);

    const handlePlanChange = (index: number, field: string, value: string | number) => {
        const newPlans = [...pricingPlans];
        newPlans[index] = { ...newPlans[index], [field]: value };
        setPricingPlans(newPlans);
    };

    const handleSuggestPricing = () => {
        if (!productName || !productDescription) {
            toast({ title: "Product name and description are required for suggestions.", variant: "destructive" });
            return;
        }
        suggestPricingMutation.mutate({ productName, productDescription, existingPricingPlans: pricingPlans });
    };

    const handleCreateProject = () => {
        const projectData = {
            name: productName || "My New Project",
            product: { name: productName, description: productDescription },
            pricingPlans: pricingPlans,
            backendStack: backendStack, // Pass the selected backend stack
            integrationSettings: { createInStripe: true, createInLemonSqueezy: true }
        };

        if (!user) {
            // If not logged in, redirect to signup with state
            setLocation("/signup", { state: { dryRunData: projectData } });
        } else {
            // If logged in, proceed with project creation
            finalCreateMutation.mutate(projectData);
        }
    };

    if (!scrapedData) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">No Scraped Data Found</h2>
                <p className="text-muted-foreground mb-6">Please start by providing a URL on the landing page.</p>
                <Button asChild><Link href="/"><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Link></Button>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <header className="p-4 border-b flex items-center justify-between bg-background z-10">
                <h1 className="text-xl font-bold">Review & Onboard</h1>
                <Button size="lg" disabled={finalCreateMutation.isPending} onClick={handleCreateProject}>
                    {finalCreateMutation.isPending ? "Creating..." : "Approve & Continue"}
                </Button>
            </header>
            <div className="grid lg:grid-cols-2 flex-1 overflow-hidden">
                {/* Left Panel: Live Site IFrame */}
                <div className="h-full overflow-auto">
                    <iframe src={scrapedData.url} className="w-full h-full border-r" title="Live Site Preview" />
                </div>

                {/* Right Panel: Editable Forms & Previews */}
                <div className="h-full overflow-auto p-8 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>1. Review Scraped Data</CardTitle><CardDescription>Edit the scraped information. Changes will automatically update the code preview.</CardDescription></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="productName">Product Name</Label>
                                <Input id="productName" value={productName} onChange={e => setProductName(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="productDescription">Description</Label>
                                <Textarea id="productDescription" value={productDescription} onChange={e => setProductDescription(e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Pricing Plans</CardTitle>
                            <Button variant="outline" size="sm" onClick={handleSuggestPricing} disabled={suggestPricingMutation.isPending || !productName || !productDescription}>
                                {suggestPricingMutation.isPending ? "Suggesting..." : <><Sparkles className="h-4 w-4 mr-2" />AI Suggest</>}
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pricingPlans.map((plan, index) => (
                                <Card key={index} className="p-4 bg-muted/30">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2"><Label>Plan Name</Label><Input value={plan.name} onChange={e => handlePlanChange(index, 'name', e.target.value)} /></div>
                                        <div className="space-y-2"><Label>Price (in cents)</Label><Input type="number" value={plan.price} onChange={e => handlePlanChange(index, 'price', parseInt(e.target.value, 10))} /></div>
                                        <div className="space-y-2 col-span-2"><Label>Interval</Label><Select value={plan.interval} onValueChange={value => handlePlanChange(index, 'interval', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="month">Month</SelectItem><SelectItem value="year">Year</SelectItem><SelectItem value="once">Once</SelectItem></SelectContent></Select></div>
                                        <div className="space-y-2 col-span-2"><Label>Features (comma-separated)</Label><Textarea value={plan.features} onChange={e => handlePlanChange(index, 'features', e.target.value)} /></div>
                                    </div>
                                </Card>
                            ))}
                        </CardContent>
                         {monetizationStrategy && 
                            <Card className="mt-4">
                                <CardHeader><CardTitle>AI Monetization Strategy</CardTitle></CardHeader>
                                <CardContent><p>{monetizationStrategy}</p></CardContent>
                            </Card>
                        }
                        {featureBundlingIdeas.length > 0 &&
                            <Card className="mt-4">
                                <CardHeader><CardTitle>AI Feature Bundling Ideas</CardTitle></CardHeader>
                                <CardContent>
                                    <ul className="list-disc list-inside space-y-1">
                                        {featureBundlingIdeas.map((idea, index) => (
                                            <li key={index}>{idea}</li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        }
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>2. API Call Preview</CardTitle></CardHeader>
                        <CardContent>
                            <pre className="bg-muted/50 p-4 rounded-lg text-xs font-mono overflow-x-auto"><code>{apiCallPreviews?.stripe || ""}</code></pre>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>3. Generated Code Preview</CardTitle></CardHeader>
                        <CardContent>
                            {isPreviewLoading ? <p>Loading preview...</p> : codePreview ? (
                                <Tabs defaultValue={Object.keys(codePreview)[0]}>
                                    <TabsList className="w-full grid grid-cols-3">
                                        {Object.keys(codePreview).map(key => <TabsTrigger key={key} value={key}>{key}</TabsTrigger>)}
                                    </TabsList>
                                    {Object.keys(codePreview).map(key => (
                                        <TabsContent key={key} value={key}>
                                            <pre className="bg-muted/50 p-4 rounded-lg text-xs font-mono overflow-x-auto h-64"><code>{codePreview[key]}</code></pre>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            ) : <p>Enter product data to see code preview.</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
