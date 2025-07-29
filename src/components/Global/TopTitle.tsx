import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TitleProps = {
  children: ReactNode;
  className?: string;
  hideLine?: boolean
};

export default function TopTitle({ children, className, hideLine = false }: TitleProps) {
  return (
    <h1 className={cn("font-semibold text-lg md:text-xl lg:text-2xl text-foreground flex items-center gap-2", className)}>
      {!hideLine && <div className="w-12 border-1 h-max border-foreground"></div>}  {children}

    </h1>
  );
}
