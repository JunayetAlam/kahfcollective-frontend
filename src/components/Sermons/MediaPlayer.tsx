import { NormalContent } from '@/types/normal-content.type';
import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Calendar, PlayCircle, User, Volume2 } from 'lucide-react';
export default function MediaPlayer({ sermon, trigger }: { sermon: NormalContent, trigger?: ReactNode }) {
    if (!sermon.fileLink) return null;
    console.log(sermon.fileLink)
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
        <Dialog >
            <DialogTrigger asChild>
                {trigger || <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    {isVideo ? 'Watch Now' : 'Listen Now'}
                </Button>}

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
            </DialogContent>
        </Dialog>
    );
}