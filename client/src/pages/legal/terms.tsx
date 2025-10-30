import { Link } from "wouter";
import { Zap } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">AutoBill</span>
              </div>
            </Link>
            <Link href="/">
              <span className="text-sm text-primary hover:underline cursor-pointer">
                Back to Home
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: January 15, 2025
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg">
            Welcome to AutoBill. By using our service, you agree to these terms. Please read them carefully.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using AutoBill ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily use AutoBill for personal or commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose without a paid subscription</li>
            <li>Attempt to decompile or reverse engineer any software contained on AutoBill's platform</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. API Keys and Security</h2>
          <p>
            You are responsible for maintaining the confidentiality of your API keys and account credentials. AutoBill encrypts and securely stores your API keys, but we are not liable for any unauthorized access to your third-party accounts (Stripe, LemonSqueezy) if your credentials are compromised.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>You grant AutoBill permission to use your API keys solely to create and manage products on your behalf</li>
            <li>AutoBill will never access or process actual payment transactions on your accounts</li>
            <li>You can revoke access by deleting your stored credentials at any time</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Subscription and Payments</h2>
          <p>
            Some parts of the Service are billed on a subscription basis ("Subscription"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set on a monthly or annual basis.
          </p>
          <p className="mt-4">
            A valid payment method is required to process the payment for your Subscription. You shall provide AutoBill with accurate and complete billing information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Free Trial</h2>
          <p>
            AutoBill may offer a Subscription with a free trial for a limited period of time ("Free Trial"). You may be required to enter your billing information in order to sign up for the Free Trial. If you do enter your billing information when signing up for the Free Trial, you will not be charged until the Free Trial has expired.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Cancellation and Refunds</h2>
          <p>
            You can cancel your subscription at any time through your account settings. Upon cancellation, you will continue to have access to paid features until the end of your current billing period.
          </p>
          <p className="mt-4">
            Refunds are handled on a case-by-case basis. Please contact support if you believe you are entitled to a refund.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Disclaimer</h2>
          <p>
            The materials on AutoBill's platform are provided on an 'as is' basis. AutoBill makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitations</h2>
          <p>
            In no event shall AutoBill or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use AutoBill's platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Accuracy of Materials</h2>
          <p>
            The materials appearing on AutoBill's platform could include technical, typographical, or photographic errors. AutoBill does not warrant that any of the materials on its platform are accurate, complete, or current.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Modifications</h2>
          <p>
            AutoBill may revise these terms of service at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms of service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mt-2">
            Email: legal@autobill.app
          </p>
        </div>
      </div>
    </div>
  );
}
