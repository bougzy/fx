import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { type Stage, STAGES } from "@/lib/constants/stages";

interface PlatformShellProps {
  children: React.ReactNode;
}

export async function PlatformShell({ children }: PlatformShellProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const currentStage = ((session.user as any).currentStage || STAGES.ONBOARDING) as Stage;
  const userName = session.user.name || "User";
  const behaviorScore = (session.user as any).behaviorScore ?? 100;

  if (currentStage === STAGES.ONBOARDING) redirect("/welcome");

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex">
        <Sidebar currentStage={currentStage} userName={userName} behaviorScore={behaviorScore} />
      </div>
      <div className="flex flex-1 flex-col">
        <Header currentStage={currentStage} userName={userName} behaviorScore={behaviorScore} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">{children}</main>
        <MobileNav currentStage={currentStage} />
      </div>
    </div>
  );
}
