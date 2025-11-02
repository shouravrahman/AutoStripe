import { useState } from "react";
import { useLocation } from "wouter";
import { Key, ArrowRight, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import { useMutation } from "@tanstack/react-query";

const ProviderCard = ({ provider, icon: Icon, title, description, children, onSubmit, onSkip, isConnecting }) => (
    <Card>
        <form onSubmit={onSubmit}>
            <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {onSkip && <Button type="button" variant="ghost" onClick={onSkip}>Skip</Button>}
                <Button type="submit" disabled={isConnecting}>
                    {isConnecting ? "Connecting..." : "Connect"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </form>
    </Card>
);

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [stripeKeys, setStripeKeys] = useState({ pk: "", sk: "" });
  const [lemonApiKey, setLemonApiKey] = useState("");

  const mutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/credentials", data),
    onSuccess: (data, variables) => {
      toast({ title: `${variables.provider} Connected!`, description: `Your account is now linked.` });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({ title: "Connection Failed", description: error.message, variant: "destructive" });
    },
  });

  const handleStripeSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ provider: "stripe", publicKey: stripeKeys.pk, apiKey: stripeKeys.sk, label: "My Stripe Account" });
  };

  const handleLemonSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ provider: "lemonsqueezy", apiKey: lemonApiKey, label: "My LemonSqueezy Account" });
  };

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Zap className="h-10 w-10 mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Connect Your Platforms</h1>
          <p className="text-muted-foreground text-lg">Link your payment providers to get started. You can add more later.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProviderCard 
            provider="stripe"
            icon={Key} 
            title="Connect Stripe" 
            description="Enter your Stripe API keys."
            onSubmit={handleStripeSubmit}
            isConnecting={mutation.isPending && mutation.variables?.provider === 'stripe'}
          >
            <div className="space-y-2">
                <Label htmlFor="stripe-pk">Publishable Key</Label>
                <Input id="stripe-pk" type="password" placeholder="pk_live_..." value={stripeKeys.pk} onChange={e => setStripeKeys({...stripeKeys, pk: e.target.value})} className="font-mono" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="stripe-sk">Secret Key</Label>
                <Input id="stripe-sk" type="password" placeholder="sk_live_..." value={stripeKeys.sk} onChange={e => setStripeKeys({...stripeKeys, sk: e.target.value})} className="font-mono" />
                <p className="text-xs text-muted-foreground">Find your keys in the <a href="https://dashboard.stripe.com/apikeys" target="_blank" className="text-primary hover:underline">Stripe Dashboard</a>.</p>
            </div>
          </ProviderCard>

          <ProviderCard 
            provider="lemonsqueezy"
            icon={Key} 
            title="Connect LemonSqueezy" 
            description="Enter your LemonSqueezy API key."
            onSubmit={handleLemonSubmit}
            isConnecting={mutation.isPending && mutation.variables?.provider === 'lemonsqueezy'}
          >
            <div className="space-y-2">
                <Label htmlFor="lemon-key">API Key</Label>
                <Input id="lemon-key" type="password" placeholder="••••••••••••••••" value={lemonApiKey} onChange={e => setLemonApiKey(e.target.value)} className="font-mono" />
                 <p className="text-xs text-muted-foreground">Find your key in the <a href="https://app.lemonsqueezy.com/settings/api" target="_blank" className="text-primary hover:underline">LemonSqueezy Dashboard</a>.</p>
            </div>
          </ProviderCard>
        </div>

        <div className="mt-8 text-center">
            <Button variant="ghost" onClick={() => setLocation("/dashboard")}>I'll do this later <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 max-w-md mx-auto">
          <Check className="h-4 w-4 inline-block mr-1 text-green-500"/> 
          Your API keys are encrypted with AES-256 and stored securely. We only use them to manage your billing configurations.
        </p>
      </div>
    </div>
  );
}
