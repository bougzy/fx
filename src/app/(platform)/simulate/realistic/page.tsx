import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export default async function RealisticSimPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Realistic Simulation</h1>
        <p className="text-muted-foreground">
          Trade with real-world conditions: variable spreads, slippage, and partial fills.
        </p>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Realistic Conditions Active</p>
            <p className="text-xs text-muted-foreground mt-1">
              Spread widens during news events. Slippage occurs on fast-moving markets. Your fills may differ from your intended entry.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Avg Spread</p>
            <p className="font-mono text-lg font-semibold">1.2 pips</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Max Slippage</p>
            <p className="font-mono text-lg font-semibold">0.5 pips</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Fill Rate</p>
            <p className="font-mono text-lg font-semibold">95%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Simulation Chart</CardTitle>
          <CardDescription>Realistic market simulation with spread and slippage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-lg border border-dashed border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-sm font-medium">TradingView Chart</p>
              <p className="text-xs mt-1">Realistic simulation engine loads here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Session Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Trades Taken</span><span className="font-mono">0</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Win Rate</span><span className="font-mono">--</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Avg R:R</span><span className="font-mono">--</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Plan Adherence</span><span className="font-mono">--</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Requirements to Pass</CardTitle>
            <CardDescription>50+ trades needed</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">REQ</Badge> Win rate &ge; 40%</li>
              <li className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">REQ</Badge> Avg R:R &ge; 1.5:1</li>
              <li className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">REQ</Badge> Plan adherence &ge; 80%</li>
              <li className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">REQ</Badge> Behavior score &ge; 80</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
