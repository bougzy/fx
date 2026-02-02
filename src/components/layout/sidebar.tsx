"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, Shapes, LineChart, TrendingUp, BookText, BarChart3, User, Settings, Shield } from "lucide-react";
import { type Stage, STAGE_LABELS, STAGE_ALLOWED_ROUTES } from "@/lib/constants/stages";

interface SidebarProps {
  currentStage: Stage;
  userName: string;
  behaviorScore: number;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/patterns", label: "Patterns", icon: Shapes },
  { href: "/simulate", label: "Simulate", icon: LineChart },
  { href: "/trade", label: "Trade", icon: TrendingUp },
  { href: "/journal", label: "Journal", icon: BookText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar({ currentStage, userName, behaviorScore }: SidebarProps) {
  const pathname = usePathname();
  const allowedRoutes = STAGE_ALLOWED_ROUTES[currentStage] || [];

  function isRouteAllowed(href: string): boolean {
    return allowedRoutes.some((route) => href.startsWith(route));
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-lg font-semibold text-sidebar-foreground">FX Discipline</span>
      </div>
      <div className="border-b border-sidebar-border px-6 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Current Stage</p>
        <p className="mt-1 text-sm font-medium text-sidebar-foreground">{STAGE_LABELS[currentStage] || currentStage}</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${behaviorScore}%` }} />
          </div>
          <span className="text-xs text-muted-foreground">{behaviorScore}</span>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">Behavior Score</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const allowed = isRouteAllowed(item.href);
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                {allowed ? (
                  <Link href={item.href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/50")}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/40 cursor-not-allowed">
                    <Icon className="h-4 w-4" />
                    {item.label}
                    <span className="ml-auto text-[10px] uppercase">Locked</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
          <User className="h-4 w-4" />
          {userName}
        </Link>
        <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
