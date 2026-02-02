import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DemoSimPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Demo Simulation</h1>
        <p className="text-muted-foreground">Practice pattern recognition and trade execution in a simplified environment.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Spread</p>
            <p className="font-mono text-lg font-semibold">0 pips</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Slippage</p>
            <p className="font-mono text-lg font-semibold">None</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Account</p>
            <p className="font-mono text-lg font-semibold">$10,000</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Simulation Chart</CardTitle>
          <CardDescription>Basic demo with synthetic price data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-lg border border-dashed border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-sm font-medium">TradingView Lightweight Chart</p>
              <p className="text-xs mt-1">Demo simulation engine loads here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Session Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Trades Taken</span><span className="font-mono">0</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Win Rate</span><span className="font-mono">--</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Avg R:R</span><span className="font-mono">--</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Behavior Score</span><span className="font-mono">100</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
