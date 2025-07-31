import React from 'react';
import Container from '../Global/Container';
import TopTitle from '../Global/TopTitle';
import Link from 'next/link';
import { Button } from '../ui/button';
import { courses } from '@/data';
import CourseCard from '../Global/CourseCard';
import Title from '../Global/Title';

export default function C_SuggestedCourses() {
    return (
        <Container className="pb-20">
            <div className='flex flex-col sm:flex-row justify-between items-end pb-4 sm:pb-8 space-y-8 sm:space-y-0'>
                <div className='space-y-2 w-full'>
                    <TopTitle className='justify-center sm:justify-start'>Related Courses</TopTitle>
                    <Title className='text-center sm:text-start'>Courses You May Like</Title>
                </div>
                <Link href={'/courses'}>
                    <Button size={'lg'} variant={'outline'} className='px-10 border-primary text-primary'>See All</Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {
                    courses.slice(0, 4).map((item, idx) => <CourseCard hideInstructor key={idx} course={item} />)
                }
            </div>
        </Container>
    );
}