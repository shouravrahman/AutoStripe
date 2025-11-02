import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Github } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";

export default function Signup() {
  const [, setLocation] = useLocation();
   const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

   const signupMutation = useMutation({
      mutationFn: (signupData: typeof formData) =>
         apiRequest<any>("POST", "/api/auth/signup", signupData),
      onSuccess: () => {
         toast({
            title: "Account created!",
            description: "Welcome to StripeSyncer. Redirecting to dashboard...",
         });
         setTimeout(() => setLocation("/dashboard"), 1000);
      },
      onError: (error: any) => {
         toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
         });
      },
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      signupMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-2 mb-4 cursor-pointer">
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">StripeSyncer</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground">
            Start automating your payment setup today
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-name"
                className="hover-elevate"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-email"
                className="hover-elevate"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                data-testid="input-password"
                className="hover-elevate"
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <Button
              type="submit"
              className="w-full hover-elevate active-elevate-2"
                    disabled={signupMutation.isPending}
              data-testid="button-submit"
            >
                    {signupMutation.isPending ? "Creating account..." : "Create account"}
                 </Button>

                 <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                 </div>

                 <Button variant="outline" className="w-full hover-elevate active-elevate-2" asChild>
                    <a href="/api/auth/github"><Github className="mr-2 h-4 w-4" /> GitHub</a>
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-primary hover:underline cursor-pointer">
                  Log in
                </span>
              </Link>
            </p>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          By signing up, you agree to our{" "}
          <Link href="/terms">
            <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
          </Link>{" "}
          and{" "}
          <Link href="/privacy">
            <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
