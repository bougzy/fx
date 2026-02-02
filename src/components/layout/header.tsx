"use client";

import { Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { type Stage } from "@/lib/constants/stages";

interface HeaderProps {
  currentStage: Stage;
  userName: string;
  behaviorScore: number;
}

export function Header({ currentStage, userName, behaviorScore }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar currentStage={currentStage} userName={userName} behaviorScore={behaviorScore} />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-semibold">FX Discipline</span>
      </div>
    </header>
  );
}
