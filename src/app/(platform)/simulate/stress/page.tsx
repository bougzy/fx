import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Zap, TrendingDown, Activity } from "lucide-react";

const STRESS_SCENARIOS = [
  {
    id: "forced-losing-streak",
    title: "Forced Losing Streak",
    description: "Experience 5 consecutive losses in a row. The system will force losing outcomes. Your job is to maintain position sizing discipline and follow your process.",
    icon: TrendingDown,
    metrics: "5 forced losses, normal volatility",
  },
  {
    id: "volatility-spike",
    title: "Volatility Spike",
    description: "Trade during extreme volatility conditions. Spreads widen 3x, slippage increases, and price moves are amplified.",
    icon: Activity,
    metrics: "3x volatility, 3x spread, 2x slippage",
  },
  {
    id: "drawdown-recovery",
    title: "Drawdown Recovery",
    description: "Start with a 5% account drawdown already in place. Demonstrate controlled recovery without revenge trading or position sizing violations.",
    icon: Zap,
    metrics: "5% initial drawdown, normal conditions",
  },
];

export default async function StressTestPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Stress Test</h1>
        <p className="text-muted-foreground">
          Prove you can maintain discipline under adverse conditions. You must pass all scenarios to advance to live trading.
        </p>
      </div>

      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">These scenarios are designed to be uncomfortable</p>
            <p className="text-xs text-muted-foreground mt-1">
              The purpose is not to profit. It is to demonstrate that you can follow your rules when everything goes wrong. Your behavior score and risk compliance are what matter here.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Scenarios</h2>
        <div className="grid gap-4">
          {STRESS_SCENARIOS.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <Card key={scenario.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-base">{scenario.title}</CardTitle>
                  </div>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{scenario.metrics}</Badge>
                    <Badge variant="secondary" className="text-xs">Not attempted</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pass Criteria</CardTitle>
          <CardDescription>All three scenarios must be passed</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">REQ</Badge>
              Maintain risk per trade within limits throughout all scenarios
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">REQ</Badge>
              No revenge trading flags triggered
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">REQ</Badge>
              No position sizing violations
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">REQ</Badge>
              Behavior score remains &ge; 85 throughout
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">REQ</Badge>
              Complete post-scenario debrief for each
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
