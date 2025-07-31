import GlobalHero from '@/components/Global/GlobalHero';
import Subtitle from '@/components/Global/Subtitle';
import Title from '@/components/Global/Title';
import StudyCircleFeed from '@/components/StudyCircles/StudyCircleFeed';
import { studyCircles } from '@/data';
import React from 'react';

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const circleData = studyCircles.find(item => item.id === slug)
    return (
        <div>
            <GlobalHero>
                <Title className='text-center pb-6 max-w-3xl mx-auto'>{circleData?.title}</Title>
                <Subtitle className='text-center pb-6 max-w-lg mx-auto text-[#C4D0B9]'>{circleData?.description}</Subtitle>

            </GlobalHero>
            <StudyCircleFeed />
        </div>
    );
}