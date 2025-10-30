import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="p-6 shadow-2xl border">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold mb-2">Cookie Notice</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to enhance your experience, analyze traffic, and personalize content. By clicking "Accept", you consent to our use of cookies.
            </p>
            <div className="flex gap-3">
              <Button
                size="sm"
                onClick={acceptCookies}
                data-testid="button-accept-cookies"
                className="hover-elevate active-elevate-2"
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={declineCookies}
                data-testid="button-decline-cookies"
                className="hover-elevate active-elevate-2"
              >
                Decline
              </Button>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={declineCookies}
            className="hover-elevate active-elevate-2"
            data-testid="button-close-cookie-banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
