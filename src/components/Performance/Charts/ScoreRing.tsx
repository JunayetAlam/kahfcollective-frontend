"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

type ScoreRingProps = {
  value: number;
  label: string;
  color?: string;
  size?: number;
  className?: string;
};

export function ScoreRing({
  value,
  label,
  color = "var(--perf-quiz)",
  size = 140,
  className,
}: ScoreRingProps) {
  const [display, setDisplay] = useState(0);
  const clamped = Math.max(0, Math.min(100, value));

  useEffect(() => {
    const start = performance.now();
    const duration = 700;
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(clamped * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [clamped]);

  const data = [{ name: label, value: clamped, fill: color }];

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="72%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            data={data}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              background={{ fill: "var(--muted)" }}
              dataKey="value"
              cornerRadius={8}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tracking-tight" style={{ color }}>
            {display}%
          </span>
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
