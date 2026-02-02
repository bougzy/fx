import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default async function TradePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trade Execution</h1>
        <p className="text-muted-foreground">Submit your trade plan and execute with discipline.</p>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Pre-trade plan required</p>
            <p className="text-xs text-muted-foreground mt-1">
              You must submit a trade plan and receive mentor approval before executing any trade. No exceptions.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trade Plan Submission</CardTitle>
          <CardDescription>Complete all fields before submitting for review</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Trade form loads here. You must be at Stage 3 or above to execute trades.</p>
        </CardContent>
      </Card>
    </div>
  );
}
