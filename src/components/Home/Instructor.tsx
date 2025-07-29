import React from 'react';
import Container from '../Global/Container';
import TopTitle from '../Global/TopTitle';
import Title from '../Global/Title';
import { Button } from '../ui/button';
import { instructors } from '@/data';
import InstructorCard from '../Global/InstructorCard';

export default function Instructor() {
    return (
        <Container className='pb-20'>
            <div className='flex flex-col sm:flex-row justify-between items-end pb-4 sm:pb-8 space-y-8 sm:space-y-0'>
                <div className='space-y-2 w-full'>
                    <TopTitle className='justify-center sm:justify-start'>Expert Instructors Ready</TopTitle>
                    <Title className='text-center sm:text-start'>Meet Our World-Class Instructors</Title>
                </div>
                <Button size={'lg'} variant={'outline'} className='px-10 border-primary text-primary'>See All</Button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-5 gap-x-10'>
                {
                    instructors.map(item => <InstructorCard key={item.id} instructor={item} />)
                }
            </div>
        </Container>
    );
}