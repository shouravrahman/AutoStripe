import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/apiRequest";

// ... [interfaces remain the same] ...

interface ProductGenerateResponse {
   id: string;
   // other product properties
}

interface CodeGenerateResponse {
   code: Record<string, string>;
}

type PricingPlan = {
  name: string;
  amount: number;
  currency: string;
  interval: "month" | "year" | "once";
  trialDays: number;
  features: string; // Comma-separated features for this tier
};

const templates = [
  {
    name: "Standard SaaS",
    plans: [
      { name: "Basic", amount: 1000, currency: "usd", interval: "month", trialDays: 0, features: "Basic features, Email support" },
      { name: "Pro", amount: 2900, currency: "usd", interval: "month", trialDays: 14, features: "All Basic features, Advanced analytics, Priority support" },
      { name: "Enterprise", amount: 7900, currency: "usd", interval: "month", trialDays: 0, features: "All Pro features, Custom integrations, Dedicated support" },
    ],
  },
  // ... other templates
];

export default function ProductWizard() {
  const { projectId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
  });

  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([
    { name: "Tier 1", amount: 2900, currency: "usd", interval: "month", trialDays: 0, features: "" },
  ]);

  const [integrationSettings, setIntegrationSettings] = useState({
    createInStripe: true,
    createInLemonSqueezy: true,
  });

  const [backendStack, setBackendStack] = useState("nextjs-api");

  const addPricingPlan = () => {
    setPricingPlans([
      ...pricingPlans,
      { name: "", amount: 0, currency: "usd", interval: "month", trialDays: 0, features: "" },
    ]);
  };

  const removePricingPlan = (index: number) => {
    setPricingPlans(pricingPlans.filter((_, i) => i !== index));
  };

  const updatePricingPlan = (index: number, updates: Partial<PricingPlan>) => {
    setPricingPlans(pricingPlans.map((plan, i) => (i === index ? { ...plan, ...updates } : plan)));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Step 1: Create the product metadata in our database.
      const productResponse = await apiRequest<ProductGenerateResponse>("POST", "/api/products", {
        projectId,
        product: productData,
        pricingPlans,
        integrationSettings,
      });

      const { id: productId } = productResponse;
      toast({ title: "Product created!", description: "Now generating your code..." });

      // Step 2: Generate the code based on the new product and selected stack.
      const codeResponse = await apiRequest<CodeGenerateResponse>("POST", "/api/ai/generate-code", {
        productId,
        backendStack,
      });

      // Step 3: Redirect to the guide page with the generated code.
      setLocation(`/dashboard/projects/${projectId}/guide`, {
        state: { generatedCode: codeResponse.code, product: productResponse },
      });

      queryClient.invalidateQueries({ queryKey: ["/api/products"] });

    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ... [JSX for the wizard steps remains largely the same, but simplified] ...
  // The key changes are removing the frontendStack selector and the final review step's checkboxes.

  return (
    <div className="max-w-4xl mx-auto p-8">
       <Button
        variant="ghost"
        onClick={() => setLocation(`/dashboard/projects/${projectId}`)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Project
      </Button>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {[0, 1, 2, 3, 4].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {step > s ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {s < 4 && <div className="h-0.5 w-12 bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Product Info */}
      {step === 1 && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Product Information</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input id="name" placeholder="e.g., AI Resume Writer Pro" required value={productData.name} onChange={(e) => setProductData({ ...productData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your product..." rows={4} value={productData.description} onChange={(e) => setProductData({ ...productData, description: e.target.value })} />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)} disabled={!productData.name}>Next: Pricing <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Pricing Plans */}
      {step === 2 && (
         <Card className="p-8">
          <h2 className="text-2xl font-bold mb-2">Define Your Pricing Tiers</h2>
          <div className="space-y-4 mb-6">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className="p-4 border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tier Name</Label>
                    <Input placeholder="e.g., Basic, Pro" value={plan.name} onChange={(e) => updatePricingPlan(index, { name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (cents)</Label>
                    <Input type="number" placeholder="2900" value={plan.amount} onChange={(e) => updatePricingPlan(index, { amount: parseInt(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Interval</Label>
                    <Select value={plan.interval} onValueChange={(value: PricingPlan['interval']) => updatePricingPlan(index, { interval: value })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                        <SelectItem value="once">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Trial Days</Label>
                    <Input type="number" placeholder="0" value={plan.trialDays} onChange={(e) => updatePricingPlan(index, { trialDays: parseInt(e.target.value) })} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Features (comma-separated)</Label>
                    <Textarea placeholder="e.g., Unlimited projects, 24/7 support" value={plan.features} onChange={(e) => updatePricingPlan(index, { features: e.target.value })} />
                  </div>
                </div>
                {pricingPlans.length > 1 && <Button variant="ghost" size="sm" onClick={() => removePricingPlan(index)} className="mt-2 text-destructive">Remove Plan</Button>}
              </Card>
            ))}
          </div>
          <Button variant="outline" onClick={addPricingPlan} className="w-full mb-6">Add Another Plan</Button>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Next: Tech Stack <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </Card>
      )}

      {/* Step 3: Tech Stack & Integrations */}
      {step === 3 && (
        <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Tech Stack & Integrations</h2>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label>Backend Framework</Label>
                    <Select value={backendStack} onValueChange={(value) => setBackendStack(value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="nextjs-api">Next.js API Routes</SelectItem>
                            <SelectItem value="nodejs-express">Node.js (Express)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-4">
                    <Label>Payment Providers</Label>
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                        <input type="checkbox" id="stripe" checked={integrationSettings.createInStripe} onChange={(e) => setIntegrationSettings({ ...integrationSettings, createInStripe: e.target.checked })} className="w-4 h-4" />
                        <Label htmlFor="stripe" className="flex-1 cursor-pointer">Create product/prices in Stripe</Label>
                    </div>
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                        <input type="checkbox" id="lemon" checked={integrationSettings.createInLemonSqueezy} onChange={(e) => setIntegrationSettings({ ...integrationSettings, createInLemonSqueezy: e.target.checked })} className="w-4 h-4" />
                        <Label htmlFor="lemon" className="flex-1 cursor-pointer">Create product/variants in Lemon Squeezy</Label>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Review & Generate <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
        </Card>
      )}

      {/* Step 4: Review & Generate */}
      {step === 4 && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Review & Generate</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Product</h3>
              <p className="text-lg">{productData.name}</p>
              <p className="text-sm text-muted-foreground">{productData.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Pricing Plans ({pricingPlans.length})</h3>
              <div className="space-y-2">
                {pricingPlans.map((plan, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded">
                    <span>{plan.name}</span>
                    <Badge>${(plan.amount / 100).toFixed(2)}/{plan.interval === "once" ? "one-time" : plan.interval}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Backend Stack</h3>
              <p>{backendStack}</p>
            </div>
             <div>
              <h3 className="font-semibold mb-2">Integrations</h3>
                <div className="flex gap-2">
                    {integrationSettings.createInStripe && <Badge>Stripe</Badge>}
                    {integrationSettings.createInLemonSqueezy && <Badge>LemonSqueezy</Badge>}
                </div>
            </div>
          </div>
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={handleGenerate} disabled={loading}>{loading ? "Generating..." : "Generate Product & Code"}</Button>
          </div>
        </Card>
      )}

    </div>
  );
}
