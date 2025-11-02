import { useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Zap, LayoutDashboard, Folder, Package, Key, Settings, LogOut, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Checkbox } from "@/components/ui/checkbox";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Folder, label: "Projects", href: "/dashboard/projects" },
    { icon: Package, label: "Products", href: "/dashboard/products" },
    { icon: Key, label: "API Credentials", href: "/dashboard/credentials" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const templates = [
    { id: 'saas', name: 'Standard SaaS', description: 'Monthly/yearly subscriptions.', plans: [ { name: 'Basic', price: 2900, interval: 'month', features: 'Basic features' }, { name: 'Pro', price: 9900, interval: 'month', features: 'Advanced features' } ] },
    { id: 'payg', name: 'Pay-as-you-go', description: 'Usage-based credit system.', plans: [ { name: '100 Credits', price: 1000, interval: 'once', features: 'Pay per use' } ] },
    { id: 'custom', name: 'Custom', description: 'Start from a blank slate.', plans: [] },
];

const ProgressStep = ({ num, label, isActive }) => (
    <div className="flex flex-col items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{num}</div>
        <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{label}</p>
    </div>
);

export default function ProductWizardPage() {
    const { projectId } = useParams();
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [step, setStep] = useState(0);

    const [productData, setProductData] = useState({ name: "", description: "" });
    const [variants, setVariants] = useState([]);
    const [techStack, setTechStack] = useState({ backend: 'nextjs-api' });
    const [integrations, setIntegrations] = useState({ stripe: true, lemonsqueezy: false });

    const mutation = useMutation({
        mutationFn: (newData: any) => apiRequest("POST", '/api/ai/generate-product', newData),
        onSuccess: (data: any) => {
            toast({ title: "Product Generation Complete", description: 'Code has been generated successfully.' });
            queryClient.invalidateQueries({ queryKey: ['products', { projectId }] });
            setLocation(`/dashboard/products/${data.product.id}/guide`);
        },
        onError: (err: Error) => toast({ title: 'Generation Failed', description: err.message, variant: 'destructive' })
    });

    const handleTemplateSelect = (templateId) => {
        const t = templates.find(tmp => tmp.id === templateId);
        if(t) setVariants(t.plans.map(p => ({ ...p, isUsageBased: templateId === 'payg' })));
        setStep(1);
    };

    const handleAddVariant = () => setVariants([...variants, { name: '', price: 0, interval: 'month', features: '', isUsageBased: false }]);
    const handleRemoveVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
    const handleUpdateVariant = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleSubmit = () => {
        mutation.mutate({ projectId, product: productData, variants, techStack, integrations });
    };

    const steps = ['Template', 'Details', 'Pricing', 'Tech', 'Review'];

    return (
        <div className="max-w-3xl mx-auto">
            <Button variant="ghost" asChild className="mb-4"><Link href={`/dashboard/projects/${projectId}`}><ArrowLeft className="h-4 w-4 mr-2" />Back to Project</Link></Button>
            <div className="flex justify-around items-center my-8 p-4 bg-background rounded-lg shadow-sm">{steps.map((s, i) => <ProgressStep key={i} num={i + 1} label={s} isActive={step >= i} />)}</div>
            
            {step === 0 && (
                <Card>
                    <CardHeader><CardTitle>Choose a Template</CardTitle><CardDescription>Select a starting point for your product.</CardDescription></CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-4">
                        {templates.map(t => (
                            <Card key={t.id} className={`p-6 cursor-pointer hover:border-primary ${t.id === 'custom' ? 'md:col-span-3' : ''}`} onClick={() => handleTemplateSelect(t.id)}>
                                <h3 className="font-bold">{t.name}</h3>
                                <p className="text-sm text-muted-foreground">{t.description}</p>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )}

            {step === 1 && (
                <Card>
                    <CardHeader><CardTitle>Product Details</CardTitle><CardDescription>Give your product a name and description.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label htmlFor="name">Product Name</Label><Input id="name" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} placeholder="e.g., My Awesome Product" /></div>
                        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} placeholder="A short summary of your product."/></div>
                    </CardContent>
                    <CardFooter className="flex justify-between"><Button variant="outline" onClick={() => setStep(0)}>Back</Button><Button onClick={() => setStep(2)} disabled={!productData.name}>Next <ArrowRight className="ml-2 h-4 w-4"/></Button></CardFooter>
                </Card>
            )}

            {step === 2 && (
                <Card>
                    <CardHeader><CardTitle>Pricing Plans</CardTitle><CardDescription>Define the pricing tiers for your product.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        {variants.map((v, i) => (
                            <Card key={i} className="p-4 bg-muted/50"><div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Plan Name</Label><Input value={v.name} onChange={e => handleUpdateVariant(i, 'name', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Price (in cents)</Label><Input type="number" value={v.price} onChange={e => handleUpdateVariant(i, 'price', parseInt(e.target.value))}/></div>
                                <div className="space-y-2"><Label>Billing Interval</Label><Select value={v.interval} onValueChange={val => handleUpdateVariant(i, 'interval', val)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="month">Monthly</SelectItem><SelectItem value="year">Yearly</SelectItem><SelectItem value="once">One-time</SelectItem></SelectContent></Select></div>
                                <div className="flex items-center space-x-2 pt-6"><Checkbox id={`usage-${i}`} checked={v.isUsageBased} onCheckedChange={val => handleUpdateVariant(i, 'isUsageBased', val)}/><Label htmlFor={`usage-${i}`}>Is Usage-Based?</Label></div>
                            </div><Button variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => handleRemoveVariant(i)}>Remove Plan</Button></Card>
                        ))}
                        <Button variant="outline" className="w-full" onClick={handleAddVariant}>Add Plan</Button>
                    </CardContent>
                    <CardFooter className="flex justify-between"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={() => setStep(3)}>Next <ArrowRight className="ml-2 h-4 w-4"/></Button></CardFooter>
                </Card>
            )}

                {step === 3 && (
                <Card>
                    <CardHeader><CardTitle>Tech Stack & Integrations</CardTitle><CardDescription>Choose your backend and payment providers.</CardDescription></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2"><Label>Backend Framework</Label><Select value={techStack.backend} onValueChange={val => setTechStack({ backend: val })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="nextjs-api">Next.js (API Routes)</SelectItem><SelectItem value="nodejs-express">Node.js (Express)</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label>Payment Providers</Label><div className="space-y-2">
                            <div className="flex items-center gap-2 p-4 border rounded-lg"><Checkbox id="stripe" checked={integrations.stripe} onCheckedChange={val => setIntegrations({...integrations, stripe: !!val })}/><Label htmlFor="stripe">Stripe</Label></div>
                            <div className="flex items-center gap-2 p-4 border rounded-lg"><Checkbox id="lemonsqueezy" checked={integrations.lemonsqueezy} onCheckedChange={val => setIntegrations({...integrations, lemonsqueezy: !!val })}/><Label htmlFor="lemonsqueezy">Lemon Squeezy</Label></div>
                        </div></div>
                    </CardContent>
                    <CardFooter className="flex justify-between"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button onClick={() => setStep(4)}>Next <ArrowRight className="ml-2 h-4 w-4"/></Button></CardFooter>
                </Card>
            )}

            {step === 4 && (
                <Card>
                    <CardHeader><CardTitle>Review and Generate</CardTitle><CardDescription>Confirm your settings before generating the code.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div><h4 className="font-semibold">Product:</h4><p>{productData.name}</p></div>
                        <div><h4 className="font-semibold">Plans:</h4><ul className="list-disc list-inside">{variants.map((v, i) => <li key={i}>{v.name} - ${(v.price/100).toFixed(2)}/{v.interval}</li>)}</ul></div>
                        <div><h4 className="font-semibold">Backend:</h4><p>{techStack.backend}</p></div>
                        <div><h4 className="font-semibold">Providers:</h4><p>{Object.entries(integrations).filter(([,v])  => v).map(([k]) => k).join(', ')}</p></div>
                    </CardContent>
                    <CardFooter className="flex justify-between"><Button variant="outline" onClick={() => setStep(3)}>Back</Button><Button onClick={handleSubmit} disabled={mutation.isPending}>{mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Generating...</> : <><Wand2 className="mr-2 h-4 w-4"/>Generate Code</>}</Button></CardFooter>
                </Card>
            )}
        </div>
    );
}
