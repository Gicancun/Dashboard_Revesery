import type { ReactNode } from "react";

type Tone = "brand" | "churn" | "retain" | "warn" | "neutral";

const tones: Record<Tone, string> = {
  brand: "bg-brand/10 text-brand",
  churn: "bg-churn/10 text-churn",
  retain: "bg-retain/10 text-retain",
  warn: "bg-warn/10 text-warn",
  neutral: "bg-surface-2 text-muted",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`chip ${tones[tone]}`}>{children}</span>;
}
