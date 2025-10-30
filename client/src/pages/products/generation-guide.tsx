
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GenerationGuide() {
   const { projectId } = useParams();
   const [location, setLocation] = useLocation();
   const { toast } = useToast();

   // Access state passed from the redirect
   const { generatedCode, product } = (location.state as any) || {};

   if (!generatedCode || !product) {
      return (
         <div className="max-w-4xl mx-auto p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Nothing to see here!</h2>
            <p className="text-muted-foreground mb-6">
               It looks like you arrived on this page directly. You need to generate a
               product first.
            </p>
            <Button onClick={() => setLocation(`/dashboard/projects/${projectId}`)}>
               <ArrowLeft className="h-4 w-4 mr-2" />
               Back to Project
            </Button>
         </div>
      );
   }

   const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedCode);
      toast({ title: "Copied to clipboard!" });
   };

   const getImplementationGuide = () => {
      return (
         <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-bold">Next.js Pricing Page Guide</h3>
            <ol>
               <li>
                  <strong>Copy the code:</strong> Click the "Copy Code" button above.
               </li>
               <li>
                  <strong>Create the file:</strong> In your Next.js project, create a
                  new file at <code>/components/pricing-page.tsx</code>.
               </li>
               <li>
                  <strong>Paste the code:</strong> Paste the copied code into the new
                  file.
               </li>
               <li>
                  <strong>Create Checkout API:</strong> Create an API route at{" "}
                  <code>/app/api/checkout/route.ts</code> to handle the checkout
                  session creation with Stripe or LemonSqueezy.
               </li>
               <li>
                  <strong>Import and use:</strong> Import and use the{" "}
                  <code>PricingPage</code> component on your desired page (e.g.,{" "}
                  <code>/pricing</code>).
               </li>
            </ol>

            <h3 className="text-xl font-bold mt-6">Node.js Webhook Handler Guide</h3>
            <ol>
               <li>
                  <strong>Copy the code:</strong> Click the "Copy Code" button above.
               </li>
               <li>
                  <strong>Create the file:</strong> In your Node.js (Express) project, create a
                  new file at <code>/webhooks/billing-handler.ts</code>.
               </li>
               <li>
                  <strong>Paste the code:</strong> Paste the copied code into the new
                  file.
               </li>
               <li>
                  <strong>Integrate the router:</strong> In your main server file (e.g.{" "}
                  <code>index.ts</code>), import and use this new router.
               </li>
               <li>
                  <strong>Add Environment Variables:</strong> Ensure you have the necessary environment variables for Stripe/LemonSqueezy secrets.
               </li>
            </ol>
         </div>
      );
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

         <h1 className="text-3xl font-bold mb-2">
            Your code is ready!
         </h1>
         <p className="text-muted-foreground mb-8">
            You've successfully created the product "{product.name}". Follow the steps below to integrate it.
         </p>

         <Card className="mb-8">
            <div className="p-4 border-b flex justify-between items-center">
               <h3 className="font-semibold">Generated Code</h3>
               <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
               </Button>
            </div>

            {/* 🔥 Lightweight code block (no syntax highlighter) */}
            <div className="bg-zinc-900 text-zinc-100 font-mono text-sm overflow-x-auto rounded-b-lg p-4">
               <pre className="whitespace-pre-wrap leading-relaxed">
                  <code>{generatedCode}</code>
               </pre>
            </div>
         </Card>

         <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Implementation Guide</h2>
            {getImplementationGuide()}
         </Card>
      </div>
   );
}
