'use client'
import React from 'react';
import Container from '../Global/Container';
import Title from '../Global/Title';
import Subtitle from '../Global/Subtitle';
import TopTitle from '../Global/TopTitle';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { TQueryParam } from '@/types';
import { useGetAllContentsQuery } from '@/redux/api/contentApi';
import ViewArticle from './ViewArticles';
export default function A_FeaturedArticle() {
    const args: TQueryParam[] = [
        { name: "contentType", value: "ARTICLE" },
        { name: 'isFeatured', value: true },
    ]

    const { data, isLoading } = useGetAllContentsQuery(args);
    if (isLoading) {
        return ''
    }
    console.log(data)
    if (!data?.data[0]) {
        return ''
    }
    const article = data?.data[0];
    console.log(article)
    return (
        <Container className='py-20'>
            <div className="grid lg:grid-cols-2 gap-12 items-start relative">
                <div className="pr-10">
                    <div className="w-full aspect-square relative flex justify-center items-center">
                        <Image
                            src={article.coverImage}
                            alt="image"
                            fill
                            className="object-cover rounded-2xl "
                        />
                        <div style={{ boxShadow: "8px 10px 28px 0px #0000000F" }} className=" px-3 bg-white absolute -bottom-10 w-max py-6 rounded-2xl -right-10 flex justify-center items-center flex-col">
                            <Subtitle className="text-xs md:text-sm max-w-[100px] text-center font-medium">{article.author.fullName}</Subtitle>
                        </div>
                    </div>
                </div>
                {/* Left Column - Introduction */}
                <div className="space-y-6 my-auto">
                    <div className="space-y-6">
                        <TopTitle>Featured Article</TopTitle>
                        <Title>{article.title}</Title>
                        <Subtitle>{article.description}</Subtitle>
                        <div className='flex justify-between items-center'>

                            <div className='flex gap-2 items-center text-sm'>
                                <Calendar className='text-secondary' size={18} />
                                 {new Date(article.createdAt).toLocaleDateString()}
                            </div>
                            <ViewArticle
                            article={article}
                            trigger={ <div className='text-primary underline cursor-pointer' >Read Article</div>}
                            />
                        </div>
                    </div>

                </div>
            </div>

        </Container>
    );
}