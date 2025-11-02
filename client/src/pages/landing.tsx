import { Link } from "wouter";
import { Code, Webhook, Clock, Shield, Sparkles, ArrowRight, Check, AlertCircle, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

// PayFlow Logo Component - Lightning bolt with flow
const PayFlowLogo = ({ className = "h-6 w-6" }) => (
   <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
         <linearGradient id="payflow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dceafaff" />
            <stop offset="100%" stopColor="#95c0ffff" />
         </linearGradient>
      </defs>
      {/* Lightning bolt with flow lines */}
      <path
         d="M55 10 L35 45 H50 L40 90 L75 40 H60 L55 10 Z"
         fill="url(#payflow-gradient)"
         stroke="#0070F3"
         strokeWidth="2"
      />
      {/* Flow lines */}
      <path
         d="M20 30 Q25 30 30 35"
         stroke="#0070F3"
         strokeWidth="3"
         strokeLinecap="round"
         opacity="0.6"
      />
      <path
         d="M15 50 Q20 50 25 55"
         stroke="#0070F3"
         strokeWidth="3"
         strokeLinecap="round"
         opacity="0.4"
      />
      <path
         d="M70 60 Q75 60 80 65"
         stroke="#0070F3"
         strokeWidth="3"
         strokeLinecap="round"
         opacity="0.6"
      />
      <path
         d="M75 75 Q80 75 85 80"
         stroke="#0070F3"
         strokeWidth="3"
         strokeLinecap="round"
         opacity="0.4"
      />
   </svg>
);

// Alternative minimal logo - Stylized P with arrow
const PayFlowLogoMinimal = ({ className = "h-6 w-6" }) => (
   <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
         <linearGradient id="payflow-simple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0070F3" />
            <stop offset="100%" stopColor="#0050C9" />
         </linearGradient>
      </defs>
      {/* Stylized P with flow arrow */}
      <path
         d="M30 20 L30 80 M30 20 L55 20 Q70 20 70 35 Q70 50 55 50 L30 50"
         stroke="url(#payflow-simple)"
         strokeWidth="8"
         strokeLinecap="round"
         strokeLinejoin="round"
         fill="none"
      />
      <path
         d="M50 50 L80 65 L75 70 M80 65 L75 60"
         stroke="#0070F3"
         strokeWidth="6"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const painPoints = [
   {
      icon: Clock,
      title: "Hours of Setup, Every Time",
      description: "Each new product means reading docs, configuring webhooks, and testing—over and over again."
   },
   {
      icon: Code,
      title: "Complex Documentation",
      description: "Payment platforms have extensive documentation. You just want to get paid and move on."
   },
   {
      icon: AlertCircle,
      title: "Easy to Break",
      description: "One small mistake in configuration and payments stop working. Debugging takes even more time."
   }
];

const agitationPoints = [
   {
      scenario: "Switching payment platforms",
      consequence: "Means rebuilding your entire integration from scratch."
   },
   {
      scenario: "Launching multiple products",
      consequence: "Repeating the same setup process wastes valuable time."
   },
   {
      scenario: "Debugging webhook issues",
      consequence: "Takes you away from what matters: building your product."
   }
];

const features = [
   {
      icon: Webhook,
      title: "Universal Webhook Handler",
      description: "One webhook URL for all platforms. We route, parse, and normalize everything automatically."
   },
   {
      icon: Code,
      title: "Platform-Agnostic API",
      description: "Switch from Stripe to LemonSqueezy without changing a line of code. Test both simultaneously."
   },
   {
      icon: Clock,
      title: "60-Second Setup",
      description: "Paste your API keys, fill one form, done. No more copy-pasting webhook URLs and testing in incognito mode."
   },
   {
      icon: Shield,
      title: "Automatic Verification",
      description: "Signature validation, replay attack prevention, and fraud detection—handled automatically."
   },
   {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "See your MRR, churn, and failed payments across all platforms in one dashboard."
   },
   {
      icon: Sparkles,
      title: "Multi-Platform Support",
      description: "Stripe, LemonSqueezy, Paddle—use them all simultaneously or switch anytime without rebuilding."
   }
];

const steps = [
   {
      title: "Connect Your Accounts",
      description: "Add your Stripe and LemonSqueezy API keys. Takes 30 seconds."
   },
   {
      title: "Configure One Form",
      description: "Tell us about your product once. We handle the rest across all platforms."
   },
   {
      title: "Get Your Webhook",
      description: "One universal webhook URL. Works everywhere. Never touch it again."
   }
];

const stats = [
   { icon: Clock, value: "2,000+", label: "Hours Saved" },
   { icon: Users, value: "500+", label: "Happy Developers" },
   { icon: TrendingUp, value: "99.9%", label: "Uptime" }
];

const pricingPlans = [
   {
      name: "Free",
      price: 0,
      popular: false,
      features: [
         "3 products forever",
         "1 payment platform",
         "Basic webhook handling",
         "Email support",
         "Community access"
      ],
      cta: "Start Free"
   },
   {
      name: "Pro",
      price: 29,
      popular: true,
      features: [
         "Unlimited products",
         "All payment platforms",
         "Advanced analytics",
         "Priority support",
         "Custom webhooks",
         "Multi-platform sync"
      ],
      cta: "Start Free Trial"
   }
];

export default function Landing() {
   return (
      <div className="min-h-screen bg-background relative overflow-hidden">
         {/* Ambient background effects */}
         <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl" />
         </div>

         {/* Header */}
         <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center justify-between h-16">
                  <div className="flex items-center gap-2">
                     <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                        <PayFlowLogo className="h-5 w-5 md:h-6 md:w-6 relative" />
                     </div>
                     <span className="text-lg md:text-xl font-bold">PayFlow</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                     <nav className="hidden md:flex items-center gap-6 mr-4">
                        <a href="#problem" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                           Why PayFlow
                        </a>
                        <a href="#solution" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                           Features
                        </a>
                        <a href="#pricing" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                           Pricing
                        </a>
                     </nav>
                     <ThemeToggle />
                     <Link href="/login">
                        <Button variant="ghost" size="sm" className="hover-elevate active-elevate-2 hidden sm:flex" data-testid="button-login">
                           Log in
                        </Button>
                     </Link>
                     <Link href="/signup">
                        <Button size="sm" className="hover-elevate active-elevate-2 shadow-lg shadow-primary/20" data-testid="button-signup">
                           Start Free
                        </Button>
                     </Link>
                  </div>
               </div>
            </div>
         </header>

         {/* Hero Section */}
         <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
            {/* Animated grid background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                                   linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
                  backgroundSize: '50px 50px',
                  opacity: 0.3,
                  maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, black 40%, transparent 110%)'
               }} />
            </div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
               <div className="inline-flex items-center gap-2 bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 shadow-lg shadow-primary/10 backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="font-semibold">Trusted by developers worldwide</span>
               </div>

               <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 tracking-tight leading-[1.1]">
                  <span className="block mb-2">Automate Payment Setup.</span>
                  <span className="block bg-linear-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                     Reclaim Your Time.
                  </span>
               </h1>

               <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4 font-light">
                  Stop wasting <span className="text-foreground font-semibold">4-6 hours per product</span> on payment gateway integrations. PayFlow automates the tedious setup, so you can focus on building.
               </p>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 mb-8">
                  <Link href="/signup">
                     <Button size="lg" className="w-full sm:w-auto text-base px-8 sm:px-10 h-12 sm:h-14 hover-elevate active-elevate-2 shadow-2xl shadow-primary/30 relative overflow-hidden group" data-testid="button-hero-cta">
                        <span className="absolute inset-0 bg-linear-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center gap-2 font-semibold">
                           Start Free Trial
                           <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                     </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 sm:px-10 h-12 sm:h-14 hover-elevate active-elevate-2 border-2 font-semibold" data-testid="button-view-demo">
                     Watch Demo
                  </Button>
               </div>

               {/* Social proof indicators */}
               <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                     <Check className="h-4 w-4 text-green-500" />
                     <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Check className="h-4 w-4 text-green-500" />
                     <span>3 products free forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Check className="h-4 w-4 text-green-500" />
                     <span>Setup in 60 seconds</span>
                  </div>
               </div>
            </div>

            {/* Enhanced floating elements with gradients */}
            <div className="absolute top-20 left-4 sm:left-10 w-32 h-32 sm:w-40 sm:h-40 bg-linear-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 right-4 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-purple-500/20 to-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-linear-to-br from-blue-500/10 to-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
         </section>

         {/* Problem Section - PAS: Pain */}
         <section id="problem" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />

            <div className="max-w-6xl mx-auto relative z-10">
               <div className="text-center mb-12 sm:mb-16">
                  <div className="inline-flex items-center gap-2 bg-muted border border-border px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
                     <AlertCircle className="h-4 w-4 text-muted-foreground" />
                     <span>The Problem</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight px-4 leading-[1.1]">
                     Payment Setup Takes
                     <br />
                     <span className="relative inline-block mt-2">
                        <span className="bg-linear-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                           Too Much Time
                        </span>
                     </span>
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                     Time you could spend building features your customers actually want.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {painPoints.map((pain, index) => (
                     <Card
                        key={index}
                        className="group p-8 hover-elevate transition-all duration-500 border-2 relative overflow-hidden bg-card backdrop-blur-sm"
                     >
                        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                           <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-muted via-muted/50 to-muted/30 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                              <pain.icon className="h-7 w-7 text-foreground/70" />
                           </div>
                           <h3 className="text-xl font-bold mb-3">{pain.title}</h3>
                           <p className="text-sm text-muted-foreground leading-relaxed">{pain.description}</p>
                        </div>
                     </Card>
                  ))}
               </div>
            </div>
         </section>

         {/* Agitation Section */}
         <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-linear-to-b from-background via-muted/10 to-background" />

            <div className="max-w-4xl mx-auto relative z-10">
               <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1]">
                     Common Challenges
                  </h2>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                     These situations slow down development and delay launches.
                  </p>
               </div>

               <div className="space-y-6 text-left mb-12">
                  {agitationPoints.map((point, index) => (
                     <Card key={index} className="group p-8 border-l-4 border-l-primary hover-elevate transition-all duration-500 relative overflow-hidden bg-card/80 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="flex items-start gap-4 relative z-10">
                           <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                              <span className="text-base font-bold text-primary">{index + 1}</span>
                           </div>
                           <div className="flex-1">
                              <p className="text-base sm:text-lg font-semibold mb-2 text-foreground">{point.scenario}</p>
                              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{point.consequence}</p>
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>

               {/* Subtle CTA */}
               <div className="text-center p-8 rounded-2xl bg-linear-to-br from-muted/30 to-transparent border border-border backdrop-blur-sm">
                  <p className="text-lg font-medium mb-4 text-foreground">
                     There's a better way to handle payments.
                  </p>
                  <Link href="/signup">
                     <Button size="lg" className="hover-elevate active-elevate-2 shadow-lg shadow-primary/20 font-semibold">
                        See How It Works
                        <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                  </Link>
               </div>
            </div>
         </section>

         {/* Solution Section - PAS: Solution */}
         <section id="solution" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-muted/50 via-background to-background" />

            {/* Animated grid overlay */}
            <div className="absolute inset-0" style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
               backgroundSize: '40px 40px',
               maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 0%, transparent 100%)'
            }} />

            <div className="max-w-7xl mx-auto relative z-10">
               <div className="text-center mb-16 sm:mb-24">
                  <div className="inline-block mb-4 sm:mb-6">
                     <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-widest px-4 py-2 rounded-full bg-primary/10 border border-primary/20">The Solution</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 tracking-tight px-4 leading-[1.05]">
                     One Form. Multiple Platforms.
                     <br />
                     <span className="relative inline-block mt-2">
                        <span className="bg-linear-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                           Zero Manual Work.
                        </span>
                        <div className="absolute -inset-2 bg-linear-to-r from-primary/20 via-blue-500/20 to-primary/20 blur-2xl -z-10" />
                     </span>
                  </h2>
                  <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4 font-light">
                     PayFlow transforms <span className="text-foreground font-semibold">hours of tedious configuration</span> into a 60-second automated process.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {features.map((feature, index) => (
                     <Card
                        key={index}
                        className="group p-8 sm:p-10 hover-elevate transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 border-2 relative overflow-hidden bg-card/50 backdrop-blur-sm"
                     >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Shine effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                           <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>

                        <div className="relative z-10">
                           <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-primary/30 via-primary/20 to-primary/10 flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-primary/20">
                              <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                           </div>
                           <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                           <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>

                        {/* Corner accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-primary/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     </Card>
                  ))}
               </div>
            </div>
         </section>

         {/* How It Works */}
         <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background via-muted/20 to-background overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto relative z-10">
               <div className="text-center mb-16 sm:mb-24">
                  <div className="inline-block mb-4 sm:mb-6">
                     <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-widest px-4 py-2 rounded-full bg-primary/10 border border-primary/20">How It Works</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 tracking-tight px-4 leading-[1.05]">
                     From Zero to Live Payments
                     <br />
                     <span className="relative inline-block mt-2">
                        <span className="bg-linear-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                           in Under 60 Seconds
                        </span>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-1 bg-linear-to-r from-transparent via-primary to-transparent" />
                     </span>
                  </h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
                  {steps.map((step, index) => (
                     <div key={index} className="relative group">
                        <div className="flex flex-col items-center text-center">
                           {/* Step number with enhanced styling */}
                           <div className="relative mb-6 sm:mb-8">
                              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full animate-pulse" style={{ animationDuration: '3s', animationDelay: `${index * 0.5}s` }} />
                              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-linear-to-br from-primary via-primary to-blue-600 text-primary-foreground flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-2xl shadow-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                 <span className="relative z-10">{index + 1}</span>
                                 <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/20 to-transparent" />
                              </div>
                           </div>

                           <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors">{step.title}</h3>
                           <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>
                        </div>

                        {/* Connecting line with gradient */}
                        {index < steps.length - 1 && (
                           <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-linear-to-r from-primary/50 via-primary/30 to-transparent">
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                           </div>
                        )}
                     </div>
                  ))}
               </div>

               {/* Call-to-action after steps */}
               <div className="mt-16 text-center">
                  <Link href="/signup">
                     <Button size="lg" className="text-base px-10 h-14 hover-elevate active-elevate-2 shadow-2xl shadow-primary/30 relative overflow-hidden group font-semibold">
                        <span className="absolute inset-0 bg-linear-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center gap-2">
                           Get Started Now
                           <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                     </Button>
                  </Link>
               </div>
            </div>
         </section>

         {/* Social Proof */}
         <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background with gradient mesh */}
            <div className="absolute inset-0 bg-linear-to-b from-background via-primary/5 to-background" />
            <div className="absolute inset-0" style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.1) 1px, transparent 0)`,
               backgroundSize: '48px 48px'
            }} />

            <div className="max-w-6xl mx-auto relative z-10">
               <div className="text-center mb-16 sm:mb-20">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 tracking-tight px-4 leading-[1.05]">
                     Trusted By Developers{" "}
                     <span className="relative inline-block">
                        <span className="bg-linear-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                           Worldwide
                        </span>
                        <div className="absolute -inset-2 bg-linear-to-r from-primary/20 via-blue-500/20 to-primary/20 blur-2xl -z-10" />
                     </span>
                  </h2>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {stats.map((stat, index) => (
                     <Card key={index} className="group p-8 sm:p-10 text-center border-2 hover-elevate transition-all duration-500 relative overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10">
                        {/* Background gradient on hover */}
                        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                           <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-primary/30 via-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-primary/30">
                              <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary group-hover:scale-110 transition-transform" />
                           </div>
                           <div className="text-5xl sm:text-6xl md:text-7xl font-bold bg-linear-to-br from-primary to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                              {stat.value}
                           </div>
                           <p className="text-base sm:text-lg text-muted-foreground font-semibold group-hover:text-foreground transition-colors">{stat.label}</p>
                        </div>

                        {/* Corner decoration */}
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-linear-to-tl from-primary/10 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     </Card>
                  ))}
               </div>

               {/* Testimonial teaser */}
               <div className="mt-16 max-w-3xl mx-auto text-center p-8 rounded-2xl bg-linear-to-br from-muted/50 to-transparent border border-border">
                  <p className="text-lg sm:text-xl italic text-muted-foreground mb-4">
                     "PayFlow saved me hours on my last project. I went from frustrated to shipping in under an hour."
                  </p>
                  <div className="flex items-center justify-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/30 to-primary/10" />
                     <div className="text-left">
                        <p className="font-semibold">Alex Chen</p>
                        <p className="text-sm text-muted-foreground">Indie Developer</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Pricing Section */}
         <section id="pricing" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-muted/50 via-background to-background" />

            {/* Animated background pattern */}
            <div className="absolute inset-0" style={{
               backgroundImage: `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)`,
               backgroundSize: '60px 60px',
               opacity: 0.3,
               maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)'
            }} />

            <div className="max-w-6xl mx-auto relative z-10">
               <div className="text-center mb-16 sm:mb-24">
                  <div className="inline-block mb-4 sm:mb-6">
                     <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-widest px-4 py-2 rounded-full bg-primary/10 border border-primary/20">Pricing</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 tracking-tight px-4 leading-[1.05]">
                     Simple, Transparent Pricing
                     <br />
                     <span className="relative inline-block mt-2">
                        <span className="bg-linear-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                           Start Free Forever
                        </span>
                        <div className="absolute -inset-2 bg-linear-to-r from-primary/20 via-blue-500/20 to-primary/20 blur-2xl -z-10" />
                     </span>
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4 max-w-3xl mx-auto font-light">
                     Stop wasting <span className="text-foreground font-semibold">hours on setup</span>. Start building in minutes.
                  </p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 max-w-5xl mx-auto">
                  {pricingPlans.map((plan, index) => (
                     <Card
                        key={index}
                        className={`relative p-8 sm:p-10 transition-all duration-500 ${plan.popular
                           ? "border-primary border-[3px] shadow-2xl shadow-primary/30 lg:scale-105"
                           : "border-2 hover-elevate hover:shadow-xl"
                           }`}
                     >
                        {plan.popular && (
                           <>
                              {/* Gradient background */}
                              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-transparent rounded-lg" />

                              {/* Animated border glow */}
                              <div className="absolute inset-0 rounded-lg">
                                 <div className="absolute inset-0 rounded-lg bg-linear-to-r from-primary via-blue-500 to-primary opacity-20 blur-xl animate-pulse" />
                              </div>

                              {/* Popular badge */}
                              <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-20">
                                 <div className="bg-linear-to-r from-primary to-blue-600 text-primary-foreground text-xs sm:text-sm font-bold px-6 sm:px-8 py-2 sm:py-2.5 rounded-full shadow-lg shadow-primary/40 flex items-center gap-2">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Most Popular
                                 </div>
                              </div>
                           </>
                        )}

                        <div className="relative z-10">
                           <div className="flex items-baseline justify-between mb-8">
                              <h3 className="text-2xl sm:text-3xl font-bold">{plan.name}</h3>
                           </div>

                           <div className="mb-8 sm:mb-10">
                              <div className="flex items-baseline gap-1">
                                 <span className="text-5xl sm:text-6xl font-bold">${plan.price}</span>
                                 <span className="text-muted-foreground text-lg sm:text-xl">/month</span>
                              </div>
                              {plan.popular && (
                                 <p className="text-sm text-muted-foreground mt-2">
                                    Billed annually, or $49/month
                                 </p>
                              )}
                           </div>

                           <ul className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                              {plan.features.map((feature, i) => (
                                 <li key={i} className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                       <Check className="h-3 w-3 text-primary" />
                                    </div>
                                    <span className="text-sm sm:text-base leading-relaxed">{feature}</span>
                                 </li>
                              ))}
                           </ul>

                           <Link href="/signup">
                              <Button
                                 className={`w-full h-12 sm:h-14 hover-elevate active-elevate-2 text-base sm:text-lg font-semibold relative overflow-hidden group ${plan.popular ? "shadow-xl shadow-primary/30" : ""
                                    }`}
                                 variant={plan.popular ? "default" : "outline"}
                                 data-testid={`button-pricing-${plan.name.toLowerCase()}`}
                              >
                                 {plan.popular && (
                                    <span className="absolute inset-0 bg-linear-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                 )}
                                 <span className="relative flex items-center justify-center gap-2">
                                    {plan.cta}
                                    {plan.popular && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                                 </span>
                              </Button>
                           </Link>

                           {plan.popular && (
                              <p className="text-center text-xs text-muted-foreground mt-4">
                                 ⚡ Start free trial • Cancel anytime
                              </p>
                           )}
                        </div>

                        {/* Decorative corner */}
                        {plan.popular && (
                           <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-primary/20 to-transparent rounded-tr-lg rounded-bl-3xl" />
                        )}
                     </Card>
                  ))}
               </div>

               {/* Money-back guarantee */}
               <div className="mt-16 text-center">
                  <div className="inline-flex items-center gap-3 bg-muted/50 border border-border px-6 py-4 rounded-full backdrop-blur-sm">
                     <Shield className="h-5 w-5 text-primary" />
                     <span className="text-sm font-medium">30-day money-back guarantee • No questions asked</span>
                  </div>
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
               <Card className="relative overflow-hidden border-[3px] border-primary/30 p-10 sm:p-16 md:p-20 text-center bg-linear-to-br from-card via-card to-card/50 backdrop-blur-sm">
                  {/* Animated background gradients */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-blue-500/10 to-primary/15" />
                  <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-linear-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0" style={{
                     backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.1) 1px, transparent 0)`,
                     backgroundSize: '32px 32px',
                     opacity: 0.5
                  }} />

                  <div className="relative z-10">
                     <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 px-4 leading-[1.1]">
                        Ready to Automate
                        <br />
                        <span className="relative inline-block mt-2">
                           <span className="bg-linear-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                              Your Payment Setup?
                           </span>
                           <div className="absolute -inset-2 bg-linear-to-r from-primary/20 via-blue-500/20 to-primary/20 blur-2xl -z-10 animate-pulse" />
                        </span>
                     </h2>

                     <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto px-4 font-light">
                        Join developers who've reclaimed their time. Start building instead of configuring.
                     </p>

                     {/* Dual CTA buttons */}
                     <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <Link href="/signup">
                           <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-10 sm:px-12 h-14 sm:h-16 hover-elevate active-elevate-2 shadow-2xl shadow-primary/40 relative overflow-hidden group font-bold">
                              <span className="absolute inset-0 bg-linear-to-r from-primary to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <span className="relative flex items-center gap-2">
                                 Start Your Free Trial
                                 <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              </span>
                           </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-10 sm:px-12 h-14 sm:h-16 hover-elevate active-elevate-2 border-2 font-semibold backdrop-blur-sm">
                           View Live Demo
                        </Button>
                     </div>

                     {/* Trust indicators */}
                     <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-green-500" />
                           <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-green-500" />
                           <span>3 products free forever</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Check className="h-4 w-4 text-green-500" />
                           <span>Cancel anytime</span>
                        </div>
                     </div>
                  </div>
               </Card>
            </div>
         </section>

         {/* Footer */}
         <footer className="relative border-t py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
            <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
                  <div>
                     <h4 className="font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">Product</h4>
                     <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                        <li><a href="#problem" className="hover:text-foreground transition-colors">Why PayFlow</a></li>
                        <li><a href="#solution" className="hover:text-foreground transition-colors">Features</a></li>
                        <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">Company</h4>
                     <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                        <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                        <li><a href="mailto:hello@payflow.dev" className="hover:text-foreground transition-colors">Contact</a></li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">Legal</h4>
                     <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                        <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">Resources</h4>
                     <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                        <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                        <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                     </ul>
                  </div>
               </div>

               <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                     <PayFlowLogoMinimal className="h-5 w-5" />
                     <span className="text-sm text-muted-foreground">© 2025 PayFlow. All rights reserved.</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                     <a href="https://twitter.com/payflow" className="hover:text-foreground transition-colors">Twitter</a>
                     <a href="https://github.com/payflow" className="hover:text-foreground transition-colors">GitHub</a>
                  </div>
               </div>
            </div>
         </footer>
      </div>
   );
}
