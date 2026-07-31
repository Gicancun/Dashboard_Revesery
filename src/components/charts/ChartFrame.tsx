import type { ReactNode } from "react";

/** Membungkus chart agar responsif dengan tinggi tetap & tidak melebar liar. */
export function ChartFrame({ height = 300, children }: { height?: number; children: ReactNode }) {
  return (
    <div className="relative w-full" style={{ height }}>
      {children}
    </div>
  );
}
