"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, LineChart, BookText, BarChart3 } from "lucide-react";
import { type Stage, STAGE_ALLOWED_ROUTES } from "@/lib/constants/stages";

interface MobileNavProps {
  currentStage: Stage;
}

const mobileNavItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/simulate", label: "Sim", icon: LineChart },
  { href: "/journal", label: "Journal", icon: BookText },
  { href: "/analytics", label: "Stats", icon: BarChart3 },
];

export function MobileNav({ currentStage }: MobileNavProps) {
  const pathname = usePathname();
  const allowedRoutes = STAGE_ALLOWED_ROUTES[currentStage] || [];

  function isRouteAllowed(href: string): boolean {
    return allowedRoutes.some((route) => href.startsWith(route));
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <ul className="flex items-center justify-around px-2 py-2">
        {mobileNavItems.map((item) => {
          const allowed = isRouteAllowed(item.href);
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              {allowed ? (
                <Link href={item.href} className={cn("flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs transition-colors", isActive ? "text-primary font-medium" : "text-muted-foreground")}>
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-muted-foreground/30 cursor-not-allowed">
                  <Icon className="h-5 w-5" />
                  {item.label}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
