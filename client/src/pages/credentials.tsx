import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Key, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Credentials() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [provider, setProvider] = useState<"stripe" | "lemonsqueezy">("stripe");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const { data: credentials, isLoading } = useQuery({
    queryKey: ["/api/credentials"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/credentials/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/credentials"] });
      toast({ title: "Credential deleted successfully" });
    },
  });

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">API Credentials</h1>
          <p className="text-muted-foreground">
            Manage your payment platform connections
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hover-elevate active-elevate-2" data-testid="button-add-credential">
              <Plus className="h-4 w-4 mr-2" />
              Add Credentials
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Credentials</DialogTitle>
              <DialogDescription>
                Connect your Stripe or LemonSqueezy account
              </DialogDescription>
            </DialogHeader>
            <AddCredentialForm
              provider={provider}
              setProvider={setProvider}
              onSuccess={() => {
                setDialogOpen(false);
                queryClient.invalidateQueries({ queryKey: ["/api/credentials"] });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-6 bg-muted rounded mb-4 w-1/3" />
              <div className="h-4 bg-muted rounded w-full" />
            </Card>
          ))}
        </div>
      ) : credentials && credentials.length > 0 ? (
        <div className="space-y-4">
          {credentials.map((cred: any) => (
            <Card key={cred.id} className="p-6" data-testid={`card-credential-${cred.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{cred.label || `${cred.provider} Account`}</h3>
                      <Badge variant={cred.isActive ? "default" : "secondary"}>
                        {cred.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{cred.provider}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                          {showKeys[cred.id] ? cred.encryptedApiKey.slice(0, 20) : "••••••••••••••••"}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleShowKey(cred.id)}
                          className="h-6 w-6 hover-elevate"
                        >
                          {showKeys[cred.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Added {new Date(cred.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this credential?")) {
                      deleteMutation.mutate(cred.id);
                    }
                  }}
                  className="text-destructive hover:text-destructive hover-elevate active-elevate-2"
                  data-testid={`button-delete-${cred.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No credentials yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your Stripe or LemonSqueezy API keys to get started
            </p>
            <Button onClick={() => setDialogOpen(true)} className="hover-elevate active-elevate-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Credentials
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function AddCredentialForm({ provider, setProvider, onSuccess }: any) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    apiKey: "",
    publicKey: "",
    label: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiRequest("POST", "/api/credentials", {
        provider,
        apiKey: formData.apiKey,
        publicKey: provider === "stripe" ? formData.publicKey : undefined,
        label: formData.label,
      });

      if (!response.ok) throw new Error("Failed to save credentials");

      toast({
        title: "Credentials saved!",
        description: `Your ${provider} account is now connected.`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Failed to save credentials",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={provider === "stripe" ? "default" : "outline"}
          onClick={() => setProvider("stripe")}
          className="hover-elevate active-elevate-2"
        >
          Stripe
        </Button>
        <Button
          type="button"
          variant={provider === "lemonsqueezy" ? "default" : "outline"}
          onClick={() => setProvider("lemonsqueezy")}
          className="hover-elevate active-elevate-2"
        >
          LemonSqueezy
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Label (optional)</Label>
        <Input
          placeholder={`My ${provider} account`}
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="hover-elevate"
        />
      </div>

      {provider === "stripe" && (
        <div className="space-y-2">
          <Label>Publishable Key (pk_...)</Label>
          <Input
            type="password"
            required
            placeholder="pk_live_..."
            value={formData.publicKey}
            onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
            className="font-mono hover-elevate"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>{provider === "stripe" ? "Secret Key (sk_...)" : "API Key"}</Label>
        <Input
          type="password"
          required
          placeholder={provider === "stripe" ? "sk_live_..." : "API Key"}
          value={formData.apiKey}
          onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
          className="font-mono hover-elevate"
        />
      </div>

      <Button type="submit" className="w-full hover-elevate active-elevate-2" disabled={loading}>
        {loading ? "Saving..." : "Save Credentials"}
      </Button>
    </form>
  );
}
