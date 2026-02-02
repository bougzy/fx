import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import Link from "next/link";

const COURSES = [
  { id: "why-price-moves", title: "Why Price Moves", description: "Understand the fundamental mechanics of price movement in forex markets.", lessons: 5, category: "foundations", stage: "stage_1_observer" },
  { id: "liquidity-and-order-flow", title: "Liquidity & Order Flow", description: "Learn how liquidity drives price and why retail traders consistently lose.", lessons: 4, category: "foundations", stage: "stage_1_observer" },
  { id: "market-sessions", title: "Market Sessions & Timing", description: "Understand the three major trading sessions and when volatility occurs.", lessons: 3, category: "foundations", stage: "stage_1_observer" },
  { id: "risk-management-fundamentals", title: "Risk Management Fundamentals", description: "Position sizing, stop losses, and why capital preservation is everything.", lessons: 6, category: "risk_management", stage: "stage_1_observer" },
  { id: "trading-psychology", title: "Trading Psychology", description: "Understand the cognitive biases that destroy trading accounts.", lessons: 5, category: "psychology", stage: "stage_1_observer" },
  { id: "market-structure", title: "Market Structure", description: "Learn to read higher highs, higher lows, and structural shifts.", lessons: 4, category: "market_structure", stage: "stage_2_student" },
  { id: "supply-demand-zones", title: "Supply & Demand Zones", description: "Identify institutional supply and demand areas on charts.", lessons: 5, category: "patterns", stage: "stage_2_student" },
];

export default async function LearnPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userStage = (session.user as any).currentStage || "stage_1_observer";
  const stageOrder = ["onboarding","stage_1_observer","stage_2_student","stage_3_sim_basic","stage_4_sim_realistic","stage_5_sim_stress","stage_6_live_micro","stage_7_live_mini","stage_8_live_standard"];
  const userStageIndex = stageOrder.indexOf(userStage);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Learn</h1>
        <p className="text-muted-foreground">Build your understanding of forex markets from first principles. No indicators, no shortcuts.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {COURSES.map((course) => {
          const isLocked = stageOrder.indexOf(course.stage) > userStageIndex;
          return (
            <Card key={course.id} className={isLocked ? "opacity-50" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs capitalize">{course.category.replace("_", " ")}</Badge>
                  {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{course.lessons} lessons</span>
                  {!isLocked ? (
                    <Link href={`/learn/${course.id}/introduction`} className="text-sm text-primary hover:underline">Start Learning</Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">Locked</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
