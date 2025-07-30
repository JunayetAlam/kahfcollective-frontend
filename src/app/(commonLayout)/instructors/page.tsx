import GlobalHero from '@/components/Global/GlobalHero';
import Title from '@/components/Global/Title';
import I_Instructors from '@/components/Instructors/I_Instructors';
import I_JoinTeam from '@/components/Instructors/I_JoinTeam';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import React from 'react';

export default function page() {
    return (
        <div>
            <GlobalHero>
                <Title className='text-center pb-6 max-w-2xl mx-auto'>Empower Your Islamic Journey with World-Class Scholars</Title>
                <div className='text-center'>
                    <Button size={'lg'}>Find Course <ChevronRight size={20} /></Button>
                </div>
            </GlobalHero>
            <I_Instructors />
            <I_JoinTeam />
        </div>
    );
}