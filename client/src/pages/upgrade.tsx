import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/apiRequest";
import { useMutation } from "@tanstack/react-query";

export default function Upgrade() {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest.post("/api/billing/upgrade", { plan: "pro" });
      return response.data;
    },
    onSuccess: (data) => {
      window.location.href = data.upgradeUrl;
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4">Upgrade to Pro</h1>
      <p className="text-lg text-muted-foreground mb-8">You need to upgrade to the Pro plan to access this feature.</p>
      <Button onClick={() => mutate()} disabled={isPending}>
        {isPending ? "Redirecting..." : "Upgrade to Pro"}
      </Button>
    </div>
  );
}
