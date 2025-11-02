import { Link } from "wouter";
import { Zap, ArrowRight, Check, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

const features = [
  "Automated Code Generation",
  "Support for Stripe and LemonSqueezy",
  "Ready-to-use Components",
  "Seamless Integration",
  "Secure Credential Management",
  "AI-Powered Suggestions"
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

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">AutoBill</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </nav>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24">
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-center pt-16 pb-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Automate Your Billing Logic Instantly
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              AutoBill generates the code for your pricing pages, webhooks, and API integrations, so you can focus on building your product.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg h-12 px-8">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Everything you need to ship faster</h2>
                <p className="mt-4 text-lg text-muted-foreground">From code generation to secure credential management, we've got you covered.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start space-x-4"
                >
                    <div className="flex-shrink-0 h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5" />
                    </div>
                    <p className="text-lg font-medium">{feature}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Simple, transparent pricing</h2>
                <p className="mt-4 text-lg text-muted-foreground">Start for free, and scale as you grow.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.map((plan) => (
                <div key={plan.name} className={`border rounded-xl p-8 flex flex-col ${plan.name === 'Pro' ? 'border-primary' : ''}`}>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground mt-2 flex-grow">{plan.description}</p>
                  <div className="mt-6">
                    <span className="text-5xl font-extrabold">{plan.price}</span>
                    {plan.price !== '$0' && <span className="text-muted-foreground">/month</span>}
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button className={`w-full text-lg h-12 ${plan.name === 'Pro' ? '' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>{plan.cta}</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-muted/40">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Ready to get started?</h2>
            <p className="mt-4 text-lg text-muted-foreground">Create an account and start automating your billing workflow today.</p>
            <div className="mt-8">
                <Link href="/signup">
                    <Button size="lg" className="text-lg h-12 px-8">Sign up for free</Button>
                </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                <span className="font-bold">AutoBill</span>
            </div>
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} AutoBill. All rights reserved.</p>
            <div className="flex gap-4">
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
