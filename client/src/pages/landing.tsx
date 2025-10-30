import { Link } from "wouter";
import { Code, Webhook, Clock, Shield, Sparkles, ArrowRight, Check, AlertCircle, TrendingUp, Users, DollarSign, FileText, Cpu, BarChart3 } from "lucide-react";
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
      title: "4-6 Hours Per Product",
      description: "Reading docs, copying webhooks, testing payments—it's the same tedious process every single time."
   },
   {
      icon: Code,
      title: "Documentation Hell",
      description: "Stripe has 47 pages on webhooks alone. LemonSqueezy isn't much better. You're a builder, not a payment gateway expert."
   },
   {
      icon: AlertCircle,
      title: "Brittle Configurations",
      description: "One typo in a webhook URL, one missed environment variable, and your entire payment flow breaks."
   }
];

const agitationPoints = [
   {
      scenario: "You spend 3 hours setting up Stripe subscriptions",
      consequence: "Then realize LemonSqueezy handles EU VAT better. Now you need to rebuild everything from scratch."
   },
   {
      scenario: "Your competitor launches in 2 days",
      consequence: "You're still debugging webhook signature validation at 2 AM instead of talking to customers."
   },
   {
      scenario: "You have 5 products to launch this quarter",
      consequence: "That's 20-30 hours just on payment setup. At $100/hour, you're burning $2,000-$3,000 in opportunity cost."
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
   { icon: Users, value: "500+", label: "Developers Saved" },
   { icon: Clock, value: "2,000+", label: "Hours Reclaimed" },
   { icon: DollarSign, value: "$200K+", label: "Opportunity Cost Saved" }
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
            <div className="max-w-5xl mx-auto text-center relative z-10">
               <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8 shadow-lg shadow-primary/10">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  Stop Wasting Hours on Payment Setup
               </div>

               <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 tracking-tight leading-tight">
                  <span className="block mb-2">Payment Setup Takes</span>
                  <span className="block bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                     Hours to Configure.
                  </span>
                  <span className="block mt-2">We Do It in 60 Seconds.</span>
               </h1>

               <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
                  Every hour you spend wrestling with Stripe and LemonSqueezy docs is an hour stolen from building your product. Let PayFlow handle the busywork.
               </p>

               <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
                  <Link href="/signup">
                     <Button size="lg" className="w-full sm:w-auto text-base px-6 sm:px-8 hover-elevate active-elevate-2 shadow-xl shadow-primary/20" data-testid="button-hero-cta">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-6 sm:px-8 hover-elevate active-elevate-2" data-testid="button-view-demo">
                     Watch Demo
                  </Button>
               </div>
               <p className="text-sm text-muted-foreground mt-4 sm:mt-6">
                  No credit card required • 3 products free forever
               </p>
            </div>

            {/* Floating elements */}
            <div className="absolute top-40 left-4 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl blur-2xl animate-pulse" />
            <div className="absolute bottom-40 right-4 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-3xl blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
         </section>

         {/* Problem Section - PAS: Pain */}
         <section id="problem" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-6xl mx-auto">
               <div className="text-center mb-12 sm:mb-16">
                  <div className="inline-flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
                     <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                     The Hidden Cost of Manual Payment Setup
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight px-4">
                     You're Losing <span className="text-destructive">$1,000s</span> in Opportunity Cost
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                     Every minute spent on payment infrastructure is a minute not spent on your product, marketing, or customers.
                  </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {painPoints.map((pain, index) => (
                     <Card
                        key={index}
                        className="p-6 sm:p-8 hover-elevate transition-all duration-300 border-2"
                     >
                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                           <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                              <pain.icon className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
                           </div>
                           <div>
                              <h3 className="text-lg sm:text-xl font-bold mb-2">{pain.title}</h3>
                              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{pain.description}</p>
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>
            </div>
         </section>

         {/* Agitation Section */}
         <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 tracking-tight px-4">
                  Sound Familiar?
               </h2>
               <div className="space-y-4 sm:space-y-6 text-left">
                  {agitationPoints.map((point, index) => (
                     <Card key={index} className="p-6 sm:p-8 border-l-4 border-l-primary">
                        <div className="flex items-start gap-3 sm:gap-4">
                           <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                              <span className="text-sm sm:text-base font-bold text-primary">{index + 1}</span>
                           </div>
                           <div className="flex-1">
                              <p className="text-base sm:text-lg md:text-xl font-semibold mb-2">{point.scenario}</p>
                              <p className="text-sm sm:text-base text-muted-foreground">{point.consequence}</p>
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>
            </div>
         </section>

         {/* Solution Section - PAS: Solution */}
         <section id="solution" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/20 to-transparent" />

            <div className="max-w-7xl mx-auto relative z-10">
               <div className="text-center mb-12 sm:mb-20">
                  <div className="inline-block mb-3 sm:mb-4">
                     <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">The Solution</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight px-4">
                     One Form. Multiple Platforms.
                     <br />
                     <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Zero Manual Work.
                     </span>
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                     PayFlow transforms hours of tedious configuration into a 60-second automated process.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {features.map((feature, index) => (
                     <Card
                        key={index}
                        className="group p-6 sm:p-8 hover-elevate transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border-2 relative overflow-hidden"
                     >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                           <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                              <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                           </div>
                           <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                           <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                     </Card>
                  ))}
               </div>
            </div>
         </section>

         {/* How It Works */}
         <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
            <div className="max-w-6xl mx-auto">
               <div className="text-center mb-12 sm:mb-20">
                  <div className="inline-block mb-3 sm:mb-4">
                     <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">How It Works</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight px-4">
                     From Zero to Live Payments
                     <br />
                     <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        in Under 60 Seconds
                     </span>
                  </h2>
                  {/* <h2 className="text-4xl font-bold">
  From Zero to Live Payments
  <br />
  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
    in Under 60 Seconds
  </span>
</h2> */}

               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                  {steps.map((step, index) => (
                     <div key={index} className="relative">
                        <div className="flex flex-col items-center text-center">
                           <div className="relative mb-4 sm:mb-6">
                              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-xl shadow-primary/30">
                                 {index + 1}
                              </div>
                           </div>
                           <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{step.title}</h3>
                           <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>
                        {index < steps.length - 1 && (
                           <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-1 bg-gradient-to-r from-primary/50 to-transparent" />
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Social Proof */}
         <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
               <div className="text-center mb-12 sm:mb-16">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight px-4">
                     Join <span className="text-primary">500+</span> Developers
                     <br />
                     Who've Reclaimed Their Time
                  </h2>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {stats.map((stat, index) => (
                     <Card key={index} className="p-6 sm:p-8 text-center border-2 hover-elevate transition-all">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                           <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        </div>
                        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium">{stat.label}</p>
                     </Card>
                  ))}
               </div>
            </div>
         </section>

         {/* Pricing Section */}
         <section id="pricing" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/20 to-transparent" />

            <div className="max-w-6xl mx-auto relative z-10">
               <div className="text-center mb-12 sm:mb-20">
                  <div className="inline-block mb-3 sm:mb-4">
                     <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">Pricing</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight px-4">
                     Pay Once. Save Hundreds
                     <br />
                     <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        of Hours Forever
                     </span>
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
                     The average developer spends 4-6 hours per product on payment setup. At $100/hour, that's $400-$600 wasted per product.
                  </p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                  {pricingPlans.map((plan, index) => (
                     <Card
                        key={index}
                        className={`relative p-6 sm:p-8 transition-all duration-300 ${plan.popular
                           ? "border-primary border-2 shadow-2xl shadow-primary/20 lg:-translate-y-4"
                           : "border-2 hover-elevate hover:shadow-xl"
                           }`}
                     >
                        {plan.popular && (
                           <>
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-lg" />
                              <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                                 <div className="bg-primary text-primary-foreground text-xs sm:text-sm font-bold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-lg shadow-primary/30">
                                    Most Popular
                                 </div>
                              </div>
                           </>
                        )}

                        <div className="relative z-10">
                           <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{plan.name}</h3>
                           <div className="mb-6 sm:mb-8">
                              <span className="text-4xl sm:text-5xl font-bold">${plan.price}</span>
                              <span className="text-muted-foreground text-base sm:text-lg">/month</span>
                           </div>

                           <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                              {plan.features.map((feature, i) => (
                                 <li key={i} className="flex items-start gap-2 sm:gap-3">
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                       <Check className="h-3 w-3 text-primary" />
                                    </div>
                                    <span className="text-xs sm:text-sm leading-relaxed">{feature}</span>
                                 </li>
                              ))}
                           </ul>

                           <Link href="/signup">
                              <Button
                                 className={`w-full h-11 sm:h-12 hover-elevate active-elevate-2 text-sm sm:text-base ${plan.popular ? "shadow-lg shadow-primary/20" : ""
                                    }`}
                                 variant={plan.popular ? "default" : "outline"}
                                 data-testid={`button-pricing-${plan.name.toLowerCase()}`}
                              >
                                 {plan.cta}
                                 {plan.popular && <ArrowRight className="ml-2 h-4 w-4" />}
                              </Button>
                           </Link>
                        </div>
                     </Card>
                  ))}
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
               <Card className="relative overflow-hidden border-2 p-8 sm:p-12 md:p-16 text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                  <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary/10 rounded-full blur-3xl" />

                  <div className="relative z-10">
                     <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-4">
                        Stop Burning Hours on
                        <br />
                        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                           Payment Configuration
                        </span>
                     </h2>
                     <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                        Your competitors are shipping faster. Your time is worth more than copy-pasting webhook URLs.
                     </p>
                     <Link href="/signup">
                        <Button size="lg" className="text-sm sm:text-base px-6 sm:px-8 h-11 sm:h-12 hover-elevate active-elevate-2 shadow-xl shadow-primary/25">
                           Start Your Free Trial
                           <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                     </Link>
                     <p className="text-xs sm:text-sm text-muted-foreground mt-4">
                        No credit card required • 3 products free forever • Cancel anytime
                     </p>
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
