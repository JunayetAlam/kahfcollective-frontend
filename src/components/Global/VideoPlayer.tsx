'use client'
import React from 'react';
import ReactPlayer from 'react-player';
import { CourseContents } from '@/types';

interface VideoPlayerProps {
  contents: CourseContents;
}

export default function VideoPlayer({ contents }: VideoPlayerProps) {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
      <ReactPlayer
        src={contents.videoUrl as string}
        width="100%"
        height="100%"
        controls
        playing={false}
      />
    </div>
  );
}
