import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Process metrics, behavior trends, and progression analysis.</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Process over profit.</strong> This dashboard focuses on your trading process quality, not P&L. Consistent process leads to consistent results.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Behavior Trend</CardTitle>
            <CardDescription>Your behavior score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] rounded-lg border border-dashed border-border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Chart loads after first trades</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Process Metrics</CardTitle>
            <CardDescription>Plan adherence and execution quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] rounded-lg border border-dashed border-border flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Data loads after first trades</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Progression Map</CardTitle>
          <CardDescription>Your journey through the stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[150px] rounded-lg border border-dashed border-border flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Stage progression visualization</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
