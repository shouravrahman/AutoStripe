import { Link } from "wouter";
import { Zap, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">AutoBill</span>
              </div>
            </Link>
            <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer text-sm text-primary hover:underline">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-12">Last updated: October 26, 2023</p>

            <div className="prose dark:prose-invert max-w-none">
                <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the autobill.app website (the "Service") operated by AutoBill Inc. ("us", "we", or "our").</p>

                <h2>1. Agreement to Terms</h2>
                <p>By using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>

                <h2>2. Accounts</h2>
                <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

                <h2>3. Service and Subscriptions</h2>
                <p>Our Service provides tools to generate code and manage billing integrations. Parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Subscriptions automatically renew unless canceled.</p>

                <h2>4. User Conduct</h2>
                <p>You are responsible for the code you generate and how you use it. You agree not to use the Service for any illegal or unauthorized purpose. You are responsible for safeguarding the API keys you provide to the Service.</p>

                <h2>5. Limitation Of Liability</h2>
                <p>In no event shall AutoBill Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

                <h2>6. Disclaimer</h2>
                <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.</p>

                <h2>7. Governing Law</h2>
                <p>These Terms shall be governed and construed in accordance with the laws of Delaware, United States, without regard to its conflict of law provisions.</p>

                <h2>8. Changes</h2>
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.</p>

                <h2>9. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at <a href="mailto:legal@autobill.app">legal@autobill.app</a>.</p>
            </div>
        </div>
      </main>
    </div>
  );
}
