import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/apiRequest";
import { DollarSign, FolderOpen, Key, Activity, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

const StatCard = ({ title, value, icon: Icon, isLoading }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{value}</div>}
        </CardContent>
    </Card>
);

export default function Dashboard() {
   const { data: stats, isLoading, isError, error } = useQuery({
     queryKey: ["/api/stats"],
     queryFn: async () => {
        const response = await apiRequest.get("/api/stats");
        return response.data;
     },
  });

   if (isError) {
      return (
         <div className="flex items-center justify-center h-screen text-destructive">Error: {error.message}</div>
      );
   }

  return (
    <DashboardLayout>
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
            </div>
            <Button asChild>
                <Link href="/dashboard/projects/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                </Link>
            </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard title="Total Revenue" value={`$${stats?.totalRevenue || 0}`} icon={DollarSign} isLoading={isLoading} />
            <StatCard title="Total Projects" value={stats?.totalProjects || 0} icon={FolderOpen} isLoading={isLoading} />
            <StatCard title="Products Created" value={stats?.totalProducts || 0} icon={Package} isLoading={isLoading} />
            <StatCard title="Active Webhooks" value={stats?.totalWebhooks || 0} icon={Activity} isLoading={isLoading} />
        </div>

        {/* Recent Activity */}
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                <div className="space-y-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>
                ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <Zap className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No activity to show</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Your recent activities will appear here once you create a project.</p>
                </div>
                )}
            </CardContent>
        </Card>
    </DashboardLayout>
  );
}
