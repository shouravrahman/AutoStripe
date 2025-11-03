import { PrivateRoute } from "@/components/private-route";

// Pages
import Landing from "@/pages/landing";
import Signup from "@/pages/signup";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import DryRunPage from "@/pages/onboard/dry-run"; // New Dry Run Page
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
import GenerationGuide from "@/pages/products/generation-guide";

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

      {/* --- Protected Routes --- */}
      
      {/* Onboarding & Creation Flows */}
      <PrivateRoute path="/onboarding" component={Onboarding} />
      <PrivateRoute path="/dashboard/onboard/dry-run">
        <DashboardLayout title="Review & Onboard" description="Review the extracted data and generate your code.">
            <DryRunPage />
        </DashboardLayout>
      </PrivateRoute>

      {/* Base Dashboard */}
      <PrivateRoute path="/dashboard">
        <DashboardLayout title="Dashboard" description="Welcome back! Here's your overview.">
          <Dashboard />
        </DashboardLayout>
      </PrivateRoute>

      {/* Project Routes */}
      <PrivateRoute path="/dashboard/projects">
        <DashboardLayout title="Projects" description="Organize your products into projects.">
          <ProjectsList />
        </DashboardLayout>
      </PrivateRoute>

      <PrivateRoute path="/dashboard/projects/new">
        <DashboardLayout title="New Project" description="Create a new project to get started" showBackButton>
          <CreateProject />
        </DashboardLayout>
      </PrivateRoute>

      <PrivateRoute path="/dashboard/projects/:projectId/edit">
        <DashboardLayout showBackButton>
          <EditProject />
        </DashboardLayout>
      </PrivateRoute>

      {/* IMPORTANT: Dynamic project route is last */}
      <PrivateRoute path="/dashboard/projects/:projectId">
        <DashboardLayout showBackButton>
          <ProjectDetails />
        </DashboardLayout>
      </PrivateRoute>

      {/* Product Routes */}
      <PrivateRoute path="/dashboard/products">
        <DashboardLayout title="Products" description="Manage your products">
          <ProductsList />
        </DashboardLayout>
      </PrivateRoute>

      <PrivateRoute path="/dashboard/products/new">
        <DashboardLayout title="New Product" description="Create a new product for this project" showBackButton>
          <ProductWizard />
        </DashboardLayout>
      </PrivateRoute>

      <PrivateRoute path="/dashboard/projects/:projectId/guide">
          <DashboardLayout showBackButton>
              <GenerationGuide />
          </DashboardLayout>
      </PrivateRoute>

      {/* IMPORTANT: Dynamic product route is last */}
      <PrivateRoute path="/dashboard/products/:productId">
        <DashboardLayout showBackButton>
          <ProductDetails />
        </DashboardLayout>
      </PrivateRoute>

      {/* Other Dashboard Routes */}
      <PrivateRoute path="/dashboard/credentials">
        <DashboardLayout title="API Credentials" description="Manage your API credentials">
          <Credentials />
        </DashboardLayout>
      </PrivateRoute>

      <PrivateRoute path="/dashboard/settings">
        <DashboardLayout title="Settings" description="Manage your account settings">
          <Settings />
        </DashboardLayout>
      </PrivateRoute>

      {/* Admin Routes */}
      <PrivateRoute path="/admin/users">
        <DashboardLayout title="Admin Users" description="Manage users">
          <AdminUsers />
        </DashboardLayout>
      </PrivateRoute>

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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;