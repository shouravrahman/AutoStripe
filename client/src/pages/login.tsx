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

export default function Login() {
  const [, setLocation] = useLocation();
   const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

   const loginMutation = useMutation({
      mutationFn: (loginData: typeof formData) =>
         apiRequest<any>("POST", "/api/auth/login", loginData),
      onSuccess: async () => {
         toast({
            title: "Welcome back!",
            description: "Redirecting...",
         });
         // Fetch user stats to determine if onboarding is needed
         try {
            const stats = await apiRequest<any>("GET", "/api/stats");
            if (stats.totalProjects === 0) {
               setTimeout(() => setLocation("/onboarding"), 1000);
            } else {
               setTimeout(() => setLocation("/dashboard"), 1000);
            }
         } catch (error) {
            console.error("Failed to fetch user stats after login:", error);
            setTimeout(() => setLocation("/dashboard"), 1000); // Fallback to dashboard
         }
      },
      onError: (error: any) => {
         toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
         });
      },
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      loginMutation.mutate(formData);
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
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground">
            Log in to continue automating
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password">
                  <span className="text-xs text-primary hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </Link>
              </div>
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
            </div>

            <Button
              type="submit"
              className="w-full hover-elevate active-elevate-2"
                    disabled={loginMutation.isPending}
              data-testid="button-submit"
            >
                    {loginMutation.isPending ? "Logging in..." : "Log in"}
                 </Button>

                 <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                 </div>

                 <Button variant="outline" className="w-full hover-elevate active-elevate-2" asChild>
                    <a href="/api/auth/github"><Github className="mr-2 h-4 w-4" /> GitHub</a>
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup">
                <span className="text-primary hover:underline cursor-pointer">
                  Sign up
                </span>
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
