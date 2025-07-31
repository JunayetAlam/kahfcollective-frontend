import { TFraternity } from '@/types';
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import Image from 'next/image';
import Subtitle from '../Global/Subtitle';
import { Button } from '../ui/button';
import Link from 'next/link';
import { PiUsersThreeThin } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import { CalendarDays, Clock4 } from 'lucide-react';
export default function FraternityCard({ fraternity }: { fraternity: TFraternity }) {
    const gridData = [
        { text: fraternity.eventName, Icon: PiUsersThreeThin },
        { text: fraternity.location, Icon: CiLocationOn },
        { text: fraternity.date, Icon: CalendarDays },
        { text: fraternity.time, Icon: Clock4 },
    ]
    return (
        <Card className="w-full rounded-xl overflow-hidden bg-white p-0 gap-y-0 shadow-none border border-gray-200 max-w-[450px] sm:max-w-full mx-auto">
            <CardHeader className="p-0 ">
                <Link href={`/study-circles/feed/${fraternity.id}`} >
                    <div className="relative w-full aspect-video flex items-center justify-center">
                        <Image
                            src={fraternity.image}
                            alt="Sermon Illustration"
                            fill
                            className="object-cover"
                        />
                    </div>
                </Link>
            </CardHeader>
            <CardContent className="gap-y-3 flex flex-col px-2 pt-2 pb-3">
                <Link href={`/fraternity/feed/${fraternity.id}`} >
                    <h1 className='text-lg md:text-xl font-semibold line-clamp-1'>
                        {fraternity.title}
                    </h1>
                </Link>
                <Link href={`/fraternity/feed/${fraternity.id}`} >
                    <Subtitle className='line-clamp-3 '>{fraternity.description}</Subtitle>
                </Link>

                <div className='grid grid-cols-2 gap-x-1.5 gap-y-1.5'>
                    {
                        gridData.map((item, idx) => <div key={idx} className='flex gap-1 text-xs'>
                            <p>
                                <item.Icon size={16} />
                            </p>
                            {item.text}
                        </div>)
                    }
                </div>


            </CardContent>
            <CardFooter className="p-6 !pt-3 mt-auto  border-t border-gray-200">
                <Link className='w-full' href={`/fraternity/feed/${fraternity.id}`} >
                    <Button variant={'secondary'} size={'lg'} className='w-full' >
                        Join Circle
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}