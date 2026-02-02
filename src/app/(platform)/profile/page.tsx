import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STAGE_LABELS } from "@/lib/constants/stages";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = session.user;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Your account and trading profile.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Name</span>
            <span>{user.name || "\u2014"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Stage</span>
            <Badge variant="secondary">{STAGE_LABELS[user.currentStage as keyof typeof STAGE_LABELS] || user.currentStage}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Behavior Score</span>
            <span className="font-mono">{(user.behaviorScore ?? 100)}/100</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
