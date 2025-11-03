import { Route, Redirect, RouteProps } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface PrivateRouteProps extends RouteProps {
  adminOnly?: boolean;
  proRequired?: boolean;
}

export const PrivateRoute = (props: PrivateRouteProps) => {
  const { user, isLoading } = useAuth();
   console.log("PrivateRoute user:", user);

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  // Example of a role-based route
  if (props.adminOnly && user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  // Example of a subscription-based route
  if (props.proRequired && user.subscriptionStatus === "free") {
    return <Redirect to="/upgrade" />;
  }

  return <Route {...props} />;
};
