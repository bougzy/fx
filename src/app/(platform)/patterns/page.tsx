import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

const PATTERNS = [
  { id: "engulfing", title: "Engulfing Pattern", description: "A two-candle reversal pattern showing a shift in control.", difficulty: "Beginner", winRate: "55-60%", avgRR: "1.8:1", failureRate: "40-45%" },
  { id: "pin-bar", title: "Pin Bar", description: "A single-candle rejection pattern showing failed directional attempt.", difficulty: "Beginner", winRate: "50-55%", avgRR: "2.0:1", failureRate: "45-50%" },
  { id: "break-retest", title: "Break and Retest", description: "Price breaks a key level, returns to test it, then continues.", difficulty: "Intermediate", winRate: "50-58%", avgRR: "2.5:1", failureRate: "42-50%" },
  { id: "order-block", title: "Order Block Entry", description: "Institutional order blocks as supply/demand zones.", difficulty: "Advanced", winRate: "52-58%", avgRR: "3.0:1", failureRate: "42-48%" },
];

export default async function PatternsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pattern Library</h1>
        <p className="text-muted-foreground">Learn one pattern at a time. Each includes context, entry logic, invalidation conditions, and failure scenarios.</p>
      </div>
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground"><strong>One-pattern-at-a-time rule:</strong> You must demonstrate mastery of your current pattern before unlocking the next.</p>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {PATTERNS.map((pattern, index) => {
          const isLocked = index > 0;
          return (
            <Card key={pattern.id} className={isLocked ? "opacity-50" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{pattern.difficulty}</Badge>
                  {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <CardTitle className="text-lg">{pattern.title}</CardTitle>
                <CardDescription>{pattern.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded border border-border p-2"><p className="text-muted-foreground">Win Rate</p><p className="font-mono font-medium">{pattern.winRate}</p></div>
                  <div className="rounded border border-border p-2"><p className="text-muted-foreground">Avg R:R</p><p className="font-mono font-medium">{pattern.avgRR}</p></div>
                  <div className="rounded border border-border p-2"><p className="text-muted-foreground">Failure</p><p className="font-mono font-medium">{pattern.failureRate}</p></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
