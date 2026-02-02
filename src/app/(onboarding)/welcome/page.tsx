import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function WelcomePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to FX Discipline</h1>
        <p className="text-muted-foreground mt-2">Before you begin, understand what this platform is — and what it is not.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-emerald-500">This Platform IS</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>A structured discipline-building system for forex traders</li>
            <li>A risk-first mentorship tool that enforces proper process</li>
            <li>A progressive learning environment with locked stages</li>
            <li>An honest system that will block you when you break rules</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-rose-500">This Platform IS NOT</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>A signal provider or trade copier</li>
            <li>An auto-trading bot or AI that trades for you</li>
            <li>A shortcut to profitability</li>
            <li>A platform that will tell you what to trade</li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link href="/assessment" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Continue to Assessment
        </Link>
      </div>
    </div>
  );
}
