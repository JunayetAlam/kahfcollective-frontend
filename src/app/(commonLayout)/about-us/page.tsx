import GlobalHero from '@/components/Global/GlobalHero';
import Title from '@/components/Global/Title';
import Instructor from '@/components/Global/Instructor';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import AU_About from '@/components/AboutUs/AU_About';

export default function page() {
  return (
    <div>
      <GlobalHero>
        <Title className='text-center pb-6 max-w-3xl mx-auto'>Develop Islamic Knowledge and Unlock Your Spiritual Potential</Title>
        <div className='text-center'>
          <Button size={'lg'}>Find Course <ChevronRight size={20} /></Button>
        </div>
      </GlobalHero>
      <AU_About/>
      <Instructor/>
    </div>
  );
}