import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const REPLAY_SESSIONS = [
  { id: "london-breakout-1", title: "London Breakout - EUR/USD", date: "2024-01-15", pair: "EUR/USD", session: "London", difficulty: "Intermediate" },
  { id: "ny-reversal-1", title: "NY Session Reversal - GBP/USD", date: "2024-02-03", pair: "GBP/USD", session: "New York", difficulty: "Intermediate" },
  { id: "asian-range-1", title: "Asian Range Play - USD/JPY", date: "2024-01-22", pair: "USD/JPY", session: "Asian", difficulty: "Beginner" },
  { id: "news-event-1", title: "NFP Release - EUR/USD", date: "2024-03-08", pair: "EUR/USD", session: "New York", difficulty: "Advanced" },
];

export default async function ReplayPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Market Replay</h1>
        <p className="text-muted-foreground">
          Replay historical market sessions candle-by-candle. Identify setups, plan trades, and execute as if it were live.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>How it works:</strong> Select a session below. Price will advance one candle at a time. You must submit a trade plan before executing, just like in live conditions.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Available Sessions</h2>
        <div className="grid gap-3">
          {REPLAY_SESSIONS.map((rs) => (
            <Card key={rs.id} className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{rs.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs">{rs.difficulty}</Badge>
                </div>
                <CardDescription className="flex gap-3 text-xs">
                  <span>{rs.pair}</span>
                  <span>{rs.session} Session</span>
                  <span>{rs.date}</span>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Replay Viewer</CardTitle>
          <CardDescription>Select a session above to begin replay</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] rounded-lg border border-dashed border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-sm font-medium">Candle-by-candle replay</p>
              <p className="text-xs mt-1">Select a session to begin</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
