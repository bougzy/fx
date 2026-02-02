import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function JournalPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trading Journal</h1>
        <p className="text-muted-foreground">Reflect, review, and learn from every trade.</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Journaling is mandatory.</strong> Every trade generates an automatic journal entry. Add your reflections and emotional state after each session.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Entries</CardTitle>
            <CardDescription>Your latest journal entries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No journal entries yet. Complete a trade to start.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Entry</CardTitle>
            <CardDescription>Add a reflection or emotional log</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["Daily Reflection", "Emotional Log", "Lesson Learned"].map((type) => (
                <Badge key={type} variant="outline" className="cursor-pointer hover:bg-accent">{type}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
