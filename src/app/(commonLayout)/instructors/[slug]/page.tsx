import GlobalHero from '@/components/Global/GlobalHero';
import Subtitle from '@/components/Global/Subtitle';
import Title from '@/components/Global/Title';
import I_InstructorCourses from '@/components/Instructors/I_InstructorCourses';
import I_InstructorDetails from '@/components/Instructors/I_InstructorDetails';
import { instructors } from '@/data';
import { Play, Users } from 'lucide-react';
import React from 'react';

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const instructorData = instructors.find(item => item.id === slug);

    return (
        <div>
            <GlobalHero>
                <div className="bg-[#C4D0B9] rounded-full px-10 md:px-20  py-6 w-full max-w-md mx-auto">
                    <div className="space-y-4">
                        <Title className='text-foreground'>{instructorData?.name}</Title>

                        <Subtitle>{instructorData?.role}</Subtitle>
                        <div className="flex gap-8 pt-2">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-700" />
                                <span className="text-gray-700 text-sm font-medium">{instructorData?.students} Students</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Play className="w-4 h-4 text-gray-700" />
                                <span className="text-gray-700 text-sm font-medium">{instructorData?.courses} Courses</span>
                            </div>
                        </div>
                    </div>
                </div>
            </GlobalHero>
            <I_InstructorDetails />
            <I_InstructorCourses />
        </div>
    );
}