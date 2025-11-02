import { Link } from "wouter";
import { Zap, ArrowLeft } from "lucide-react";

export default function CookiesPolicyPage() {
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
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: October 26, 2023</p>

            <div className="prose dark:prose-invert max-w-none">
                <p>This Cookie Policy explains how AutoBill Inc. ("we", "us", and "ours") use cookies and similar technologies to recognize you when you visit our website at autobill.app ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>
                
                <h2>What are cookies?</h2>
                <p>A cookie is a small file containing a string of characters that is sent to your computer when you visit a website. When you visit the site again, the cookie allows that site to recognize your browser. Cookies may store user preferences and other information. </p>

                <h2>Why do we use cookies?</h2>
                <p>We use cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our Website. </p>
                
                <h2>What types of cookies do we use?</h2>
                <ul>
                    <li><strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.</li>
                    <li><strong>Performance and Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources, so we can measure and improve the performance of our site.</li>
                    <li><strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization.</li>
                </ul>

                <h2>How can you control cookies?</h2>
                <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by setting or amending your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.</p>
                
                <h2>Changes to this Cookie Policy</h2>
                <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>

                <h2>Contact Us</h2>
                <p>If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:privacy@autobill.app">privacy@autobill.app</a>.</p>
            </div>
        </div>
      </main>
    </div>
  );
}
