import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Zap, ArrowRight, Check, Menu, Link2, Scan, Settings, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/apiRequest";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const features = [
  "Scrape Pricing Pages: Instantly extract pricing tiers and details from any URL.",
  "AI-Powered Suggestions: Get optimized pricing strategies and feature bundling ideas.",
  "Auto-Configure Payment Providers: Automatically create products and plans in Stripe & Lemon Squeezy.",
  "Generate Production-Ready Code: Get boilerplate for webhooks, paywall middleware, and UI components.",
  "Secure Credential Management: Integrate seamlessly with Doppler for secure API key handling.",
  "Time-Saving Automation: Eliminate repetitive setup, freeing you to build your core product."
];

const pricingPlans = [
  {
    name: "Hobby",
    price: "$0",
    description: "For personal projects & experiments",
    features: [
      "1 Project",
      "2 Products",
      "1 Platform Integration",
      "Community Support"
    ],
    cta: "Start for Free"
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professionals and small teams",
    features: [
      "Unlimited Projects",
      "Unlimited Products",
      "All Platform Integrations",
      "Priority Support",
      "AI-Powered Suggestions"
    ],
    cta: "Get Started"
  }
];

function ScraperHero() {
    const { toast } = useToast();
    const [, setLocation] = useLocation();
    const [url, setUrl] = useState("");

    const scrapeMutation = useMutation<any, Error, { url: string; isPublic: boolean; }>({
       mutationFn: (vars) => apiRequest("POST", "/api/scrape/extract", vars),
       onSuccess: (data) => {
           toast({ title: "Scraping successful!", description: "Review your extracted data." });
           setLocation("/dashboard/onboard/dry-run", { state: { scrapedData: data.scrapedData, apiCallPreviews: data.apiCallPreviews } });
       },
       onError: (error) => {
           toast({ title: "Scraping failed", description: error.message, variant: "destructive" });
       }
   });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) {
            toast({ title: "URL cannot be empty", variant: "destructive" });
            return;
        }
        toast({ title: "Scraping website...", description: "This may take a moment." });
        scrapeMutation.mutate({ url, isPublic: true });
    };

    return (
       <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 max-w-2xl mx-auto">
          <div className="relative w-full sm:flex-1 group">
             <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
             <Input
                    type="url"
                    placeholder="https://your-saas.com/pricing"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                className="h-14 pl-12 pr-4 text-base w-full border-border/60 bg-background/50 backdrop-blur-sm focus-visible:border-primary/50 focus-visible:ring-primary/20 transition-all shadow-sm hover:border-border"
                    disabled={scrapeMutation.isPending}
                />
            </div>
          <Button
             onClick={handleSubmit}
             size="lg"
             className="text-base h-14 px-10 w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all"
             disabled={scrapeMutation.isPending}
          >
             {scrapeMutation.isPending ? "Analyzing..." : "Start for Free"}
                {!scrapeMutation.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
       </div>
    );
}

export default function Landing() {
  return (
     <div className="min-h-screen bg-background text-foreground overflow-hidden">
        {/* Ambient Background Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
           <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

      {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
            <Link href="/">
                    <div className="flex items-center gap-2.5 cursor-pointer group">
                       <div className="relative">
                          <Zap className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                          <div className="absolute inset-0 blur-lg bg-primary/30 -z-10" />
                       </div>
                       <span className="text-xl font-bold tracking-tight">AutoBill</span>
              </div>
            </Link>
                 <nav className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
                       Features
                       <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </a>
                    <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
                       How it Works
                       <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </a>
                    <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
                       Pricing
                       <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </a>
            </nav>
                 <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login">
                       <Button variant="ghost" className="hidden sm:inline-flex hover:bg-accent/50">Log in</Button>
              </Link>
              <Link href="/signup">
                       <Button className="shadow-md shadow-primary/20">Sign Up</Button>
              </Link>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
        <main className="pt-20">
           <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center pt-24 pb-32 px-4 sm:px-6 lg:px-8 relative"
        >
              <div className="max-w-5xl mx-auto">
                 <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary mb-8 backdrop-blur-sm"
                 >
                    <Zap className="h-3.5 w-3.5" />
                    Superhuman billing automation
                 </motion.div>

                 <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8">
                    <span className="block">
                       Autopilot for SaaS
                    </span>
                    <span className="block text-primary">
                       Billing Setup
                    </span>
            </h1>

                 <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Automate Stripe & Lemon Squeezy configuration, generate production-ready code,
                    and launch your SaaS faster than ever. Built for developers who ship.
            </p>

            <ScraperHero />

                 <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-sm text-muted-foreground"
                 >
                    No credit card required · Setup in minutes · Export ready-to-deploy code
                 </motion.p>
          </div>
        </motion.section>

        {/* Features Section */}
           <section id="features" className="py-32 bg-linear-b from-muted/20 via-muted/10 to-transparent relative">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" style={{
                 backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
                 backgroundSize: '32px 32px'
              }} />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                 <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.6 }}
                    >
                       <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                          Everything you need.
                          <br />
                          <span className="text-muted-foreground">Nothing you don't.</span>
                       </h2>
                       <p className="text-lg text-muted-foreground leading-relaxed">
                          From intelligent code generation to secure credential management,
                          AutoBill handles the complexity so you can focus on building.
                       </p>
                    </motion.div>
            </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => {
                       const [title, description] = feature.split(': ');
                       return (
                          <motion.div
                             key={i}
                             initial={{ opacity: 0, y: 30 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             viewport={{ once: true, margin: "-100px" }}
                             transition={{ duration: 0.5, delay: i * 0.08 }}
                             className="group relative"
                          >
                             <div className="absolute inset-0 bg-linear-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                             <div className="relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all hover:shadow-lg hover:shadow-primary/5">
                                <div className="flex items-start gap-4">
                                   <div className="shrink-0 h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                      <Check className="h-5 w-5" />
                                   </div>
                                   <div className="flex-1 min-w-0">
                                      <h3 className="text-lg font-semibold mb-2">{title}</h3>
                                      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                       );
                    })}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
           <section id="how-it-works" className="py-32 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-24"
                 >
                    <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                       Three steps to production
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                       Your billing infrastructure, fully automated and ready to deploy in minutes, not days.
                    </p>
                 </motion.div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {[
                       { icon: Scan, title: "Scrape Your Site", description: "Paste your pricing page URL. Our intelligent engine extracts every plan, price point, and feature with surgical precision." },
                       { icon: Settings, title: "Review & Configure", description: "Validate extracted data, receive AI-driven pricing optimization suggestions, and seamlessly configure your payment providers." },
                       { icon: Download, title: "Download & Deploy", description: "Export production-ready code for webhooks, paywalls, and UI components. One click from development to deployment." }
                    ].map((step, idx) => (
                       <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.6, delay: idx * 0.15 }}
                          className="relative group"
                       >
                          <div className="text-center">
                             <div className="relative inline-flex items-center justify-center h-24 w-24 mb-8">
                                <div className="absolute inset-0 rounded-2xl bg-linear-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-500" />
                                <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all" />
                                <step.icon className="h-12 w-12 text-primary relative z-10 group-hover:scale-110 transition-transform" />
                             </div>

                             <div className="inline-flex items-center gap-3 mb-4">
                                <span className="text-sm font-bold text-primary/60">STEP {idx + 1}</span>
                             </div>

                             <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                             <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>

                          {idx < 2 && (
                             <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-linear-r from-border to-transparent" />
                          )}
                       </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Pricing Section */}
           <section id="pricing" className="py-32 bg-linear-b from-transparent via-muted/10 to-transparent relative">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" style={{
                 backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
                 backgroundSize: '32px 32px'
              }} />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                 >
                    <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                       Simple, transparent pricing
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                       Start building for free. Scale with confidence as you grow.
                    </p>
                 </motion.div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {pricingPlans.map((plan, idx) => (
                       <motion.div
                          key={plan.name}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                          className={`relative group ${plan.name === 'Pro' ? 'md:scale-105' : ''}`}
                       >
                          {plan.name === 'Pro' && (
                             <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                <span className="inline-flex px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg">
                                   Most Popular
                                </span>
                             </div>
                          )}

                          <div className={`relative h-full rounded-2xl border ${plan.name === 'Pro' ? 'border-primary/50 bg-card shadow-2xl shadow-primary/10' : 'border-border/50 bg-card/50 backdrop-blur-sm'} p-10 flex flex-col transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5`}>
                             <div className="absolute inset-0 bg-linear-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                             <div className="relative">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-muted-foreground mb-8">{plan.description}</p>

                                <div className="mb-8">
                                   <div className="flex items-baseline gap-2">
                                      <span className="text-6xl font-extrabold tracking-tight">{plan.price}</span>
                                      {plan.price !== '$0' && <span className="text-lg text-muted-foreground">/month</span>}
                                   </div>
                                </div>

                                <ul className="space-y-4 mb-10">
                                   {plan.features.map((feature, i) => (
                                      <li key={i} className="flex items-start gap-3">
                                         <div className="shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                            <Check className="h-3.5 w-3.5 text-primary" />
                                         </div>
                                         <span className="text-sm leading-relaxed">{feature}</span>
                                      </li>
                                   ))}
                                </ul>

                                <Button
                                   className={`w-full text-base h-14 shadow-lg transition-all ${plan.name === 'Pro'
                                      ? 'shadow-primary/20 hover:shadow-xl hover:shadow-primary/30'
                                      : 'bg-secondary hover:bg-secondary/80 shadow-none text-secondary-foreground'
                                      }`}
                                >
                                   {plan.cta}
                                   <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                             </div>
                          </div>
                       </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
           <section className="py-32 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-br from-primary/10 via-transparent to-transparent" />

              <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative"
              >
                 <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                    Ready to ship faster?
                 </h2>
                 <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                    Join developers who've automated their billing infrastructure.
                    Create your account and start building in minutes.
                 </p>
                 <Link href="/signup">
                    <Button size="lg" className="text-base h-14 px-10 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                       Sign up for free
                       <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                 </Link>
                 <p className="mt-6 text-sm text-muted-foreground">
                    Start building today. No credit card required.
                 </p>
              </motion.div>
        </section>
      </main>

      {/* Footer */}
        <footer className="border-t border-border/40 bg-muted/20 backdrop-blur-sm">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="flex items-center gap-2.5">
                <Zap className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg">AutoBill</span>
            </div>
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} AutoBill. All rights reserved.</p>
                 <div className="flex gap-8">
                <Link href="/legal/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                <Link href="/legal/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                <Link href="/legal/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
