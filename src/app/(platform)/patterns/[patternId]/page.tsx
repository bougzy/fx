import { auth } from "@/lib/auth/auth";
import { redirect, notFound } from "next/navigation";
import { getPatternById } from "@/lib/constants/patterns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PatternPageProps {
  params: Promise<{ patternId: string }>;
}

export default async function PatternDetailPage({ params }: PatternPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { patternId } = await params;
  const pattern = getPatternById(patternId);

  if (!pattern) notFound();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{pattern.difficulty}</Badge>
          <Badge variant="outline">{pattern.category}</Badge>
        </div>
        <h1 className="text-2xl font-bold">{pattern.title}</h1>
        <p className="text-muted-foreground mt-1">{pattern.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="font-mono text-lg font-semibold">{pattern.winRate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Avg R:R</p>
            <p className="font-mono text-lg font-semibold">{pattern.avgRR}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Failure Rate</p>
            <p className="font-mono text-lg font-semibold">{pattern.failureRate}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 text-sm">
        <Badge variant="outline" className="w-fit">
          Best on: {pattern.timeframes.join(", ")} | {pattern.bestSessions.join(", ")}
        </Badge>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Characteristics</CardTitle>
          <CardDescription>What defines this pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {pattern.keyCharacteristics.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Entry Rules</CardTitle>
          <CardDescription>Step-by-step execution</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
            {pattern.entryRules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base">Invalidation Conditions</CardTitle>
          <CardDescription>When to avoid or exit this setup</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {pattern.invalidationConditions.map((cond, i) => (
              <li key={i}>{cond}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-base">Common Mistakes</CardTitle>
          <CardDescription>What most traders get wrong</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {pattern.commonMistakes.map((mistake, i) => (
              <li key={i}>{mistake}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Context Requirements</CardTitle>
          <CardDescription>Required conditions before trading this pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {pattern.contextRequirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
