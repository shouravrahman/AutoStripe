import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Key, ArrowRight, Zap, Check, ShieldCheck, Cloud, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProviderCard = ({ provider, icon: Icon, title, description, children, onSubmit, isConnecting }) => (
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
  const queryClient = useQueryClient();

  const [dopplerStep, setDopplerStep] = useState(1);
  const [mode, setMode] = useState<"doppler" | "direct">("doppler");

  // State from dry-run page or query param
  const { dryRunData, userId: initialUserId } = history.state as any || {};
  const urlParams = new URLSearchParams(useLocation()[0].split("?")[1]);
  const projectIdFromUrl = urlParams.get("projectId");

  const [currentProjectId, setCurrentProjectId] = useState(projectIdFromUrl || null);

  // Doppler state
  const [dopplerToken, setDopplerToken] = useState("");
  const [projectName, setProjectName] = useState("autobill-project");
  const [environmentName, setEnvironmentName] = useState("dev");

  // Direct entry state
  const [stripeKeys, setStripeKeys] = useState({ sk: "", whsec: "" });
  const [lemonSqueezyKeys, setLemonSqueezyKeys] = useState({ apikey: "", whsec: "" });

  // Mutation to create project if coming from dry-run
  const createProjectMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/projects", data),
    onSuccess: (newProject) => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        setCurrentProjectId(newProject.id);
        toast({ title: "Project Created!", description: "Now connect your payment providers." });
    },
    onError: (error: any) => {
        toast({ title: "Error creating project", description: error.message, variant: "destructive" });
    }
  });

  // Effect to auto-create project if dryRunData is present
  useEffect(() => {
    if (dryRunData && !currentProjectId && !createProjectMutation.isPending) {
        createProjectMutation.mutate(dryRunData);
    }
  }, [dryRunData, currentProjectId, createProjectMutation]);

  const handleRedirect = (pId: string) => {
      if (dryRunData) {
          // If coming from dry-run, redirect to guide page
          setLocation(`/dashboard/projects/${pId}/guide`, { state: { generatedCode: dryRunData.generatedCode, product: dryRunData.product } });
      } else {
          // Otherwise, go to dashboard
          setLocation("/dashboard");
      }
  };

  const dopplerMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/credentials/doppler", data),
    onSuccess: () => {
      toast({ title: "Secrets Synced!", description: `Your keys have been securely sent to your Doppler project.` });
      if (currentProjectId) {
          handleRedirect(currentProjectId);
      } else {
          setLocation("/dashboard");
      }
    },
    onError: (error: any) => {
      toast({ title: "Sync Failed", description: error.message, variant: "destructive" });
    },
  });

  const directMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/credentials", data),
    onSuccess: (data, variables) => {
      toast({ title: `${variables.provider} Connected!`, description: `Your account is now linked.` });
      // After connecting one, check if there are others to connect or redirect
      if (variables.provider === "stripe" && lemonSqueezyKeys.apikey && !directMutation.isPending) {
          // If Lemon Squeezy keys are also provided, connect them next
          directMutation.mutate({ provider: "lemonsqueezy", apiKey: lemonSqueezyKeys.apikey, webhookSecret: lemonSqueezyKeys.whsec, label: "My LemonSqueezy Account" });
      } else if (variables.provider === "lemonsqueezy" && stripeKeys.sk && !directMutation.isPending) {
          // If Stripe keys are also provided, connect them next
          directMutation.mutate({ provider: "stripe", apiKey: stripeKeys.sk, webhookSecret: stripeKeys.whsec, label: "My Stripe Account" });
      } else {
          if (currentProjectId) {
              handleRedirect(currentProjectId);
          } else {
              setLocation("/dashboard");
          }
      }
    },
    onError: (error: any) => {
      toast({ title: "Connection Failed", description: error.message, variant: "destructive" });
    },
  });

  const handleDopplerStep1Submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!dopplerToken) {
          toast({ title: "Doppler Token is required", variant: "destructive" });
          return;
      }
      setDopplerStep(2);
  };

  const handleDopplerStep2Submit = (e: React.FormEvent) => {
      e.preventDefault();
      dopplerMutation.mutate({ dopplerToken, projectName, environmentName, secrets: { ...secrets, stripe_sk: stripeKeys.sk, stripe_whsec: stripeKeys.whsec, lemonsqueezy_apikey: lemonSqueezyKeys.apikey, lemonsqueezy_whsec: lemonSqueezyKeys.whsec } });
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For direct entry, we'll connect Stripe and Lemon Squeezy separately if keys are provided
    if (stripeKeys.sk && !directMutation.isPending) {
        directMutation.mutate({ provider: "stripe", apiKey: stripeKeys.sk, webhookSecret: stripeKeys.whsec, label: "My Stripe Account" });
    } else if (lemonSqueezyKeys.apikey && !directMutation.isPending) {
        directMutation.mutate({ provider: "lemonsqueezy", apiKey: lemonSqueezyKeys.apikey, webhookSecret: lemonSqueezyKeys.whsec, label: "My LemonSqueezy Account" });
    } else if (!stripeKeys.sk && !lemonSqueezyKeys.apikey) {
        toast({ title: "Please enter at least one API key", variant: "destructive" });
    } else {
        // All keys processed or no keys to process
        if (currentProjectId) {
            handleRedirect(currentProjectId);
        } else {
            setLocation("/dashboard");
        }
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <ShieldCheck className="h-10 w-10 mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Connect Your Platforms</h1>
          <p className="text-muted-foreground text-lg">Choose how you want to manage your payment provider credentials.</p>
        </div>

        <Tabs value={mode} onValueChange={(value: "doppler" | "direct") => setMode(value)} className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="doppler"><Cloud className="mr-2 h-4 w-4" />Connect with Doppler</TabsTrigger>
                <TabsTrigger value="direct"><Database className="mr-2 h-4 w-4" />Enter Keys Directly</TabsTrigger>
            </TabsList>
            <TabsContent value="doppler" className="mt-4">
                {dopplerStep === 1 && (
                    <Card>
                        <form onSubmit={handleDopplerStep1Submit}>
                            <CardHeader>
                                <CardTitle>Step 1: Authorize Doppler</CardTitle>
                                <CardDescription>Provide a Doppler Service Token to authorize us to write secrets to your project.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="doppler-token">Doppler Service Token</Label>
                                    <Input id="doppler-token" type="password" placeholder="dtst_..." value={dopplerToken} onChange={e => setDopplerToken(e.target.value)} className="font-mono" />
                                    <p className="text-xs text-muted-foreground">Create a token with write access from your <a href="https://docs.doppler.com/reference/service-tokens" target="_blank" className="text-primary hover:underline">Doppler dashboard</a>.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="doppler-project">Doppler Project Name</Label>
                                    <Input id="doppler-project" value={projectName} onChange={e => setProjectName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="doppler-env">Doppler Environment Name</Label>
                                    <Input id="doppler-env" value={environmentName} onChange={e => setEnvironmentName(e.target.value)} />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button type="submit">Continue to Step 2 <ArrowRight className="ml-2 h-4 w-4" /></Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}

                {dopplerStep === 2 && (
                    <Card>
                        <form onSubmit={handleDopplerStep2Submit}>
                            <CardHeader>
                                <CardTitle>Step 2: Add Your Secrets</CardTitle>
                                <CardDescription>These keys will be sent directly to `{projectName}/{environmentName}` in your Doppler project.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4 p-4 border rounded-lg">
                                    <h3 className="font-semibold">Stripe</h3>
                                    <div className="space-y-2">
                                        <Label>Secret Key</Label>
                                        <Input type="password" placeholder="sk_live_..." value={stripeKeys.sk} onChange={e => setStripeKeys({...stripeKeys, sk: e.target.value})} className="font-mono" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Webhook Signing Secret</Label>
                                        <Input type="password" placeholder="whsec_..." value={stripeKeys.whsec} onChange={e => setStripeKeys({...stripeKeys, whsec: e.target.value})} className="font-mono" />
                                    </div>
                                </div>
                                 <div className="space-y-4 p-4 border rounded-lg">
                                    <h3 className="font-semibold">Lemon Squeezy</h3>
                                    <div className="space-y-2">
                                        <Label>API Key</Label>
                                        <Input type="password" placeholder="••••••••••••••••" value={lemonSqueezyKeys.apikey} onChange={e => setLemonSqueezyKeys({...lemonSqueezyKeys, apikey: e.target.value})} className="font-mono" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Webhook Signing Secret</Label>
                                        <Input type="password" placeholder="••••••••••••••••" value={lemonSqueezyKeys.whsec} onChange={e => setLemonSqueezyKeys({...lemonSqueezyKeys, whsec: e.target.value})} className="font-mono" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button type="button" variant="ghost" onClick={() => setDopplerStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                                <Button type="submit" disabled={dopplerMutation.isPending}>
                                    {dopplerMutation.isPending ? "Syncing..." : "Sync Secrets to Doppler"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}
            </TabsContent>
            <TabsContent value="direct" className="mt-4">
                <Card>
                    <form onSubmit={handleDirectSubmit}>
                        <CardHeader>
                            <CardTitle>Enter Keys Directly</CardTitle>
                            <CardDescription>For quick testing with test mode accounts. Your keys will be encrypted and stored in our database.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-semibold">Stripe</h3>
                                <div className="space-y-2">
                                    <Label>Secret Key</Label>
                                    <Input type="password" placeholder="sk_test_..." value={stripeKeys.sk} onChange={e => setStripeKeys({...stripeKeys, sk: e.target.value})} className="font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Webhook Signing Secret</Label>
                                    <Input type="password" placeholder="whsec_..." value={stripeKeys.whsec} onChange={e => setStripeKeys({...stripeKeys, whsec: e.target.value})} className="font-mono" />
                                </div>
                            </div>
                             <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-semibold">Lemon Squeezy</h3>
                                <div className="space-y-2">
                                    <Label>API Key</Label>
                                    <Input type="password" placeholder="••••••••••••••••" value={lemonSqueezyKeys.apikey} onChange={e => setLemonSqueezyKeys({...lemonSqueezyKeys, apikey: e.target.value})} className="font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Webhook Signing Secret</Label>
                                    <Input type="password" placeholder="••••••••••••••••" value={lemonSqueezyKeys.whsec} onChange={e => setLemonSqueezyKeys({...lemonSqueezyKeys, whsec: e.target.value})} className="font-mono" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={directMutation.isPending}>
                                {directMutation.isPending ? "Connecting..." : "Connect Keys"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
        </Tabs>

        <p className="text-center text-xs text-muted-foreground mt-8 max-w-md mx-auto">
          <ShieldCheck className="h-4 w-4 inline-block mr-1 text-primary"/> 
          Your keys are never stored on our servers. They are sent directly to your Doppler project.
        </p>
      </div>
    </div>
  );
}