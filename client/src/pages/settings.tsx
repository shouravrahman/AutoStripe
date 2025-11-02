import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/apiRequest";
import { ArrowRight, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

const ProfileSkeleton = () => (
    <Card>
        <CardHeader><Skeleton className="h-7 w-24"/><Skeleton className="h-4 w-48 mt-2"/></CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2"><Skeleton className="h-4 w-12"/><Skeleton className="h-10 w-full"/></div>
            <div className="space-y-2"><Skeleton className="h-4 w-12"/><Skeleton className="h-10 w-full"/></div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4"><Skeleton className="h-10 w-24"/></CardFooter>
    </Card>
);

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: user, isLoading: isUserLoading } = useQuery({ 
      queryKey: ['/api/user'], 
      queryFn: async () => (await apiRequest.get('/api/user')).data 
  });

  const [profileData, setProfileData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
     mutationFn: (data) => apiRequest.patch("/api/user/profile", data),
     onSuccess: () => {
       toast({ title: "Profile Updated", description: "Your changes have been saved." });
       queryClient.invalidateQueries({ queryKey: ['/api/user'] });
     },
     onError: (error) => toast({ title: "Update Failed", description: error.message, variant: "destructive" })
  });
  
  const deleteAccountMutation = useMutation({
     mutationFn: () => apiRequest.delete("/api/user"),
     onSuccess: () => { window.location.href = '/'; },
     onError: (error) => toast({ title: "Deletion Failed", description: error.message, variant: "destructive" })
  });

  const upgradeMutation = useMutation({
      mutationFn: (plan) => apiRequest.post("/api/billing/create-checkout-session", { plan }),
      onSuccess: ({ url }) => {
         if (url) window.location.href = url;
         else toast({ title: "Could not retrieve upgrade link.", variant: "destructive" });
      },
      onError: (error) => toast({ title: "Upgrade Failed", description: error.message, variant: "destructive" })
   });

   const manageSubscriptionMutation = useMutation({
        mutationFn: () => apiRequest.post("/api/billing/create-portal-session"),
        onSuccess: ({ url }) => { 
            if (url) window.location.href = url; 
            else toast({ title: "Could not retrieve portal link.", variant: "destructive" });
        },
        onError: (error) => toast({ title: "Action Failed", description: error.message, variant: "destructive" })
   })

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  return (
     <DashboardLayout title="Settings" description="Manage your account, billing, and notification settings.">
        <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                {isUserLoading ? <ProfileSkeleton /> : (
                    <>
                        <Card>
                            <CardHeader><CardTitle>Account Information</CardTitle><CardDescription>Update your name and email address.</CardDescription></CardHeader>
                            <form onSubmit={handleProfileSubmit}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} disabled={isUserLoading} /></div>
                                    <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} disabled={isUserLoading} /></div>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4"><Button disabled={updateProfileMutation.isPending || isUserLoading}>{updateProfileMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Saving...</> : 'Save Changes'}</Button></CardFooter>
                            </form>
                        </Card>
                        <Card className="mt-6 border-destructive">
                            <CardHeader><CardTitle>Delete Account</CardTitle><CardDescription>Permanently delete your account and all associated data. This action cannot be undone.</CardDescription></CardHeader>
                            <CardFooter className="border-t border-destructive/50 px-6 py-4"><Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>Delete Account</Button></CardFooter>
                        </Card>
                    </>
                )}
            </TabsContent>
            <TabsContent value="billing">
                <Card>
                    <CardHeader><CardTitle>Billing</CardTitle><CardDescription>Manage your subscription plan and billing details.</CardDescription></CardHeader>
                    <CardContent>
                        <div className="p-6 mb-6 border rounded-lg bg-muted/50">
                            <p className="font-medium text-sm text-muted-foreground">Current Plan</p>
                            <p className="text-2xl font-bold capitalize">{isUserLoading ? <Skeleton className="h-8 w-24 mt-1" /> : user?.subscriptionStatus || "Free"}</p>
                        </div>
                        {isUserLoading ? <Skeleton className="h-40 w-full" /> : user?.subscriptionStatus !== "pro" ? (
                            <Card>
                                <CardHeader><CardTitle>Upgrade to Pro</CardTitle><CardDescription>Unlock unlimited projects, products, and advanced features for just $29/month.</CardDescription></CardHeader>
                                <CardFooter>
                                <Button onClick={() => upgradeMutation.mutate("pro")} disabled={upgradeMutation.isPending}>{upgradeMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Redirecting...</> : <>Upgrade Now <ArrowRight className="ml-2 h-4 w-4" /></>}</Button>
                                </CardFooter>
                            </Card>
                        ) : (
                            <div><Button onClick={() => manageSubscriptionMutation.mutate()} disabled={manageSubscriptionMutation.isPending}>Manage Subscription</Button></div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="notifications">
                <Card>
                    <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Choose how you want to be notified.</CardDescription></CardHeader>
                    <CardContent className="divide-y">
                        <div className="flex items-center justify-between py-4"><Label htmlFor="product-updates" className="flex flex-col gap-1"><span className="font-medium">Product Updates</span><span className="text-sm text-muted-foreground">Receive emails about new features and updates.</span></Label><Switch id="product-updates" defaultChecked /></div>
                        <div className="flex items-center justify-between py-4"><Label htmlFor="weekly-summary" className="flex flex-col gap-1"><span className="font-medium">Weekly Summary</span><span className="text-sm text-muted-foreground">Get a weekly summary of your account activity.</span></Label><Switch id="weekly-summary" /></div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4"><Button>Save Preferences</Button></CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently delete your account, projects, and all associated data. This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteAccountMutation.mutate()} className="bg-destructive hover:bg-destructive/90" disabled={deleteAccountMutation.isPending}>Delete Account</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </DashboardLayout>
  );
}
