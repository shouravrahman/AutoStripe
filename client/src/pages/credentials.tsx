import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Key, Trash2, RefreshCw } from "lucide-react";
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";

interface Credential {
   id: string;
   provider: 'stripe' | 'lemonsqueezy';
   label: string;
   isActive: boolean;
   createdAt: string;
}

export default function Credentials() {
  const { toast } = useToast();
   const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
   const [provider, setProvider] = useState<"stripe" | "lemonsqueezy">("stripe");

  const { data: credentials, isLoading } = useQuery({
     queryKey: ["credentials"],
     queryFn: () => apiRequest<Credential[]>("GET", "/api/credentials"),
  });

   const createCredentialMutation = useMutation({
      mutationFn: (newCredential: any) => apiRequest<Credential>("POST", "/api/credentials", newCredential),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["credentials"] });
         toast({ title: "Credential created successfully" });
         setDialogOpen(false);
      },
      onError: (error: any) => {
         toast({
            title: "Error creating credential",
            description: error.message,
            variant: "destructive",
         });
      },
  });

  const deleteMutation = useMutation({
     mutationFn: (id: string) => apiRequest<void>("DELETE", `/api/credentials/${id}`),
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["credentials"] });
      toast({ title: "Credential deleted successfully" });
    },
     onError: (error: any) => {
        toast({
           title: "Error deleting credential",
           description: error.message,
           variant: "destructive",
        });
     },
  });

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
                 <Button
                    className="hover-elevate active-elevate-2"
                    data-testid="button-add-credential"
                 >
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
                    onSubmit={createCredentialMutation.mutate}
                    isPending={createCredentialMutation.isPending}
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
             <Card
                key={cred.id}
                className="p-6"
                data-testid={`card-credential-${cred.id}`}
             >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">
                               {cred.label || `${cred.provider} Account`}
                            </h3>
                      <Badge variant={cred.isActive ? "default" : "secondary"}>
                        {cred.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{cred.provider}</Badge>
                    </div>
                         <div className="space-y-2">
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
                     if (
                        confirm("Are you sure you want to delete this credential?")
                     ) {
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
                       <Button
                          onClick={() => setDialogOpen(true)}
                          className="hover-elevate active-elevate-2"
                       >
              <Plus className="h-4 w-4 mr-2" />
              Add Credentials
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function AddCredentialForm({
   provider,
   setProvider,
   onSubmit,
   isPending,
}: any) {
   const { toast } = useToast();
   const [fetchedStores, setFetchedStores] = useState<any[] | null>(null);
   const [showManualStoreInput, setShowManualStoreInput] = useState(false);

   const fetchStoresMutation = useMutation({
      mutationFn: (apiKey: string) =>
         apiRequest<any[]>("POST", "/api/lemonsqueezy/stores", { apiKey }),
      onSuccess: (data) => {
         if (data && data.length > 0) {
            setFetchedStores(data);
            setShowManualStoreInput(false);
            toast({ title: "Stores fetched successfully!" });
         } else {
            toast({ title: "No stores found for this API key.", variant: "destructive" });
            setShowManualStoreInput(true);
         }
      },
      onError: (error: any) => {
         toast({ title: "Failed to fetch stores", description: error.message, variant: "destructive" });
         setShowManualStoreInput(true);
      }
   });

  const [formData, setFormData] = useState({
    apiKey: "",
    publicKey: "",
     storeId: "",
    label: "",
  });

   const handleFetchStores = () => {
      if (!formData.apiKey) {
         toast({ title: "Please enter an API key first.", variant: "destructive" });
         return;
      }
      fetchStoresMutation.mutate(formData.apiKey);
   }

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      onSubmit({
        provider,
        apiKey: formData.apiKey,
        publicKey: provider === "stripe" ? formData.publicKey : undefined,
         storeId: provider === "lemonsqueezy" ? formData.storeId : undefined,
        label: formData.label,
      });
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

        {provider === "lemonsqueezy" && (
           <div className="space-y-2">
              <Label>API Key</Label>
              <div className="flex gap-2">
                 <Input
                    type="password"
                    required
                    placeholder="Enter your LemonSqueezy API key"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="font-mono hover-elevate"
                 />
                 <Button type="button" variant="secondary" onClick={handleFetchStores} disabled={fetchStoresMutation.isPending}>
                    <RefreshCw className={`h-4 w-4 ${fetchStoresMutation.isPending ? 'animate-spin' : ''}`} />
                 </Button>
              </div>
           </div>
        )}

        {provider === "lemonsqueezy" && fetchedStores && !showManualStoreInput ? (
           <div className="space-y-2">
              <Label>Select Store</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, storeId: value })} required>
                 <SelectTrigger className="hover-elevate">
                    <SelectValue placeholder="Select a store..." />
                 </SelectTrigger>
                 <SelectContent>
                    {fetchedStores.map(store => (
                       <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                    ))}
                 </SelectContent>
              </Select>
              <Button type="button" variant="outline" className="p-0 h-auto text-xs" onClick={() => setShowManualStoreInput(true)}>Enter Store ID Manually</Button>
           </div>
        ) : provider === "lemonsqueezy" ? (
           <div className="space-y-2">
              <Label>Store ID</Label>
              <Input required placeholder="e.g., 12345" value={formData.storeId} onChange={(e) => setFormData({ ...formData, storeId: e.target.value })} className="hover-elevate" />
           </div>
        ) : null}

      {provider === "stripe" && (
        <div className="space-y-2">
          <Label>Publishable Key (pk_...)</Label>
          <Input
            type="password"
            required
            placeholder="pk_live_..."
            value={formData.publicKey}
                 onChange={(e) =>
                    setFormData({ ...formData, publicKey: e.target.value })
                 }
            className="font-mono hover-elevate"
          />
        </div>
      )}

        {provider === "stripe" && (
           <div className="space-y-2">
              <Label>Secret Key (sk_...)</Label>
              <Input
                 type="password"
                 required
                 placeholder="sk_live_..."
                 value={formData.apiKey}
                 onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                 className="font-mono hover-elevate"
              />
           </div>
        )}

        <Button
           type="submit"
           className="w-full hover-elevate active-elevate-2"
           disabled={isPending}
        >
           {isPending ? "Saving..." : "Save Credentials"}
      </Button>
    </form>
  );
}
