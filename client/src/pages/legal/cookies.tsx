import { Link } from "wouter";
import { Zap } from "lucide-react";

export default function Cookies() {
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
        <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: January 15, 2025
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg">
            This Cookie Policy explains how AutoBill uses cookies and similar technologies to recognize you when you visit our platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Why do we use cookies?</h2>
          <p>
            We use cookies for several reasons:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>To enable certain functions of the Service</li>
            <li>To provide analytics</li>
            <li>To store your preferences</li>
            <li>To enable authentication and security</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">What types of cookies do we use?</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies</h3>
          <p>
            These cookies are strictly necessary to provide you with services available through our platform and to use some of its features, such as access to secure areas.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Authentication cookies:</strong> Used to identify you when you log in</li>
            <li><strong>Session cookies:</strong> Maintain your session across pages</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Preference Cookies</h3>
          <p>
            These cookies allow our platform to remember choices you make (such as your theme preference) and provide enhanced, more personal features.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Theme preference:</strong> Stores your dark/light mode choice</li>
            <li><strong>Language preference:</strong> Stores your language selection</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our platform by collecting and reporting information anonymously.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Usage analytics:</strong> Track which features are used most</li>
            <li><strong>Performance monitoring:</strong> Measure page load times</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How can you control cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the cookie consent banner that appears when you first visit our platform.
          </p>
          <p className="mt-4">
            You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our platform though your access to some functionality and areas may be restricted.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Browser Settings</h2>
          <p>
            Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience of our platform. Here's how to manage cookies in popular browsers:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
            <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Cookies</h2>
          <p>
            In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service. These third parties include:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Analytics providers (for usage tracking)</li>
            <li>Performance monitoring services</li>
          </ul>
          <p className="mt-4">
            We do not share your personal data with advertising networks or use advertising cookies.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Updates to this Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us:
          </p>
          <p className="mt-2">
            Email: privacy@autobill.app
          </p>
        </div>
      </div>
    </div>
  );
}
