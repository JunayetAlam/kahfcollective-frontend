import GlobalHero from '@/components/Global/GlobalHero';
import Subtitle from '@/components/Global/Subtitle';
import Title from '@/components/Global/Title';
import S_SermonsOfWeek from '@/components/Sermons/S_SermonsOfWeek';
import Sermons from '@/components/Sermons/Sermons';
import React from 'react';

export default function page() {
    return (
        <div>
            <GlobalHero>
                <Title className='text-center pb-6 max-w-3xl mx-auto'>Islamic Sermons</Title>
                <Subtitle className='text-center pb-6 max-w-lg mx-auto text-[#C4D0B9]'>Listen to inspiring Islamic sermons from qualified scholars. Deepen your faith and understanding through authentic teachings rooted in Quran and Sunnah.</Subtitle>
            </GlobalHero>
            <S_SermonsOfWeek />
            <Sermons />
        </div>
    );
}