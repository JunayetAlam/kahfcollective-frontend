'use client'

import Container from '../Global/Container';


import Image from 'next/image';
import React, { useState } from 'react';
import { BookOpen, BookText, Brain, CirclePlay, FileSpreadsheet, Globe, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import Title from '../Global/Title';
import Subtitle from '../Global/Subtitle';
import { FaBookmark } from 'react-icons/fa';
import TopTitle from '../Global/TopTitle';
import Link from 'next/link';
import { useGetCourseByIdQuery } from '@/redux/api/courseApi';
import courseImg from "@/assets/articles.jpg"
import Loading from '../Global/Loading';
import { TiDocument } from 'react-icons/ti';


export default function CourseDetails({ slug }: { slug: string }) {
    const [activeTab, setActiveTab] = useState("overview")
    const { data, isLoading } = useGetCourseByIdQuery(slug)
    if (isLoading) {
        return <Loading />
    }
    const courseDetails = data?.data
    return (
        <Container className='py-20'>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6 p-4 border border-[#F0F2F5] rounded-4xl">
                    {/* Course Image */}
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image src={courseImg} alt="Islamic Faith Course" fill className="object-cover" />
                        {/* <button className='absolute z-1o top-5 right-5 size-10 rounded-full bg-black/30 border border-white flex justify-center items-center text-white'>
                            <Heart size={24} />
                        </button> */}
                    </div>

                    {/* Course Info */}
                    <div className="space-y-4 ">

                        <Title>{courseDetails?.title}</Title>

                        <Subtitle>{courseDetails?.instructor?.fullName}</Subtitle>


                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 bg-[#FAFAFA] p-3 rounded-md border border-[#F0F2F5]">
                            <Button
                                variant={activeTab === 'overview' ? 'default' : 'outline'}
                                onClick={() => setActiveTab("overview")}
                            >
                                <FaBookmark />
                                Overview
                            </Button>
                            <Button
                                variant={activeTab === 'curriculum' ? 'default' : 'outline'}
                                onClick={() => setActiveTab("curriculum")}
                            >
                                <BookText />
                                Curriculum
                            </Button>
                        </div>
                    </div>

                    {activeTab === "overview" && (
                        <>
                            {/* Description */}
                            <div className='px-4'>
                                <TopTitle hideLine className="pb-4">Description</TopTitle>
                                <div className="space-y-6 text-gray-700 leading-relaxed">
                                    <Subtitle>
                                        {courseDetails?.description}
                                    </Subtitle>
                                </div>
                            </div>


                        </>
                    )}

                    {activeTab === "curriculum" && (
                        <div className="mt-4 space-y-6 px-4">
                            {courseDetails?.courseContents.map((topic, index) => (
                                <div key={index} className='flex items-center gap-2'>
                                    {topic.type === 'QUIZ' && <Brain />}
                                    {topic.type === 'PDF' && <FileSpreadsheet />}
                                    {topic.type === 'VIDEO' && <CirclePlay />}
                                    <Subtitle>{topic.title}</Subtitle>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card style={{ boxShadow: '4px 5px 11px 0px rgba(0, 0, 0, 0.05)' }} className="sticky top-24 pt-0 shadow-none border-none">
                        <CardContent className="p-3">


                            {/* Course Details */}
                            <div className="p-6 space-y-4">
                                <h3 className="font-bold text-gray-900 mb-4">This Course Includes:</h3>

                                <div className="space-y-3">
                                    <div className="flex gap-1.5">
                                        <User className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div className='flex gap-1'>
                                            <p className="text-sm font-medium text-gray-900">Instructor:</p>
                                            <p className="text-sm text-gray-600">{courseDetails?.instructor.fullName}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-1.5">
                                        <BookOpen className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div className='flex gap-1'>
                                            <p className="text-sm font-medium text-gray-900">Lessons:</p>
                                            <p className="text-sm text-gray-600">{courseDetails?.courseContents?.length}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-1.5">
                                        <Globe className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div className='flex gap-1'>
                                            <p className="text-sm font-medium text-gray-900">Language:</p>
                                            <p className="text-sm text-gray-600">{courseDetails?.language}</p>
                                        </div>
                                    </div>



                                </div>

                            </div>
                            <Link href={`${courseDetails?.id}/lessons`}>
                                <Button className='w-full'>See Contents</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Container>
    );
}