import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { STAGE_LABELS, STAGE_DESCRIPTIONS } from "@/lib/constants/stages";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const stage = session.user.currentStage || "stage_1_observer";
  const stageLabel = STAGE_LABELS[stage as keyof typeof STAGE_LABELS] || stage;
  const stageDescription = STAGE_DESCRIPTIONS[stage as keyof typeof STAGE_DESCRIPTIONS] || "";
  const behaviorScore = session.user.behaviorScore ?? 100;
  const riskScore = session.user.riskComplianceScore ?? 100;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Your daily overview and progress.</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Current Stage</CardTitle>
            <Badge>{stageLabel}</Badge>
          </div>
          <CardDescription>{stageDescription}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Behavior Score</CardTitle>
            <CardDescription>Tracks your trading discipline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-2xl font-bold">{behaviorScore}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <Progress value={behaviorScore} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Risk Compliance</CardTitle>
            <CardDescription>Adherence to risk management rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-2xl font-bold">{riskScore}</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <Progress value={riskScore} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Trades Today</p>
            <p className="font-mono text-2xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Daily P&L</p>
            <p className="font-mono text-2xl font-bold text-muted-foreground">$0.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Open Positions</p>
            <p className="font-mono text-2xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
