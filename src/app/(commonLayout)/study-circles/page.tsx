import GlobalHero from '@/components/Global/GlobalHero';
import Subtitle from '@/components/Global/Subtitle';
import Title from '@/components/Global/Title';
import SC_StudyTutorial from '@/components/StudyCircles/SC_StudyTutorial';
import StudyCircles from '@/components/StudyCircles/StudyCircles';
import React from 'react';

export default function page() {
    return (
        <div>
            <GlobalHero>
                <Title className='text-center pb-6 max-w-3xl mx-auto'>Study Circles</Title>
                <Subtitle className='text-center pb-6 max-w-lg mx-auto text-[#C4D0B9]'>Join small group learning sessions with qualified Islamic scholars. Engage in deep discussions, ask questions, and build lasting connections with fellow learners.</Subtitle>
            </GlobalHero>
            <StudyCircles />
            <SC_StudyTutorial />
        </div>
    );
}