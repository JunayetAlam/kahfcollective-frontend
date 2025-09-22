'use client'
import React from 'react';
import Container from '../Global/Container';
import Title from '../Global/Title';
import Subtitle from '../Global/Subtitle';
import TopTitle from '../Global/TopTitle';
import { Button } from '../ui/button';
import Image from 'next/image';
import mosqueImg from '@/assets/mosque.jpg'
import { Calendar, PlayCircle } from 'lucide-react';
import { TQueryParam } from '@/types';
import { useGetAllContentsQuery } from '@/redux/api/contentApi';
import MediaPlayer from './MediaPlayer';
export default function S_SermonsOfWeek() {
  const args: TQueryParam[] = [
    { name: "contentType", value: "SERMONS" },
    { name: 'isFeatured', value: true },
  ]

  const { data, isLoading } = useGetAllContentsQuery(args);
  if (isLoading) {
    return ''
  }
  if (!data?.data[0]) {
    return ''
  }
  const sermon = data?.data[0]
  return (
    <Container className='py-20'>
      <div className="grid lg:grid-cols-2 gap-12 items-start relative">
        <div className="pr-10">
          <div className="w-full aspect-square relative flex justify-center items-center">
            <MediaPlayer sermon={sermon} trigger={<Button size={'lg'} className='md:!px-8 md:h-11  relative z-10 bg-white/35 text-foreground backdrop-blur-xs border border-white'>
              Play <PlayCircle />
            </Button>} />
            <Image
              src={mosqueImg}
              alt="image"
              fill
              placeholder="blur"
              className="object-cover rounded-2xl "
            />
            <div style={{ boxShadow: "8px 10px 28px 0px #0000000F" }} className=" px-3 bg-white absolute -bottom-10 w-max py-6 rounded-2xl -right-10 flex justify-center items-center flex-col">
              <Subtitle className="text-xs md:text-sm max-w-[100px] text-center font-medium">{sermon.author.fullName}</Subtitle>
            </div>
          </div>
        </div>
        {/* Left Column - Introduction */}
        <div className="space-y-6 my-auto">
          <div className="space-y-6">
            <TopTitle>Sermon of the Week</TopTitle>
            <Title>{sermon.title}</Title>
            <Subtitle>{sermon.description}</Subtitle>
            <div className='flex justify-between items-center'>
              <MediaPlayer sermon={sermon} trigger={  <Button size={"lg"}>Listen Now</Button>} />
            
              <div className='flex gap-2 items-center text-sm'>
                <Calendar className='text-secondary' size={18} />
                {new Date(sermon.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

        </div>
      </div>

    </Container>
  );
}