import { Link } from "wouter";
import { Zap, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: October 26, 2023</p>

            <div className="prose dark:prose-invert max-w-none">
                <p>Welcome to AutoBill. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at privacy@autobill.app.</p>

                <h2>1. What Information Do We Collect?</h2>
                <p>We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and services, or otherwise contact us.</p>
                <p>The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect can include the following: name, email address, and encrypted API keys for third-party services like Stripe and Lemon Squeezy.</p>

                <h2>2. How Do We Use Your Information?</h2>
                <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                <ul>
                    <li>To facilitate account creation and logon process.</li>
                    <li>To send administrative information to you.</li>
                    <li>To protect our Services.</li>
                    <li>To enforce our terms, conditions and policies for business purposes.</li>
                    <li>To respond to legal requests and prevent harm.</li>
                </ul>

                <h2>3. Will Your Information Be Shared With Anyone?</h2>
                <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
                <p>Specifically, your encrypted API keys are used solely to interact with the respective payment platforms (Stripe, Lemon Squeezy) on your behalf to create and manage products and pricing plans.</p>

                <h2>4. How Do We Keep Your Information Safe?</h2>
                <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. All sensitive data, such as API keys, are encrypted at rest (AES-256) and in transit (TLS).</p>

                <h2>5. What Are Your Privacy Rights?</h2>
                <p>In some regions (like the European Economic Area), you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.</p>

                <h2>6. Do We Make Updates to This Policy?</h2>
                <p>Yes, we will update this policy as necessary to stay compliant with relevant laws.</p>

                <h2>7. How Can You Contact Us About This Policy?</h2>
                <p>If you have questions or comments about this policy, you may email us at <a href="mailto:privacy@autobill.app">privacy@autobill.app</a>.</p>
            </div>
        </div>
      </main>
    </div>
  );
}
