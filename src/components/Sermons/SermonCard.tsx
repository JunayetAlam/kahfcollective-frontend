import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { Calendar, Volume2, Video, User } from 'lucide-react';
import sermonImg from '@/assets/sermon.jpg';
import TopTitle from '../Global/TopTitle';
import Subtitle from '../Global/Subtitle';
import { NormalContent } from '@/types/normal-content.type';
import MediaPlayer from './MediaPlayer';

interface SermonCardProps {
    sermon: NormalContent;
}

export default function SermonCard({ sermon }: SermonCardProps) {

    // Determine if the file is video or audio based on the file extension
    const isVideo = sermon.fileLink &&
        /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(sermon.fileLink);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    return (
        <>
            <Card className="w-full rounded-xl overflow-hidden bg-white p-0 gap-y-0 shadow-none border border-gray-200 max-w-[450px] sm:max-w-full mx-auto">
                <CardHeader className="p-0 relative">
                    <div className="relative w-full aspect-[7/4] overflow-hidden">
                        <Image
                            src={sermonImg}
                            alt={`${sermon.title} sermon illustration`}
                            placeholder="blur"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <Badge
                            variant="secondary"
                            className="absolute top-4 right-4 bg-white/90 text-gray-700 backdrop-blur-sm"
                        >
                            {isVideo ? (
                                <>
                                    <Video className="w-3 h-3 mr-1" />
                                    Video
                                </>
                            ) : (
                                <>
                                    <Volume2 className="w-3 h-3 mr-1" />
                                    Audio
                                </>
                            )}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                        <TopTitle
                            hideLine
                            className="text-left justify-start line-clamp-2 text-xl font-bold text-gray-900 leading-tight"
                        >
                            {sermon.title}
                        </TopTitle>
                        <Subtitle className="text-left line-clamp-3 text-gray-600 leading-relaxed">
                            {sermon.description}
                        </Subtitle>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{formatDate(sermon.createdAt)}</span>
                        </div>

                        {sermon.author?.fullName && (
                            <div className="flex items-center text-sm text-gray-700">
                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="font-medium">{sermon.author.fullName}</span>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                    <MediaPlayer sermon={sermon} />
                </CardFooter>
            </Card>
        </>
    );
}