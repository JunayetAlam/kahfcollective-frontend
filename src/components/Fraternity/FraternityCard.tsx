import { Forum} from '@/types';
import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import Subtitle from '../Global/Subtitle';
import { Button } from '../ui/button';
import Link from 'next/link';
import { PiUsersThreeThin } from "react-icons/pi";
import { CiLocationOn } from "react-icons/ci";
import { CalendarDays, Clock4 } from 'lucide-react';

export default function FraternityCard({ fraternity }: { fraternity: Forum }) {


    return (
        <Card className="w-full max-w-[450px] sm:max-w-full mx-auto rounded-xl overflow-hidden bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 group py-0 gap-0">
            <CardContent className="p-6 pb-4 space-y-4">
                {/* Title */}
                <Link href={`/feed/${fraternity.id}`} className="block group-hover:text-blue-600 transition-colors duration-200">
                    <h1 className="text-xl font-semibold line-clamp-2 text-gray-900 leading-tight">
                        {fraternity.title}
                    </h1>
                </Link>

                {/* Description */}
                <Link href={`/feed/${fraternity.id}`} className="block">
                    <Subtitle className="line-clamp-3 text-gray-600 leading-relaxed">
                        {fraternity.description}
                    </Subtitle>
                </Link>

                {/* Events Grid */}
                {fraternity.events && fraternity.events.length > 0 && (
                    <div className="pt-2">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Upcoming Events</h3>
                        <div className="space-y-4">
                            {fraternity.events.map((event, eventIndex) => (
                                <div key={eventIndex} className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-800">
                                        Event {eventIndex + 1}
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-3 border-l-2 border-gray-200">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5 hover:bg-gray-100 transition-colors duration-150">
                                            <div className="flex-shrink-0 text-gray-500">
                                                <PiUsersThreeThin size={16} />
                                            </div>
                                            <span className="truncate font-medium">
                                                {event.eventName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5 hover:bg-gray-100 transition-colors duration-150">
                                            <div className="flex-shrink-0 text-gray-500">
                                                <CiLocationOn size={16} />
                                            </div>
                                            <span className="truncate font-medium">
                                                {event.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5 hover:bg-gray-100 transition-colors duration-150">
                                            <div className="flex-shrink-0 text-gray-500">
                                                <CalendarDays size={16} />
                                            </div>
                                            <span className="truncate font-medium">
                                                {new Date(event.date || '').toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5 hover:bg-gray-100 transition-colors duration-150">
                                            <div className="flex-shrink-0 text-gray-500">
                                                <Clock4 size={16} />
                                            </div>
                                            <span className="truncate font-medium">
                                                {event.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Events State */}
                {(!fraternity.events || fraternity.events.length === 0) && (
                    <div className="pt-2">
                        <div className="text-center py-4 text-gray-500">
                            <CalendarDays size={32} className="mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">No upcoming events</p>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-6 !pt-0 bg-gray-50/50  mt-auto">
                <Link href={`/feed/${fraternity.id}`} className="w-full">
                    <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full font-medium transition-colors duration-200"
                    >
                        Join Circle
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}