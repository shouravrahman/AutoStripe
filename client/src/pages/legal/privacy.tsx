import { Link } from "wouter";
import { Zap } from "lucide-react";

export default function Privacy() {
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
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: January 15, 2025
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg">
            Your privacy is important to us. This privacy policy explains what personal data AutoBill collects and how we use it.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Account Information</h3>
          <p>
            When you create an account, we collect:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email address</li>
            <li>Name</li>
            <li>Password (encrypted)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">API Credentials</h3>
          <p>
            When you connect payment platforms, we collect and encrypt:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Stripe API keys (publishable and secret)</li>
            <li>LemonSqueezy API keys</li>
          </ul>
          <p className="mt-4">
            These credentials are encrypted at rest using industry-standard encryption (AES-256) and are only used to create and manage products on your behalf.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Usage Data</h3>
          <p>
            We collect information about how you use AutoBill, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Projects created</li>
            <li>Products generated</li>
            <li>Features used</li>
            <li>Log data (IP address, browser type, pages visited)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the collected data for various purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
          <p>
            The security of your data is important to us. We implement appropriate technical and organizational security measures:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>All API keys are encrypted using AES-256 encryption</li>
            <li>Passwords are hashed using bcrypt</li>
            <li>All data transmission uses HTTPS/TLS encryption</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Services</h2>
          <p>
            AutoBill integrates with third-party services:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Stripe:</strong> We use your Stripe API keys to create products on your behalf</li>
            <li><strong>LemonSqueezy:</strong> We use your LemonSqueezy API keys to create products on your behalf</li>
            <li><strong>OpenAI:</strong> We use OpenAI's API for AI-powered suggestions (no sensitive data is sent)</li>
          </ul>
          <p className="mt-4">
            We do not share your API credentials with any third parties beyond the intended platforms (Stripe, LemonSqueezy). We never process actual payment transactions or access customer payment information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary for the purposes set out in this Privacy Policy. We will retain and use your data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
          </p>
          <p className="mt-4">
            If you delete your account, we will delete your personal data and API credentials within 30 days.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights (GDPR)</h2>
          <p>
            If you are a resident of the European Economic Area (EEA), you have certain data protection rights:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Access:</strong> You can request copies of your personal data</li>
            <li><strong>Rectification:</strong> You can request correction of inaccurate data</li>
            <li><strong>Erasure:</strong> You can request deletion of your data</li>
            <li><strong>Restriction:</strong> You can request restriction of processing</li>
            <li><strong>Objection:</strong> You can object to our processing of your data</li>
            <li><strong>Portability:</strong> You can request transfer of your data</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our Service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
          <p>
            Our Service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <p className="mt-2">
            Email: privacy@autobill.app
          </p>
        </div>
      </div>
    </div>
  );
}
