// CourseModuleList.tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { courseModules } from "@/data";
import ModuleItem from "./ModuleItem";

export default function CourseModuleList() {
  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-semibold">Modules</h2>

      <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
        {courseModules.map((module) => (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="border-none rounded-lg overflow-hidden shadow-sm"
          >
            <AccordionTrigger className="flex items-center justify-between w-full p-4 bg-v0-medium-gray text-gray-800 font-semibold rounded-t-lg hover:no-underline data-[state=open]:rounded-b-none">
              <span className="flex-1 text-left">{module.name}</span>
              <span className="text-sm text-gray-600 mr-2">
                {module.courseCount} Courses
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-2 bg-white rounded-b-lg">
              <div className="space-y-2">
                {module.items.map((item, index) => (
                  <ModuleItem
                    key={index}
                    moduleItem={item}
                    moduleId={module.id}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
