import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Github, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";

const AuthLayout = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-sm p-4">
            <div className="text-center mb-8">
                <Link href="/">
                    <div className="inline-flex items-center gap-2 mb-4 cursor-pointer">
                        <Zap className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold">AutoBill</span>
                    </div>
                </Link>
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground">{description}</p>
            </div>
            {children}
        </div>
    </div>
);

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const loginMutation = useMutation({
    mutationFn: (loginData: typeof formData) => apiRequest("POST", "/api/auth/login", loginData),
    onSuccess: async () => {
      toast({ title: "Welcome back!", description: "Redirecting to your dashboard..." });
      const stats = await apiRequest("GET", "/api/stats");
      setLocation(stats.totalProjects === 0 ? "/onboarding" : "/dashboard");
    },
    onError: (error: any) => {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <AuthLayout title="Welcome Back" description="Log in to continue to your dashboard.">
        <div className="space-y-4">
            <Button variant="outline" className="w-full" asChild>
                <a href="/api/auth/github"><Github className="mr-2 h-4 w-4" /> Continue with GitHub</a>
            </Button>
            <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">OR</span></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>{loginMutation.isPending ? "Logging in..." : "Continue with Email"}</Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
            </p>
        </div>
    </AuthLayout>
  );
}
