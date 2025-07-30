import C_SuggestedCourses from '@/components/Courses/C_SuggestedCourses';
import CourseDetails from '@/components/Courses/CourseDetails';
import GlobalHero from '@/components/Global/GlobalHero';
import Subtitle from '@/components/Global/Subtitle';
import Title from '@/components/Global/Title';
import { Badge } from '@/components/ui/badge';
import React from 'react';

export default async function page({ params }: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    console.log(slug)

    return (
        <div className='bg-[#FFFFFF]'>
            <GlobalHero>
                <div className='flex justify-center items-center pb-5'>
                    <Badge variant={'custom'} className='' >Courses Details</Badge>
                </div>
                <Title className='text-center pb-6 max-w-3xl mx-auto'>Find the Course That Matches Your Goals and Interests</Title>
                <Subtitle className='text-center pb-6 max-w-lg mx-auto text-[#C4D0B9]'>Gain essential skills with expert-led courses in web development, design, and more. Learn at your own pace, anytime.</Subtitle>

            </GlobalHero>
            <CourseDetails slug={slug} />
            <C_SuggestedCourses />
        </div>
    );
}