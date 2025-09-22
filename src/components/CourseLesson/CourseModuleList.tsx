// CourseModuleList.tsx
import ModuleItem from "./ModuleItem";
import { CourseContents } from "@/types";

export default function CourseModuleList({ courseContents }: { courseContents: CourseContents[] }) {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-semibold">Modules</h2>

      <div className="flex flex-col gap-2">
        {courseContents.map((module) => (
          <ModuleItem
            key={module.id}
            moduleItem={module}
          />
        ))}
      </div>
    </div>
  );
}
