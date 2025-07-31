import { TStudyCircle } from '@/types';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Image from 'next/image';
import Subtitle from '../Global/Subtitle';
import { GraduationCap } from 'lucide-react';
import { Button } from '../ui/button';
import image from '@/assets/mosque.jpg'
import Link from 'next/link';
export default function StudyCircleCard({ studyCircle }: { studyCircle: TStudyCircle }) {
    return (
        <Card className="w-full rounded-xl overflow-hidden bg-white p-0 gap-y-0 shadow-none border border-gray-200 max-w-[450px] sm:max-w-full mx-auto">
            <CardHeader className="p-0 ">
                <Link href={`/study-circles/feed/${studyCircle.id}`} >
                    <div className="relative w-full aspect-video flex items-center justify-center">
                        <Image
                            src={image}
                            alt="Sermon Illustration"
                            placeholder='blur'
                            fill
                            className="object-cover"
                        />
                    </div>
                </Link>
            </CardHeader>
            <CardContent className="gap-y-3 flex flex-col px-2 pt-2 pb-3">
                <Link href={`/study-circles/feed/${studyCircle.id}`} >
                    <h1 className='text-lg md:text-xl font-semibold line-clamp-1'>
                        {studyCircle.title}
                    </h1>
                </Link>
                <Link href={`/study-circles/feed/${studyCircle.id}`} >
                    <Subtitle className='line-clamp-3 '>{studyCircle.description}</Subtitle>
                </Link>
                <h1 className='text-base md:text-lg font-semibold line-clamp-1'>
                    {studyCircle.instructor}
                </h1>

                <div className="flex items-center text-sm text-gray-500 line-clamp-1">

                    <GraduationCap className="w-5 h-5 mr-2" />
                    <span className='line-clamp-1'>{studyCircle.subject}</span>
                </div>

            </CardContent>
            <CardFooter className="p-6 !pt-3 mt-auto  border-t border-gray-200">
                <Link className='w-full' href={`/study-circles/feed/${studyCircle.id}`} >
                    <Button variant={'secondary'} size={'lg'} className='w-full' >
                        Join Circle
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}