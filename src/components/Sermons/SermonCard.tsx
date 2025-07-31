import { Sermon } from '@/types';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Image from 'next/image';
import { Calendar, PlayCircle } from 'lucide-react';
import { Button } from '../ui/button';
import sermonImg from '@/assets/sermon.jpg'
import TopTitle from '../Global/TopTitle';
import Subtitle from '../Global/Subtitle';
export default function SermonCard({ sermon }: { sermon: Sermon }) {
    return (
        <Card className="w-full rounded-xl overflow-hidden bg-white p-0 gap-y-0 shadow-none border border-gray-200 max-w-[450px] sm:max-w-full mx-auto">
            <CardHeader className="p-0 ">
                <div className="relative w-full aspect-[7/4] flex items-center justify-center">
                    <Image
                        src={sermonImg}
                        alt="Sermon Illustration"
                        placeholder='blur'
                        width={200}
                        height={150}
                        className="object-cover"
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <TopTitle hideLine className='text-center justify-center line-clamp-2' >{sermon.title}</TopTitle>
                <Subtitle className='text-center line-clamp-3'>{sermon.description}</Subtitle>
                <div className="flex items-center text-sm text-gray-500 border-t border-gray-200 pt-3">

                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{sermon.date}</span>
                </div>
                <p className='text-sm'>By <span className='font-semibold'>{sermon.speaker}</span></p>

            </CardContent>
            <CardFooter className="p-6 pt-3 mt-auto">
                <Button variant={'secondary'} size={'lg'} className='w-full' >
                    Listen Now <PlayCircle className="w-5 h-5 ml-2" />
                </Button>
            </CardFooter>
        </Card>
    );
}