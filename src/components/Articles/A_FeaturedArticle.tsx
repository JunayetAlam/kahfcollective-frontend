import React from 'react';
import Container from '../Global/Container';
import Title from '../Global/Title';
import Subtitle from '../Global/Subtitle';
import TopTitle from '../Global/TopTitle';
import Image from 'next/image';
import articleImg from '@/assets/articles.jpg'
import { Calendar } from 'lucide-react';
import Link from 'next/link';
export default function A_FeaturedArticle() {
    return (
        <Container className='py-20'>
            <div className="grid lg:grid-cols-2 gap-12 items-start relative">
                <div className="pr-10">
                    <div className="w-full aspect-square relative flex justify-center items-center">
                        <Image
                            src={articleImg}
                            alt="image"
                            fill
                            placeholder="blur"
                            className="object-cover rounded-2xl "
                        />
                        <div style={{ boxShadow: "8px 10px 28px 0px #0000000F" }} className=" px-3 bg-white absolute -bottom-10 w-max py-6 rounded-2xl -right-10 flex justify-center items-center flex-col">
                            <Subtitle className="text-xs md:text-sm max-w-[100px] text-center font-medium">Dr. Amina Hassan</Subtitle>
                        </div>
                    </div>
                </div>
                {/* Left Column - Introduction */}
                <div className="space-y-6 my-auto">
                    <div className="space-y-6">
                        <TopTitle>Featured Article</TopTitle>
                        <Title>The Spiritual Significance of Ramadan: Beyond Fasting</Title>
                        <Subtitle>Exploring the deeper spiritual dimensions of Ramadan and how it transforms the Muslim soul through self-discipline, empathy, and spiritual purification.</Subtitle>
                        <div className='flex justify-between items-center'>

                            <div className='flex gap-2 items-center text-sm'>
                                <Calendar className='text-secondary' size={18} />
                                1/15/2024
                            </div>
                            <Link className='text-primary underline' href={'/details'} >Read Article</Link>
                        </div>
                    </div>

                </div>
            </div>

        </Container>
    );
}