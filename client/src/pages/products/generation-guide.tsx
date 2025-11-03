import { useLocation, useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy, Check, Zap, LayoutDashboard, Folder, Package, Key, Settings, LogOut, FileCode, Download } from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Folder, label: "Projects", href: "/dashboard/projects" },
    { icon: Package, label: "Products", href: "/dashboard/products" },
    { icon: Key, label: "API Credentials", href: "/dashboard/credentials" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const CodeBlock = ({ code }: { code: any }) => {
    const { toast } = useToast();
    const [hasCopied, setHasCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setHasCopied(true);
        toast({ title: "Code copied to clipboard!" });
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="bg-background rounded-lg border relative">
            <pre className="p-4 text-sm overflow-x-auto"><code className="font-mono">{code}</code></pre>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={copyToClipboard}>
                {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
        </div>
    );
};

export default function GenerationGuidePage() {
    const { projectId } = useParams();
    const { generatedCode, product } = history.state as any || {};

    if (!generatedCode || !product) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <FileCode className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h1 className="text-2xl font-bold">No Code Generated</h1>
                <p className="text-muted-foreground mt-2">Please go back and generate a product first.</p>
                <Button asChild className="mt-6"><Link href={`/dashboard/projects/${projectId || ''}`}><ArrowLeft className="h-4 w-4 mr-2" />Back to Project</Link></Button>
            </div>
        );
    }

    const filePaths = Object.keys(generatedCode);

   const handleDownload = () => {
      if (product?.id && product?.backendStack) {
         window.location.href = `/api/ai/download-code?productId=${product.id}&backendStack=${product.backendStack}`;
      } else {
         toast({ title: "Error", description: "Could not retrieve product ID or backend stack for download.", variant: "destructive" });
      }
   };

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-muted/40">
                <Sidebar>
                    <SidebarContent>
                        <div className="p-4 border-b"><Link href="/"><div className="flex items-center gap-2 cursor-pointer"><Zap className="h-6 w-6 text-primary" /><span className="text-xl font-bold">AutoBill</span></div></Link></div>
                        <div className="p-4">
                            <SidebarGroup><SidebarGroupLabel>Main Menu</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{menuItems.map((item) => (<SidebarMenuItem key={item.href}><SidebarMenuButton asChild><Link href={item.href}><item.icon className="h-5 w-5 mr-2" /><span>{item.label}</span></Link></SidebarMenuButton></SidebarMenuItem>))}</SidebarMenu></SidebarGroupContent></SidebarGroup>
                        </div>
                        <div className="p-4 mt-auto border-t"><Button variant="ghost" className="w-full justify-start"><LogOut className="h-4 w-4 mr-2" />Log out</Button></div>
                    </SidebarContent>
                </Sidebar>
                <div className="flex flex-col flex-1">
                    <header className="flex items-center justify-between p-4 border-b bg-background h-16"><SidebarTrigger /><ThemeToggle /></header>
                    <main className="flex-1 overflow-auto p-4 sm:p-8">
                        <div className="max-w-4xl mx-auto">
                      <div className="mb-8 flex items-center justify-between">
                         <div>
                            <Button variant="ghost" asChild className="mb-4"><Link href={`/dashboard/products/${product.id}`}><ArrowLeft className="h-4 w-4 mr-2" />Back to Product</Link></Button>
                            <h1 className="text-3xl font-extrabold tracking-tight">Implementation Guide</h1>
                            <p className="text-muted-foreground">Code for "{product.name}" has been generated. Follow the steps below.</p>
                         </div>
                         <Button onClick={handleDownload}><Download className="h-4 w-4 mr-2" />Download All (.zip)</Button>
                      </div>

                            <Card className="mb-8">
                                <CardHeader><CardTitle>1. Review Generated Code</CardTitle><CardDescription>The following files have been created. Integrate them into your existing codebase.</CardDescription></CardHeader>
                                <CardContent>
                                    <Tabs defaultValue={filePaths[0]}>
                               <TabsList className="grid w-full grid-cols-3 mb-4">{filePaths.map(p => <TabsTrigger key={p} value={p}>{p.split('/').pop()}</TabsTrigger>)}</TabsList>
                                        {filePaths.map(p => <TabsContent key={p} value={p}><CodeBlock code={generatedCode[p]} /></TabsContent>)}
                                    </Tabs>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>2. Next Steps</CardTitle><CardDescription>Follow these instructions to complete the integration.</CardDescription></CardHeader>
                                <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                                    <ol>
                                        <li><strong>Environment Variables:</strong> Copy the variables from <code>.env.example</code> into your project's <code>.env.local</code> file and replace the placeholder values with your actual API keys.</li>
                                        <li><strong>Subscription Logic:</strong> Open <code>lib/subscription.ts</code> and modify the <code>getUser()</code> and <code>hasActiveSubscription()</code> functions to work with your application's authentication and database.</li>
                                        <li><strong>Checkout UI:</strong> Implement a pricing page or button that calls the API route in <code>app/api/.../checkout/route.ts</code> to redirect users to a payment link.</li>
                                        <li><strong>Webhook Deployment:</strong> Deploy your application and add the full URL of the <code>app/api/.../webhook/route.ts</code> to your Stripe or LemonSqueezy dashboard. This is crucial for receiving payment events.</li>
                                        <li><strong>Protect Content:</strong> Use the <code>hasActiveSubscription()</code> helper to protect premium features and content throughout your application.</li>
                                    </ol>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
