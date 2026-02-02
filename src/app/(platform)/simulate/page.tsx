import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Play, BarChart3, Zap } from "lucide-react";
import Link from "next/link";

const SIM_MODES = [
  {
    id: "demo",
    title: "Demo Basic",
    description: "Practice pattern recognition and trade execution with simplified market conditions. No spread, no slippage.",
    icon: Play,
    href: "/simulate/demo",
    stage: "stage_3_sim_basic",
    badge: "Stage 3+",
  },
  {
    id: "realistic",
    title: "Realistic Simulation",
    description: "Trade with realistic spread, slippage, and partial fills. Conditions mirror live market behavior.",
    icon: BarChart3,
    href: "/simulate/realistic",
    stage: "stage_4_sim_realistic",
    badge: "Stage 4+",
  },
  {
    id: "replay",
    title: "Market Replay",
    description: "Replay historical market sessions candle-by-candle. Practice identifying setups in real market data.",
    icon: Play,
    href: "/simulate/replay",
    stage: "stage_4_sim_realistic",
    badge: "Stage 4+",
  },
  {
    id: "stress",
    title: "Stress Test",
    description: "Face forced losing streaks, volatility spikes, and adverse conditions. Prove you can maintain discipline under pressure.",
    icon: Zap,
    href: "/simulate/stress",
    stage: "stage_5_sim_stress",
    badge: "Stage 5+",
  },
];

export default async function SimulatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userStage = (session.user as { currentStage?: string }).currentStage || "stage_1_observer";

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulation Center</h1>
        <p className="text-muted-foreground">
          Practice trading in controlled environments. Each mode progressively increases realism and difficulty.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Simulation is not optional.</strong> Every trader must prove consistent process and risk management in simulation before accessing live markets.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {SIM_MODES.map((mode) => {
          const isLocked = mode.id !== "demo";
          const Icon = mode.icon;

          return (
            <Card key={mode.id} className={isLocked ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{mode.badge}</Badge>
                  {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{mode.title}</CardTitle>
                </div>
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {!isLocked ? (
                  <Link
                    href={mode.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    Enter Simulation
                  </Link>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Unlock by reaching {mode.badge}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
