import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { Calendar, PlayCircle, Volume2, Video, Clock, User } from 'lucide-react';
import sermonImg from '@/assets/sermon.jpg';
import TopTitle from '../Global/TopTitle';
import Subtitle from '../Global/Subtitle';
import { NormalContent } from '@/types/normal-content.type';

interface SermonCardProps {
    sermon: NormalContent;
}

export default function SermonCard({ sermon }: SermonCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const MediaPlayer = () => {
        if (!sermon.fileLink) return null;
        console.log(sermon.fileLink)
        return (
            <div className="w-full bg-black rounded-lg overflow-hidden">
                {isVideo ? (
                    <video
                        controls
                        className="w-full h-auto max-h-[70vh]"
                        src={sermon.fileLink}
                        preload="metadata"
                    >
                        <source src={sermon.fileLink} />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800">
                        <div className="text-center text-white mb-6">
                            <Volume2 className="w-16 h-16 mx-auto mb-4 opacity-80" />
                            <h3 className="text-lg font-medium">{sermon.title}</h3>
                            <p className="text-gray-300 text-sm mt-2">Audio Sermon</p>
                        </div>
                        <audio
                            controls
                            className="w-full"
                            src={sermon.fileLink}
                            preload="metadata"
                        >
                            <source src={sermon.fileLink} />
                            Your browser does not support the audio tag.
                        </audio>
                    </div>
                )}
            </div>
        );
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
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <PlayCircle className="w-5 h-5 mr-2" />
                                {isVideo ? 'Watch Now' : 'Listen Now'}
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-4xl w-[95vw] p-0 bg-white border-0 shadow-2xl">
                            <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                                <DialogTitle className="text-xl font-bold text-gray-900 text-left">
                                    {sermon.title}
                                </DialogTitle>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                    {sermon.author?.fullName && (
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-1" />
                                            <span>{sermon.author.fullName}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        <span>{formatDate(sermon.createdAt)}</span>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="p-6">
                                <MediaPlayer />
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </>
    );
}