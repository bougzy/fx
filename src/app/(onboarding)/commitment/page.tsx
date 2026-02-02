"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { completeOnboarding } from "@/actions/profile.actions";

const COMMITMENTS = [
  "I understand that this platform enforces risk rules and I accept its authority to block my trades.",
  "I commit to following the staged progression and will not attempt to skip stages.",
  "I acknowledge that losing is part of trading and I will not chase losses.",
  "I will submit a trade plan before every trade and follow it.",
  "I understand that behavior matters more than profit on this platform.",
  "I commit to completing post-trade debriefs honestly.",
];

export default function CommitmentPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState<boolean[]>(new Array(COMMITMENTS.length).fill(false));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const allAccepted = accepted.every(Boolean);

  async function handleSubmit() {
    if (!allAccepted) return;
    setIsSubmitting(true);
    try {
      await completeOnboarding();
      router.push("/dashboard");
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Commitment Agreement</h1>
        <p className="text-muted-foreground mt-2">Read and acknowledge each commitment before continuing.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">I Commit To</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {COMMITMENTS.map((commitment, i) => (
            <div key={i} className="flex items-start space-x-3">
              <Checkbox
                id={`commit-${i}`}
                checked={accepted[i]}
                onCheckedChange={(checked) => {
                  const next = [...accepted];
                  next[i] = !!checked;
                  setAccepted(next);
                }}
                className="mt-0.5"
              />
              <Label htmlFor={`commit-${i}`} className="text-sm leading-relaxed">{commitment}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!allAccepted || isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Starting your journey..." : "Begin My Journey"}
        </button>
      </div>
    </div>
  );
}
