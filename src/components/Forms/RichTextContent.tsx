import { cn } from "@/lib/utils";

type RichTextContentProps = {
  html: string;
  size?: "default" | "sm";
  className?: string;
};

const sizeClasses = {
  default: "",
  sm: "prose-sm",
} as const;

export default function RichTextContent({
  html,
  size = "default",
  className,
}: RichTextContentProps) {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none text-foreground [&_img]:max-w-full [&_table]:overflow-x-auto",
        sizeClasses[size],
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
