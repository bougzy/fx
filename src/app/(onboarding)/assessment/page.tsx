"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { completeAssessment } from "@/actions/profile.actions";

const MOTIVATIONS = [
  "Build consistent trading discipline",
  "Learn proper risk management",
  "Transition from demo to live trading safely",
  "Overcome emotional trading patterns",
  "Develop a structured trading process",
];

export default function AssessmentPage() {
  const router = useRouter();
  const [experience, setExperience] = useState<string>("");
  const [motivations, setMotivations] = useState<string[]>([]);
  const [riskTolerance, setRiskTolerance] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!experience || motivations.length === 0 || !riskTolerance) return;
    setIsSubmitting(true);
    try {
      await completeAssessment({
        experienceLevel: experience as "none" | "beginner" | "intermediate" | "advanced",
        motivations,
        riskTolerance: riskTolerance as "conservative" | "moderate" | "aggressive",
      });
      router.push("/commitment");
    } catch {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Self-Assessment</h1>
        <p className="text-muted-foreground mt-2">Help us calibrate your starting point. Be honest.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trading Experience</CardTitle>
          <CardDescription>How would you describe your forex experience?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={experience} onValueChange={setExperience}>
            {[
              { value: "none", label: "No experience" },
              { value: "beginner", label: "Beginner (< 6 months)" },
              { value: "intermediate", label: "Intermediate (6 months - 2 years)" },
              { value: "advanced", label: "Advanced (2+ years)" },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={opt.value} />
                <Label htmlFor={opt.value} className="text-sm">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Motivations</CardTitle>
          <CardDescription>Select all that apply</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOTIVATIONS.map((m) => (
            <div key={m} className="flex items-center space-x-2">
              <Checkbox
                id={m}
                checked={motivations.includes(m)}
                onCheckedChange={(checked) => {
                  if (checked) setMotivations([...motivations, m]);
                  else setMotivations(motivations.filter((v) => v !== m));
                }}
              />
              <Label htmlFor={m} className="text-sm">{m}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risk Tolerance</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={riskTolerance} onValueChange={setRiskTolerance}>
            {[
              { value: "conservative", label: "Conservative — I prefer small, controlled risks" },
              { value: "moderate", label: "Moderate — I accept calculated risks" },
              { value: "aggressive", label: "Aggressive — I'm comfortable with higher risk" },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`risk-${opt.value}`} />
                <Label htmlFor={`risk-${opt.value}`} className="text-sm">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!experience || motivations.length === 0 || !riskTolerance || isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Continue to Commitment"}
        </button>
      </div>
    </div>
  );
}
