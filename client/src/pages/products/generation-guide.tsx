import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GenerationGuide() {
  const { projectId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { generatedCode, product } = (history.state as any) || {};

  if (!generatedCode || !product || Object.keys(generatedCode).length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Nothing to see here!</h2>
        <p className="text-muted-foreground mb-6">
          It looks like you arrived here directly. You need to generate a product first.
        </p>
        <Button onClick={() => setLocation(`/dashboard/projects/${projectId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Project
        </Button>
      </div>
    );
  }

  const filePaths = Object.keys(generatedCode);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

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

      <h1 className="text-3xl font-bold mb-2">Your code is ready!</h1>
      <p className="text-muted-foreground mb-8">
        You've successfully created the product "{product.name}". Below are the generated files. Follow the `TODO` comments in each file to integrate them into your project.
      </p>

      <Tabs defaultValue={filePaths[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {filePaths.map((path) => (
            <TabsTrigger key={path} value={path}>{path}</TabsTrigger>
          ))}
        </TabsList>

        {filePaths.map((path) => (
          <TabsContent key={path} value={path}>
            <Card>
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">{path}</h3>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedCode[path])}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>
              <div className="bg-zinc-900 text-zinc-100 font-mono text-sm overflow-x-auto rounded-b-lg p-4">
                <pre className="whitespace-pre-wrap leading-relaxed">
                  <code>{generatedCode[path]}</code>
                </pre>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

       <Card className="p-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">Next Steps</h2>
             <div className="prose prose-invert max-w-none">
                <ol>
                    <li><strong>Review Environment Variables:</strong> Start with the <code>.env.example</code> file. Copy these variables into your own <code>.env.local</code> file and fill them with your actual keys from Stripe and/or Lemon Squeezy.</li>
                    <li><strong>Integrate Subscription Logic:</strong> Open <code>lib/subscription.ts</code>. This file contains helper functions to check a user's subscription status. You MUST edit this file to connect to your real authentication (e.g., NextAuth.js, Clerk) and your database (e.g., Prisma, Drizzle).</li>
                    <li><strong>Implement Checkout Routes:</strong> The files in <code>app/api/.../checkout/</code> create payment links. You will need to call these API routes from your frontend pricing page to initiate a purchase.</li>
                    <li><strong>Deploy Webhook Handlers:</strong> The files in <code>app/api/.../webhook/</code> are critical. Deploy your project and enter the full URL of these routes into your Stripe and/or Lemon Squeezy dashboard. These handlers listen for events (like successful payments) and update your database.</li>
                    <li><strong>Protect Your Content:</strong> Use the <code>hasActiveSubscription()</code> function from <code>lib/subscription.ts</code> in your server components and API routes to protect premium content.</li>
                </ol>
            </div>
        </Card>
    </div>
  );
}