import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Key, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import { useMutation } from "@tanstack/react-query";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
   const [step, setStep] = useState(1);

  const [stripeData, setStripeData] = useState({
    publicKey: "",
    secretKey: "",
    label: "My Stripe Account",
  });

  const [lemonData, setLemonData] = useState({
    apiKey: "",
    label: "My LemonSqueezy Account",
  });

   const createCredentialMutation = useMutation({
      mutationFn: (data: any) => apiRequest("POST", "/api/credentials", data),
      onSuccess: (data, variables) => {
      toast({
         title: `${variables.provider} connected!`,
         description: `Your ${variables.provider} account is now linked.`,
      });
       if (variables.provider === 'stripe') {
          setStep(2);
        } else {
           setTimeout(() => setLocation("/dashboard"), 1500);
        }
     },
     onError: (error: any) => {
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
     },
  });

   const handleStripeSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      createCredentialMutation.mutate({
         provider: "stripe",
         apiKey: stripeData.secretKey,
         publicKey: stripeData.publicKey,
         label: stripeData.label,
      });
  };

  const handleLemonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     createCredentialMutation.mutate({
        provider: "lemonsqueezy",
        apiKey: lemonData.apiKey,
        label: lemonData.label,
       // storeId will be added here once that flow is complete
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Connect Your Accounts</h1>
          <p className="text-muted-foreground">
            Link your payment platforms to start automating
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            {step > 1 ? <CheckCircle className="h-5 w-5" /> : <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold">1</div>}
            <span className="text-sm font-medium hidden sm:inline">Stripe</span>
          </div>
          <div className="h-0.5 w-12 bg-border" />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            {step > 2 ? <CheckCircle className="h-5 w-5" /> : <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold">2</div>}
            <span className="text-sm font-medium hidden sm:inline">LemonSqueezy</span>
          </div>
        </div>

        {/* Step 1: Stripe */}
        {step === 1 && (
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Connect Stripe</h2>
                <p className="text-sm text-muted-foreground">Enter your Stripe API keys</p>
              </div>
            </div>

            <form onSubmit={handleStripeSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stripe-label">Account Label (optional)</Label>
                <Input
                  id="stripe-label"
                  placeholder="e.g., My Production Stripe"
                  value={stripeData.label}
                  onChange={(e) => setStripeData({ ...stripeData, label: e.target.value })}
                  data-testid="input-stripe-label"
                  className="hover-elevate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-public">Publishable Key (pk_...)</Label>
                <Input
                  id="stripe-public"
                  type="password"
                  placeholder="pk_live_..."
                  required
                  value={stripeData.publicKey}
                  onChange={(e) => setStripeData({ ...stripeData, publicKey: e.target.value })}
                  data-testid="input-stripe-public"
                  className="font-mono hover-elevate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-secret">Secret Key (sk_...)</Label>
                <Input
                  id="stripe-secret"
                  type="password"
                  placeholder="sk_live_..."
                  required
                  value={stripeData.secretKey}
                  onChange={(e) => setStripeData({ ...stripeData, secretKey: e.target.value })}
                  data-testid="input-stripe-secret"
                  className="font-mono hover-elevate"
                />
                <p className="text-xs text-muted-foreground">
                  Get your keys from{" "}
                  <a
                    href="https://dashboard.stripe.com/apikeys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    dashboard.stripe.com/apikeys
                  </a>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 hover-elevate active-elevate-2"
                          disabled={createCredentialMutation.isPending}
                  data-testid="button-connect-stripe"
                >
                          {createCredentialMutation.isPending ? "Connecting..." : "Connect Stripe"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="hover-elevate active-elevate-2"
                >
                  Skip
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Step 2: LemonSqueezy */}
        {step === 2 && (
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Connect LemonSqueezy</h2>
                <p className="text-sm text-muted-foreground">Enter your LemonSqueezy API key</p>
              </div>
            </div>

            <form onSubmit={handleLemonSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="lemon-label">Account Label (optional)</Label>
                <Input
                  id="lemon-label"
                  placeholder="e.g., My LemonSqueezy Store"
                  value={lemonData.label}
                  onChange={(e) => setLemonData({ ...lemonData, label: e.target.value })}
                  data-testid="input-lemon-label"
                  className="hover-elevate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lemon-api">API Key</Label>
                <Input
                  id="lemon-api"
                  type="password"
                  placeholder="Enter your LemonSqueezy API key"
                  required
                  value={lemonData.apiKey}
                  onChange={(e) => setLemonData({ ...lemonData, apiKey: e.target.value })}
                  data-testid="input-lemon-api"
                  className="font-mono hover-elevate"
                />
                <p className="text-xs text-muted-foreground">
                  Get your API key from{" "}
                  <a
                    href="https://app.lemonsqueezy.com/settings/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    app.lemonsqueezy.com/settings/api
                  </a>
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="hover-elevate active-elevate-2"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 hover-elevate active-elevate-2"
                          disabled={createCredentialMutation.isPending}
                  data-testid="button-connect-lemon"
                >
                          {createCredentialMutation.isPending ? "Connecting..." : "Connect & Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                          onClick={() => setLocation("/dashboard")} // Changed to use wouter's setLocation
                  className="hover-elevate active-elevate-2"
                >
                  Skip
                </Button>
              </div>
            </form>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground mt-6">
          🔒 Your API keys are encrypted and stored securely. We never access your payment data.
        </p>
      </div>
    </div>
  );
}
