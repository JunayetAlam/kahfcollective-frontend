'use client'
import React from 'react';
import GlobalHero from '../Global/GlobalHero';
import Title from '../Global/Title';
import Subtitle from '../Global/Subtitle';
import StudyCircleFeed from './StudyCircleFeed';
import { useGetSingleForumQuery } from '@/redux/api/forumApi';
import { Card, CardContent } from '../ui/card';
import { CalendarDays, Clock4, MapPin} from 'lucide-react';

export default function Feed({ slug }: { slug: string }) {
    const { data, isLoading } = useGetSingleForumQuery(slug);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const circleData = data?.data;

    return (
        <div>
            <GlobalHero>
                <Title className='text-center pb-6 max-w-3xl mx-auto'>
                    {circleData?.title}
                </Title>
                <Subtitle className='text-center pb-6 max-w-lg mx-auto text-[#C4D0B9]'>
                    {circleData?.description}
                </Subtitle>
            </GlobalHero>
            <StudyCircleFeed />

            {/* Events Section - Only show for LOCATION_BASED forums */}
            {circleData?.forumType === 'LOCATION_BASED' && circleData?.events && circleData.events.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
                        <p className="text-gray-600">Join us for these exciting upcoming events</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {circleData.events.map((event, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {/* Event Header */}
                                        <div className="border-b border-gray-100 pb-3">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {event.eventName}
                                            </h3>
                                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                Event {index + 1}
                                            </span>
                                        </div>

                                        {/* Event Details */}
                                        <div className="space-y-3">
                                            {/* Location */}
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <MapPin size={16} className="text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Location</p>
                                                    <p className="text-sm text-gray-600">{event.location}</p>
                                                </div>
                                            </div>

                                            {/* Date */}
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <CalendarDays size={16} className="text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Date</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(event.date || '').toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Time */}
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Clock4 size={16} className="text-gray-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Time</p>
                                                    <p className="text-sm text-gray-600">{event.time}</p>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}


        </div>
    );
}