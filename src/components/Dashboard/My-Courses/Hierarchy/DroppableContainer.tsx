"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Children } from "react";
import { encodeContainerId, ContainerKind } from "./hierarchyDnD";

export function DroppableContainer({
  kind,
  id,
  className,
  children,
  emptyLabel,
}: {
  kind: ContainerKind;
  id: string;
  className?: string;
  children: React.ReactNode;
  emptyLabel?: string;
}) {
  const containerId = encodeContainerId(kind, id);
  const { setNodeRef, isOver } = useDroppable({ id: containerId });
  const count = Children.count(children);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-10 space-y-2 rounded-md border border-dashed border-transparent p-2 transition-colors",
        isOver && "border-primary/40 bg-primary/5",
        className,
      )}
    >
      {count > 0 ? (
        children
      ) : (
        <p className="text-muted-foreground py-4 text-center text-sm">
          {emptyLabel || "Drop items here"}
        </p>
      )}
    </div>
  );
}
