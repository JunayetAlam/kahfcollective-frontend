import { ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { CourseCardType } from "@/types"
import { blurPlaceHolder } from "@/lib/utils"
import Rating from "./Rating"

export default function CourseCard({ course }: { course: CourseCardType }) {
    console.log(course.image);

    return (
        <Card className="w-full bg-white shadow-lg rounded-2xl overflow-hidden pt-0 pb-0 mx">
            <div className="relative w-full aspect-[3/2]">
                <Image
                    src={course.image}
                    alt="Islamic mosque illustration with teacher"
                    fill
                    placeholder="blur"
                    blurDataURL={blurPlaceHolder}
                    className="object-cover"
                />
            </div>

            <CardContent className=" space-y-2">
                {/* Rating */}
                <Rating rating={course.rating} />
                

                {/* Course Title */}
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">{course.title}</h3>

                {/* Instructor */}
                <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={course.instructorProfile} />
                        <AvatarFallback className="text-xs bg-gray-200">SY</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{course.instructor}</span>
                </div>

                {/* Lesson Count */}
                <div className="flex items-center gap-1 text-foreground">
                    <ClipboardList className="w-4 h-4 " />
                    <span className="text-sm ">Lesson ({course.lessons})</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 !pt-3 border-t-[#E2E4E7] border-t mt-auto">
                <Button className="w-full rounded-lg md:rounded-xl md:h-11">
                    Enroll Now
                </Button>
            </CardFooter>
        </Card>
    )
}
