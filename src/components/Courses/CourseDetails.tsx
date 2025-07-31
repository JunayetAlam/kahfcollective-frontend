'use client'

import { courses } from '@/data';
import Container from '../Global/Container';


import Image from 'next/image';
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { BookOpen, BookText, CirclePlay, Clock,  Globe, Heart,  User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import Title from '../Global/Title';
import Subtitle from '../Global/Subtitle';
import Rating from '../Global/Rating';
import { FaBookmark } from 'react-icons/fa';
import TopTitle from '../Global/TopTitle';

const topics = [
    {
        title: "Introduction to Islamic Creed",
        lessons: [
            "What is Aqeedah and its importance",
            "Sources of Islamic belief",
            "The role of reason and revelation",
        ],
    },
    {
        title: "Belief in Allah (Tawheed)",
        lessons: [
            "What is Aqeedah and its importance",
            "Sources of Islamic belief",
            "The role of reason and revelation",
        ],
    },
    {
        title: "Belief in Angels",
        lessons: [
            "What is Aqeedah and its importance",
            "Sources of Islamic belief",
            "The role of reason and revelation",
        ],
    },
];

export default function CourseDetails({ slug }: { slug: string }) {
    const [activeTab, setActiveTab] = useState("overview")
    const courseDetails = courses.find(item => item.id === slug)
    return (
        <Container className='py-20'>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6 p-4 border border-[#F0F2F5] rounded-4xl">
                    {/* Course Image */}
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image src={courseDetails?.image || ''} alt="Islamic Faith Course" fill className="object-cover" />
                        <button className='absolute z-1o top-5 right-5 size-10 rounded-full bg-black/30 border border-white flex justify-center items-center text-white'>
                            <Heart size={24} />
                        </button>
                    </div>

                    {/* Course Info */}
                    <div className="space-y-4 ">
                        <Badge variant="customOutline">
                            Aqeedah
                        </Badge>

                        <Title>{courseDetails?.title}</Title>

                        <Subtitle>{courseDetails?.instructor}</Subtitle>

                        <Rating rating={courseDetails?.rating || 0} />

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
                                        Sheikh Yusuf Al-Qaradawi is a highly accomplished Islamic scholar and Fiqh specialist, recognized for his
                                        deep understanding of Islamic jurisprudence and his ability to make complex Islamic concepts accessible to
                                        modern Muslims. With over 25 years of teaching experience, Sheikh Yusuf has guided thousands of students
                                        in their Islamic studies journey.
                                        <br /> <br />
                                        Sheikh Yusuf is deeply passionate about bridging classical Islamic scholarship with contemporary
                                        understanding. His approach involves meticulous attention to authentic sources, from the Quran and Sunnah
                                        to the works of classical scholars, ensuring that his teachings are both spiritually enriching and
                                        academically rigorous.
                                        <br /> <br />
                                        Beyond his scholarly expertise, he has a talent for building strong connections with his students and
                                        creating an environment that encourages questions and deep reflection. His courses consistently receive
                                        outstanding reviews from students worldwide.
                                        <br /> <br />
                                        As a mentor, Sheikh Yusuf is committed to empowering others in their Islamic knowledge journey. He
                                        provides personalized guidance, practical insights, and hands-on strategies to help aspiring Islamic
                                        students deepen their understanding and strengthen their faith. Whether you&apos;re beginning your Islamic
                                        studies or seeking to advance your knowledge, Sheikh Yusuf&apos;s expertise and dedication make him the ideal
                                        guide for your journey.
                                    </Subtitle>
                                </div>
                            </div>

                            {/* Certifications */}
                            <div>
                                <TopTitle hideLine className="pb-4">Certifications</TopTitle>
                                <div className="text-gray-700 leading-relaxed">
                                    <Subtitle>  Upon successful completion, you&rsquo;ll receive a recognized Islamic studies certificate that validates
                                        your knowledge and commitment to understanding Islamic principles. This certification not only
                                        strengthens your personal understanding but creates prospects. Whether you&#39;re pursuing a teaching
                                        position or seeking to enhance your Islamic knowledge, this certificate serves as a valuable
                                        credential in Islamic studies and ethics.</Subtitle>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "curriculum" && (
                        <div className="mt-4 space-y-6 px-4">
                            {topics.map((topic, index) => (
                                <div key={index}>
                                    <TopTitle hideLine className='pb-2'>{topic.title}</TopTitle>
                                    <div className="mt-1 space-y-2">
                                        {topic.lessons.map((lesson, i) => (
                                            <div key={i} className='flex gap-2 '>
                                                <CirclePlay />
                                                <Subtitle>{lesson}</Subtitle></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <Card style={{ boxShadow: '4px 5px 11px 0px rgba(0, 0, 0, 0.05)' }} className="sticky top-24 pt-0 shadow-none border-none">
                        <CardContent className="p-3">
                            {/* Price Section */}
                            <div className="bg-secondary text-white p-6 rounded-xl">
                                <div className="space-y-3">
                                    <Subtitle>Course Fee</Subtitle>
                                    <Title className='text-background'>$56.00</Title>
                                    <Button size={'lg'} className='w-full'>Enroll Now</Button>
                                </div>
                            </div>

                            {/* Course Details */}
                            <div className="p-6 space-y-4">
                                <h3 className="font-bold text-gray-900 mb-4">This Course Includes:</h3>

                                <div className="space-y-3">
                                    <div className="flex gap-1.5">
                                        <User className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div className='flex gap-1'>
                                            <p className="text-sm font-medium text-gray-900">Instructor:</p>
                                            <p className="text-sm text-gray-600">{courseDetails?.instructor}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-1.5">
                                        <BookOpen className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div className='flex gap-1'>
                                            <p className="text-sm font-medium text-gray-900">Lessons:</p>
                                            <p className="text-sm text-gray-600">{courseDetails?.lessons}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-1.5">
                                        <Globe className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div className='flex gap-1'>
                                            <p className="text-sm font-medium text-gray-900">Language:</p>
                                            <p className="text-sm text-gray-600">English</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-1.5">
                                        <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <div className='flex gap-1'>
                                            <p className="text-sm font-medium text-gray-900">Duration:</p>
                                            <p className="text-sm text-gray-600">8h</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Container>
    );
}