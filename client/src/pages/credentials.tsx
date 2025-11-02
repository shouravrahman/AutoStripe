import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Key, Trash2, MoreVertical, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const EmptyState = ({ onAddClick }) => (
    <div className="text-center p-12 border-2 border-dashed rounded-lg">
        <Key className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No Credentials Yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">Connect your payment provider accounts to start creating products.</p>
        <Button className="mt-6" onClick={onAddClick}><Plus className="h-4 w-4 mr-2" />Add Credentials</Button>
    </div>
);

const AddEditCredentialDialog = ({ open, setOpen, credential }) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [provider, setProvider] = useState('stripe');
    const [formData, setFormData] = useState({ label: '', apiKey: '', publicKey: '', storeId: '' });

    useEffect(() => {
        if (credential) {
            setProvider(credential.provider);
            setFormData({ label: credential.label, apiKey: '', publicKey: '', storeId: credential.storeId || '' });
        } else {
            setProvider('stripe');
            setFormData({ label: '', apiKey: '', publicKey: '', storeId: '' });
        }
    }, [credential, open]);

    const mutation = useMutation({
        mutationFn: (data: any) => credential 
            ? apiRequest("PATCH", `/api/credentials/${credential.id}`, data)
            : apiRequest("POST", "/api/credentials", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['credentials'] });
            toast({ title: credential ? "Credential updated!" : "Credential added!" });
            setOpen(false);
        },
        onError: (error: Error) => toast({ title: "An error occurred", description: error.message, variant: "destructive" }),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: any = {
            provider,
            label: formData.label || `My ${provider.charAt(0).toUpperCase() + provider.slice(1)} Account`,
            apiKey: formData.apiKey,
            ...(provider === 'stripe' && { publicKey: formData.publicKey }),
            ...(provider === 'lemonsqueezy' && { storeId: formData.storeId }),
        };
        if (credential) {
            Object.keys(payload).forEach(key => (payload[key] === '' || payload[key] === null) && delete payload[key]);
        }
        mutation.mutate(payload);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{credential ? 'Edit' : 'Add'} Credentials</DialogTitle>
                    <DialogDescription>Connect a new Stripe or LemonSqueezy account.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <Select onValueChange={setProvider} defaultValue={provider} disabled={!!credential}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="stripe">Stripe</SelectItem>
                            <SelectItem value="lemonsqueezy">LemonSqueezy</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input placeholder="Account Label (e.g. Production)" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} />
                    {provider === 'stripe' ? (
                        <>
                            <Input type="password" placeholder={credential ? 'New Publishable Key (optional)' : 'Publishable Key (pk_live_...)'} value={formData.publicKey} onChange={e => setFormData({...formData, publicKey: e.target.value})} className="font-mono" />
                            <Input type="password" placeholder={credential ? 'New Secret Key (optional)' : 'Secret Key (sk_live_...)'} value={formData.apiKey} onChange={e => setFormData({...formData, apiKey: e.target.value})} className="font-mono" />
                        </>
                    ) : (
                        <>
                            <Input type="password" placeholder={credential ? 'New API Key (optional)' : 'API Key'} value={formData.apiKey} onChange={e => setFormData({...formData, apiKey: e.target.value})} className="font-mono" />
                            <Input placeholder="Store ID" value={formData.storeId} onChange={e => setFormData({...formData, storeId: e.target.value})} className="font-mono" />
                        </>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save Credentials'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

const CredentialCard = ({ credential, onEdit, onDelete }) => (
    <Card>
        <CardHeader className="flex flex-row items-start justify-between">
            <div>
                <CardTitle className="text-base font-semibold">{credential.label}</CardTitle>
                <CardDescription>Added on {new Date(credential.createdAt).toLocaleDateString()}</CardDescription>
            </div>
            <Badge variant="outline" className="capitalize font-mono">{credential.provider}</Badge>
        </CardHeader>
        <CardFooter className="flex justify-end bg-muted/50 p-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEdit}><Edit className="h-4 w-4 mr-2"/>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete} className="text-destructive"><Trash2 className="h-4 w-4 mr-2"/>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </CardFooter>
    </Card>
);

const CredentialsSkeleton = () => Array.from({ length: 2 }).map((_, i) => (
    <Card key={i}>
        <CardHeader className="flex flex-row items-start justify-between">
            <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
        </CardHeader>
        <CardFooter className="flex justify-end bg-muted/50 p-3"><Skeleton className="h-8 w-8" /></CardFooter>
    </Card>
));

export default function CredentialsPage() {
   const queryClient = useQueryClient();
   const { toast } = useToast();
   const [dialogOpen, setDialogOpen] = useState(false);
   const [editingCredential, setEditingCredential] = useState(null);
   const [deletingId, setDeletingId] = useState<string | null>(null);

   const { data: credentials, isLoading, isError, error } = useQuery<any[]>({
     queryKey: ["credentials"],
     queryFn: () => apiRequest("GET", "/api/credentials"),
   });

   const deleteMutation = useMutation<void, Error, string>({
     mutationFn: (id: string) => apiRequest("DELETE", `/api/credentials/${id}`),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['credentials'] });
       toast({ title: "Credential deleted" });
       setDeletingId(null);
     },
     onError: (error) => toast({ title: "Error deleting credential", description: error.message, variant: "destructive" }),
   });

    const handleAddClick = () => {
        setEditingCredential(null);
        setDialogOpen(true);
    }

    const handleEditClick = (cred: any) => {
        setEditingCredential(cred);
        setDialogOpen(true);
    }

    if (isError) return <div className="p-8">Error: {(error as Error).message}</div>;

   return (
    <div>
        <div className="flex items-center justify-end mb-8">
            <Button onClick={handleAddClick}><Plus className="h-4 w-4 mr-2" />Add New</Button>
        </div>
        {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2"><CredentialsSkeleton /></div>
        ) : credentials && credentials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
                {credentials.map((cred) => (
                    <CredentialCard 
                        key={cred.id} 
                        credential={cred} 
                        onEdit={() => handleEditClick(cred)} 
                        onDelete={() => setDeletingId(cred.id)} 
                    />
                ))}
            </div>
        ) : <EmptyState onAddClick={handleAddClick} />}
        <AddEditCredentialDialog open={dialogOpen} setOpen={setDialogOpen} credential={editingCredential} />
        <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete this credential and may affect projects using it.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deletingId && deleteMutation.mutate(deletingId)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
   );
}
