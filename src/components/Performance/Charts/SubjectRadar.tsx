"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";

type RadarPoint = {
  axis: string;
  subjectA: number;
  subjectB?: number;
};

type Props = {
  data: RadarPoint[];
  seriesALabel?: string;
  seriesBLabel?: string;
  dual?: boolean;
  className?: string;
};

export function SubjectRadar({
  data,
  seriesALabel = "Subject A",
  seriesBLabel = "Subject B",
  dual = true,
  className,
}: Props) {
  const config: ChartConfig = {
    subjectA: { label: seriesALabel, color: "var(--perf-subject-a)" },
    subjectB: { label: seriesBLabel, color: "var(--perf-subject-b)" },
  };

  return (
    <ChartContainer config={config} className={className ?? "aspect-square max-h-[360px] w-full"}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Radar
          name={seriesALabel}
          dataKey="subjectA"
          stroke="var(--color-subjectA)"
          fill="var(--color-subjectA)"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        {dual && (
          <Radar
            name={seriesBLabel}
            dataKey="subjectB"
            stroke="var(--color-subjectB)"
            fill="var(--color-subjectB)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        )}
      </RadarChart>
    </ChartContainer>
  );
}
