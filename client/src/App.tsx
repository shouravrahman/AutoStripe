import { PrivateRoute } from "@/components/private-route";

// Pages
import Landing from "@/pages/landing";
import Signup from "@/pages/signup";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import ProjectsList from "@/pages/projects/projects-list";
import CreateProject from "@/pages/projects/create-project";
import ProductsList from "@/pages/products/products-list";
import ProductWizard from "@/pages/products/product-wizard";
import GenerationGuide from "@/pages/products/generation-guide";
import ProductDetails from "@/pages/products/product-details";
import Credentials from "@/pages/credentials";
import Settings from "@/pages/settings";
import AdminUsers from "@/pages/admin/users";
import Upgrade from "@/pages/upgrade";

// Legal
import Terms from "@/pages/legal/terms";
import Privacy from "@/pages/legal/privacy";
import Cookies from "@/pages/legal/cookies";

import NotFound from "@/pages/not-found";
import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "./components/ui/toaster";
import { CookieConsent } from "./components/cookie-consent";
import { queryClient } from "./lib/queryClient";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
        <Route path="/upgrade" component={Upgrade} />

      {/* Legal */}
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/cookies" component={Cookies} />

      {/* Protected routes */}
        <PrivateRoute path="/onboarding" component={Onboarding} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/dashboard/projects" component={ProjectsList} />
        <PrivateRoute path="/dashboard/projects/new" component={CreateProject} />
        <PrivateRoute path="/dashboard/projects/:projectId/products/new" component={ProductWizard} proRequired />
        <PrivateRoute path="/dashboard/projects/:projectId/guide" component={GenerationGuide} proRequired />
        <PrivateRoute path="/dashboard/products" component={ProductsList} />
        <PrivateRoute path="/dashboard/products/:productId" component={ProductDetails} />
        <PrivateRoute path="/dashboard/credentials" component={Credentials} />
        <PrivateRoute path="/dashboard/settings" component={Settings} />
        <PrivateRoute path="/admin/users" component={AdminUsers} adminOnly />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="autobill-theme">
        <TooltipProvider>
          <Toaster />
          <CookieConsent />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
