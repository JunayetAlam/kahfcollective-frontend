import { Instructor } from "@/types";
import TopTitle from "./TopTitle";
import Subtitle from "./Subtitle";
import { Play, Star } from "lucide-react";

export default function InstructorCard({ instructor }: { instructor: Instructor }) {
    return (
        <div className="px-4 py-6 rounded-xl bg-white border border-[#E2E4E7] ">
            <div className="text-center space-y-2 pb-8">
                <TopTitle hideLine={true} className="justify-center">{instructor.name}</TopTitle>
                <Subtitle className="text-center">{instructor.role}</Subtitle>
            </div>
            <div className="flex justify-between items-center text-foreground text-sm ">
                <div className="flex gap-1">
                    <Star size={16} className="text-[#F3122C] fill-[#F3122C]" />
                    {instructor.rating}
                </div>
                <div className="flex items-center gap-1">
                    <Play size={16} /> {instructor.courses} Courses
                </div>
            </div>
        </div>
    );
}