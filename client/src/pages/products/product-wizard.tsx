import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Sparkles, Globe, Check, Copy } from "lucide-react";
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
import { apiRequest, queryClient } from "@/lib/queryClient";

type PricingPlan = {
  name: string;
  amount: number;
  currency: string;
  interval: "month" | "year" | "once";
  trialDays: number;
};

const templates = [
  {
    name: "Standard SaaS",
    plans: [
      { name: "Basic", amount: 1000, currency: "usd", interval: "month", trialDays: 0 },
      { name: "Pro", amount: 2900, currency: "usd", interval: "month", trialDays: 14 },
      { name: "Enterprise", amount: 7900, currency: "usd", interval: "month", trialDays: 0 },
    ],
  },
  {
    name: "Freemium",
    plans: [
      { name: "Free", amount: 0, currency: "usd", interval: "month", trialDays: 0 },
      { name: "Pro", amount: 4900, currency: "usd", interval: "month", trialDays: 0 },
    ],
  },
  {
    name: "Lifetime Deal",
    plans: [
      { name: "Lifetime", amount: 19900, currency: "usd", interval: "once", trialDays: 0 },
    ],
  },
];

export default function ProductWizard() {
  const { projectId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isPricingLoading, setIsPricingLoading] = useState(false);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    features: "",
  });

  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([
    { name: "Pro", amount: 2900, currency: "usd", interval: "month", trialDays: 0 },
  ]);

  const [integrationSettings, setIntegrationSettings] = useState({
    stripeCredentialId: "",
    lemonSqueezyCredentialId: "",
    createInStripe: true,
    createInLemonSqueezy: true,
    setupWebhooks: true,
    webhookUrl: "",
  });

  const [generationTarget, setGenerationTarget] = useState("nextjs");


  const handleAiSuggestion = async () => {
    setAiLoading(true);
    try {
      const response = await apiRequest("POST", "/api/ai/suggest-description", {
        productName: productData.name,
      });
      const data = await response.json();
      setProductData({ ...productData, description: data.suggestion });
      toast({ title: "AI suggestion applied!", description: "Product description generated." });
    } catch (error) {
      toast({ title: "AI suggestion failed", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuggestPricing = async () => {
    if (!productData.description) {
      toast({
        title: "Description is missing",
        description: "Please add a description before suggesting pricing.",
        variant: "destructive",
      });
      return;
    }
    setIsPricingLoading(true);
    try {
      const response = await apiRequest("POST", "/api/ai/suggest-pricing-tiers", {
        productName: productData.name,
        description: productData.description,
        features: productData.features,
      });
      const data = await response.json();
      
      if (data.suggestions && data.suggestions.length > 0) {
        const formattedPlans = data.suggestions.map((plan: any) => ({
          name: plan.name || "New Plan",
          amount: plan.amount || 0,
          currency: plan.currency || "usd",
          interval: plan.interval || "month",
          trialDays: plan.trialDays || 0,
        }));
        setPricingPlans(formattedPlans);
        toast({ title: "AI pricing applied!", description: "Review the suggested tiers." });
      } else {
        throw new Error("No suggestions received from AI.");
      }
    } catch (error) {
      toast({ title: "AI pricing suggestion failed", variant: "destructive" });
    } finally {
      setIsPricingLoading(false);
    }
  };

  const handleWebScrape = async () => {
    const url = prompt("Enter your landing page URL:");
    if (!url) return;

    setAiLoading(true);
    try {
      const response = await apiRequest("POST", "/api/scrape/extract", { url });
      const data = await response.json();
      if (data.extractedData) {
        setProductData({
          name: data.extractedData.name || productData.name,
          description: data.extractedData.description || productData.description,
          features: data.extractedData.features || productData.features,
        });
        toast({ title: "Data extracted!", description: "Product info loaded from your page." });
      }
    } catch (error) {
      toast({ title: "Scraping failed", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const addPricingPlan = () => {
    setPricingPlans([
      ...pricingPlans,
      { name: "", amount: 0, currency: "usd", interval: "month", trialDays: 0 },
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
      const productResponse = await apiRequest("POST", "/api/products/generate", {
        projectId,
        product: productData,
        pricingPlans,
        integrationSettings,
      });

      if (!productResponse.ok) throw new Error("Failed to generate product");
      const productResult = await productResponse.json();

      toast({
        title: "Product created!",
        description: "Now generating code snippet...",
      });

      const codeResponse = await apiRequest("POST", "/api/ai/generate-code", {
        product: productResult, // Use the full product data from the first response
        generationType: generationTarget,
      });

      const codeResult = await codeResponse.json();

      // Redirect to the guide page with state
      setLocation(`/dashboard/projects/${projectId}/guide`, {
        state: { generatedCode: codeResult.code, product: productResult },
      });

      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Button
        variant="ghost"
        onClick={() => setLocation(`/dashboard/projects/${projectId}`)}
        className="mb-6 hover-elevate active-elevate-2"
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

      {/* Step 0: Template Selection */}
      {step === 0 && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Start from a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {templates.map((template) => (
              <Card
                key={template.name}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setPricingPlans(template.plans);
                  setStep(1);
                }}
              >
                <h3 className="font-semibold">{template.name}</h3>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button variant="link" onClick={() => setStep(1)}>
              Or start from scratch
            </Button>
          </div>
        </Card>
      )}

      {/* Step 1: Product Info */}
      {step === 1 && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Product Information</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., AI Resume Writer Pro"
                required
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                data-testid="input-product-name"
                className="hover-elevate"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Description</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAiSuggestion}
                    disabled={!productData.name || aiLoading}
                    className="hover-elevate active-elevate-2"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Suggest
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleWebScrape}
                    disabled={aiLoading}
                    className="hover-elevate active-elevate-2"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    Scrape URL
                  </Button>
                </div>
              </div>
              <Textarea
                id="description"
                placeholder="Describe your product..."
                rows={4}
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                data-testid="input-product-description"
                className="hover-elevate resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Textarea
                id="features"
                placeholder="e.g., Unlimited projects, 24/7 support, Custom domains"
                rows={3}
                value={productData.features}
                onChange={(e) => setProductData({ ...productData, features: e.target.value })}
                className="hover-elevate resize-none"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)} className="hover-elevate active-elevate-2">
                Back
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!productData.name}
                className="hover-elevate active-elevate-2"
              >
                Next: Pricing Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Pricing Plans */}
      {step === 2 && (
        <Card className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Pricing Plans</h2>
            <Button
              variant="outline"
              onClick={handleSuggestPricing}
              disabled={isPricingLoading}
              className="hover-elevate active-elevate-2"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isPricingLoading ? "Suggesting..." : "Suggest Pricing Tiers"}
            </Button>
          </div>
          
          <div className="space-y-4 mb-6">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className="p-4 border">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Plan Name</Label>
                    <Input
                      placeholder="e.g., Pro, Lifetime"
                      value={plan.name}
                      onChange={(e) => updatePricingPlan(index, { name: e.target.value })}
                      className="hover-elevate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount (cents)</Label>
                    <Input
                      type="number"
                      placeholder="2900"
                      value={plan.amount}
                      onChange={(e) => updatePricingPlan(index, { amount: parseInt(e.target.value) })}
                      className="hover-elevate"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Interval</Label>
                    <Select
                      value={plan.interval}
                      onValueChange={(value: any) => updatePricingPlan(index, { interval: value })}
                    >
                      <SelectTrigger className="hover-elevate">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                        <SelectItem value="once">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Trial Days</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={plan.trialDays}
                      onChange={(e) => updatePricingPlan(index, { trialDays: parseInt(e.target.value) })}
                      className="hover-elevate"
                    />
                  </div>
                </div>
                {pricingPlans.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePricingPlan(index)}
                    className="mt-2 text-destructive hover-elevate"
                  >
                    Remove Plan
                  </Button>
                )}
              </Card>
            ))}
          </div>

          <Button variant="outline" onClick={addPricingPlan} className="w-full mb-6 hover-elevate active-elevate-2">
            Add Another Plan
          </Button>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)} className="hover-elevate active-elevate-2">
              Back
            </Button>
            <Button onClick={() => setStep(3)} className="hover-elevate active-elevate-2">
              Next: Integrations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Integration Settings */}
      {step === 3 && (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Integration Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <input
                type="checkbox"
                id="stripe"
                checked={integrationSettings.createInStripe}
                onChange={(e) => setIntegrationSettings({ ...integrationSettings, createInStripe: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="stripe" className="flex-1 cursor-pointer">Create in Stripe</Label>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <input
                type="checkbox"
                id="lemon"
                checked={integrationSettings.createInLemonSqueezy}
                onChange={(e) => setIntegrationSettings({ ...integrationSettings, createInLemonSqueezy: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="lemon" className="flex-1 cursor-pointer">Create in LemonSqueezy</Label>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <input
                type="checkbox"
                id="webhooks"
                checked={integrationSettings.setupWebhooks}
                onChange={(e) => setIntegrationSettings({ ...integrationSettings, setupWebhooks: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="webhooks" className="flex-1 cursor-pointer">Auto-setup webhooks</Label>
            </div>

            {integrationSettings.setupWebhooks && (
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  placeholder="https://your-app.com/api/webhooks"
                  value={integrationSettings.webhookUrl}
                  onChange={(e) => setIntegrationSettings({ ...integrationSettings, webhookUrl: e.target.value })}
                  className="hover-elevate"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setStep(2)} className="hover-elevate active-elevate-2">
              Back
            </Button>
            <Button onClick={() => setStep(4)} className="hover-elevate active-elevate-2">
              Review & Generate
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Review */}
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
              <h3 className="font-semibold mb-2">Will be created in:</h3>
              <div className="flex gap-2">
                {integrationSettings.createInStripe && <Badge>Stripe</Badge>}
                {integrationSettings.createInLemonSqueezy && <Badge>LemonSqueezy</Badge>}
              </div>
            </div>

            <div className="space-y-2">
                <Label>What do you want to generate?</Label>
                <Select value={generationTarget} onValueChange={setGenerationTarget}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="nextjs">Next.js Pricing Page</SelectItem>
                        <SelectItem value="node">Node.js Webhook Handler</SelectItem>
                        <SelectItem value="json">JSON Config</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setStep(3)} className="hover-elevate active-elevate-2">
              Back
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="hover-elevate active-elevate-2"
              data-testid="button-generate"
            >
              {loading ? "Generating..." : "Generate Product & Code"}
            </Button>
          </div>
        </Card>
      )}



    </div>
  );
}