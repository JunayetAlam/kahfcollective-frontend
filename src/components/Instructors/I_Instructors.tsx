import React from 'react';
import Container from '../Global/Container';
import TopTitle from '../Global/TopTitle';
import Title from '../Global/Title';
import { instructors } from '@/data';
import InstructorCard from '../Global/InstructorCard';

export default function I_Instructors() {
    return (
        <Container className="py-20">
            <div className="text-center pb-8">
                <TopTitle className="justify-center">Expert Instructors Ready</TopTitle>
                <Title>Meet Our World-Class Islamic Scholars</Title>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-5 gap-x-10'>
                {
                    instructors.map(item => <InstructorCard key={item.id} instructor={item} />)
                }
            </div>
        </Container>
    );
}