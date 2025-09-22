import { ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { blurPlaceHolder } from "@/lib/utils"
import Link from "next/link"
import { Course } from "@/types"
import courseImg from "@/assets/articles.jpg"
import { Badge } from "../ui/badge"

export default function CourseCard({ course, hideInstructor = false }: { course: Course, hideInstructor?: boolean }) {
    const isCourseComplete = (course?.completeCourses || [])?.length > 0
    return (
        <Card className="w-full bg-white rounded-2xl overflow-hidden pt-0 pb-0 gap-y-0 shadow-none border border-[#E2E4E7] relative">

            {isCourseComplete && (
                <Badge className="absolute top-3 right-3 bg-green-500 text-white z-20">
                    Completed
                </Badge>
            )}
            <Link href={`/course-details/${course.id}`}>
                <div className="relative w-full aspect-[3/2]">
                    <Image
                        src={courseImg}
                        alt="Islamic mosque illustration with teacher"
                        fill
                        placeholder="blur"
                        blurDataURL={blurPlaceHolder}
                        className="object-cover"
                    />
                </div>
            </Link>
            <CardContent className="flex flex-col gap-2 py-4 h-full">

                <div className="space-y-2">

                    {/* Course Title */}
                    <Link href={`/course-details/${course.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight pb-2">{course.title}</h3>
                    </Link>
                    {/* Instructor */}
                    {
                        !hideInstructor && <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src={course.instructor?.profile || ''} />
                                <AvatarFallback className="text-xs bg-gray-200">SY</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{course.instructor.fullName}</span>
                        </div>
                    }
                </div>

                {/* Lesson Count */}
                <div className="flex items-center gap-1 text-foreground mt-auto">
                    <ClipboardList className="w-4 h-4 " />
                    <span className="text-sm ">Lesson ({course._count?.courseContents})</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 !pt-3 border-t-[#E2E4E7] border-t mt-auto">
                <Link className="w-full" href={`/course-details/${course.id}`}>
                    <Button className="w-full rounded-lg md:rounded-xl md:h-11">
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
