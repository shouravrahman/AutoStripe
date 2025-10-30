import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Settings() {
  const { toast } = useToast();
   const queryClient = useQueryClient();

   const { data: user } = useQuery({ queryKey: ["/api/user"] });

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", "/api/user/profile", data),
    onSuccess: () => {
       toast({ title: "Profile updated successfully" });
       queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

   const upgradeMutation = useMutation({
      mutationFn: (plan: string) => apiRequest("POST", "/api/billing/upgrade", { plan }),
      onSuccess: (data) => {
         window.location.href = data.upgradeUrl;
      },
   });

  return (
     <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="profile" className="w-full">
           <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
           </TabsList>
        <TabsContent value="profile" className="space-y-4">
              <Card>
                 <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account details.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                       <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                             id="name"
                             value={profileData.name}
                             onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                             id="email"
                             type="email"
                             value={profileData.email}
                             onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          />
                       </div>
                       <Button type="submit" className="hover-elevate active-elevate-2" disabled={updateProfileMutation.isPending}>
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                       </Button>
                    </form>
                 </CardContent>
          </Card>
        </TabsContent>
           <TabsContent value="billing">
              <Card>
                 <CardHeader>
                    <CardTitle>Billing</CardTitle>
                    <CardDescription>Manage your subscription and billing details.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div>
                       <p className="font-medium">Current Plan</p>
                       <p className="text-muted-foreground capitalize">{user?.subscriptionStatus || "Free"}</p>
                    </div>
                    {user?.subscriptionStatus === "free" && (
                       <Button onClick={() => upgradeMutation.mutate("pro")} disabled={upgradeMutation.isPending}>
                          {upgradeMutation.isPending ? "Redirecting..." : "Upgrade to Pro"}
                       </Button>
                    )}
                 </CardContent>
              </Card>
           </TabsContent>
           <TabsContent value="notifications">
              <Card>
                 <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage your notification preferences.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product Generation</p>
                  <p className="text-sm text-muted-foreground">Get notified when products are created</p>
                </div>
                       <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                          <p className="font-medium">Weekly Summaries</p>
                          <p className="text-sm text-muted-foreground">Receive a weekly summary of your activity</p>
                </div>
                       <Switch />
              </div>
                 </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
