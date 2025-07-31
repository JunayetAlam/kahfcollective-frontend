import FR_Tutorial from '@/components/Fraternity/FR_StudyTutorial';
import Fraternities from '@/components/Fraternity/Fraternities';
import GlobalHero from '@/components/Global/GlobalHero';
import Subtitle from '@/components/Global/Subtitle';
import Title from '@/components/Global/Title';
import React from 'react';

export default function page() {
    return (
        <div>
            <GlobalHero>
                <Title className='text-center pb-6 max-w-3xl mx-auto'>Fraternity</Title>
                <Subtitle className='text-center pb-6 max-w-lg mx-auto text-[#C4D0B9]'>
                    Build meaningful connections with fellow Muslims. Join our community events, mentorship programs, and networking opportunities to strengthen your faith and friendships.
                </Subtitle>
            </GlobalHero>
            <Fraternities />
            <FR_Tutorial />
        </div>
    );
}