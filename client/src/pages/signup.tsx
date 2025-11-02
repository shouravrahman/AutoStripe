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

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const signupMutation = useMutation({
    mutationFn: (signupData: typeof formData) => apiRequest("POST", "/api/auth/signup", signupData),
    onSuccess: () => {
      toast({ title: "Account Created!", description: "Welcome to AutoBill. Let's get you set up." });
      setLocation("/onboarding");
    },
    onError: (error: any) => {
      toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };

  return (
    <AuthLayout title="Create Your Account" description="Start automating your billing in seconds.">
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
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Ada Lovelace" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <Button type="submit" className="w-full" disabled={signupMutation.isPending}>{signupMutation.isPending ? "Creating account..." : "Continue with Email"}</Button>
            </form>
            <p className="px-8 text-center text-sm text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="/legal/terms" className="underline hover:text-primary">Terms of Service</Link> and{" "}
                <Link href="/legal/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
            </p>
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">Log in</Link>
            </p>
        </div>
    </AuthLayout>
  );
}
