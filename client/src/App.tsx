import { PrivateRoute } from "@/components/private-route";

// Pages
import Landing from "@/pages/landing";
import Signup from "@/pages/signup";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import ProjectsList from "@/pages/projects/projects-list";
import CreateProject from "@/pages/projects/create-project";
import ProductsList from "@/pages/products/products-list";
import ProductWizard from "@/pages/products/product-wizard";
import ProductDetails from "@/pages/products/product-details";
import ProjectDetails from "@/pages/projects/project-details";
import EditProject from "@/pages/projects/edit-project";
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
// import { CookieConsent } from "./components/cookie-consent";
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
        <PrivateRoute path="/dashboard" component={() => <DashboardLayout title="Dashboard" description="Welcome back! Here's your overview"><Dashboard /></DashboardLayout>} />
        <PrivateRoute path="/dashboard/projects" component={() => <DashboardLayout title="Projects" description="Organize your products into projects"><ProjectsList /></DashboardLayout>} />
        <PrivateRoute path="/dashboard/projects/new" component={() => <DashboardLayout title="New Project" description="Create a new project to get started" showBackButton><CreateProject /></DashboardLayout>} />
        <PrivateRoute path="/dashboard/projects/:projectId" component={() => <DashboardLayout showBackButton><ProjectDetails /></DashboardLayout>} />
        <PrivateRoute path="/dashboard/projects/:projectId/edit" component={() => <DashboardLayout showBackButton><EditProject /></DashboardLayout>} />
        <PrivateRoute path="/dashboard/projects/:projectId/products/new" component={() => <DashboardLayout title="New Product" description="Create a new product for this project" showBackButton><ProductWizard /></DashboardLayout>} />
        <PrivateRoute path="/dashboard/products" component={() => <DashboardLayout title="Products" description="Manage your products"><ProductsList /></DashboardLayout>} />
        <PrivateRoute path="/dashboard/products/:productId" component={() => <DashboardLayout showBackButton><ProductDetails /></DashboardLayout>} />
        <PrivateRoute path="/dashboard/credentials" component={() => <DashboardLayout title="API Credentials" description="Manage your API credentials"><Credentials /></DashboardLayout>} />
        <PrivateRoute path="/dashboard/settings" component={() => <DashboardLayout title="Settings" description="Manage your account settings"><Settings /></DashboardLayout>} />
        <PrivateRoute path="/admin/users" component={() => <DashboardLayout title="Admin Users" description="Manage users"><AdminUsers /></DashboardLayout>} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="stripesyncer-theme">
        <TooltipProvider>
          <Toaster />
              {/* <CookieConsent /> */}
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
