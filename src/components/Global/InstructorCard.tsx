import { Instructor } from "@/types";
import TopTitle from "./TopTitle";
import Subtitle from "./Subtitle";
import { Play } from "lucide-react";
import studentIcon from '@/assets/students.svg'
import Image from "next/image";
import Link from "next/link";
export default function InstructorCard({ instructor }: { instructor: Instructor }) {
    return (
        <Link href={`/instructors/${instructor.id}`}>
            <div className="px-4 py-6 rounded-xl bg-white border border-[#E2E4E7] ">
                <div className="text-center space-y-2 pb-8">
                    <TopTitle hideLine={true} className="justify-center">{instructor.name}</TopTitle>
                    <Subtitle className="text-center">{instructor.role}</Subtitle>
                </div>
                <div className="flex justify-between items-center text-foreground text-sm  border-t border-gray-200 pt-4">
                    <div className="flex gap-1 relative font-medium">
                        <div className="relative w-5 aspect-square">
                            <Image
                                src={studentIcon}
                                fill
                                alt="student"
                            />
                        </div>
                        {instructor.students} Students
                    </div>
                    <div className="flex items-center gap-1 font-semibold">
                        <Play size={16} /> {instructor.courses} Courses
                    </div>
                </div>
            </div>
        </Link>
    );
}