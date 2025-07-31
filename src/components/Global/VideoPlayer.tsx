'use client'
import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface VideoPlayerProps {
  src?: string;
  title?: string;
  poster?: string | null;
}

type PlaybackRate = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

export default function VideoPlayer({
  src = "https://res.cloudinary.com/doc50jlhc/video/upload/v1753962990/A_Flow_of_Consciousness_-_Evanescence_1_lcflmx.mp4",
  title = "Course Video",
  poster = null
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);

  useEffect((): (() => void) => {
    const video: HTMLVideoElement | null = videoRef.current;
    if (!video) return () => { };

    const handleTimeUpdate = (): void => setCurrentTime(video.currentTime);
    const handleDurationChange = (): void => setDuration(video.duration);
    const handleLoadStart = (): void => setIsLoading(true);
    const handleCanPlay = (): void => setIsLoading(false);
    const handlePlay = (): void => setIsPlaying(true);
    const handlePause = (): void => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return (): void => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect((): (() => void) => {
    const handleFullscreenChange = (): void => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return (): void => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect((): (() => void) => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout((): void => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    }
    return (): void => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  const togglePlay = (): void => {
    const video: HTMLVideoElement | null = videoRef.current;
    if (video?.paused) {
      video.play();
    } else {
      video?.pause();
    }
  };

  const handleSeek = (value: number[]): void => {
    const video: HTMLVideoElement | null = videoRef.current;
    if (!video) return;

    const newTime: number = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]): void => {
    const video: HTMLVideoElement | null = videoRef.current;
    if (!video) return;

    const newVolume: number = value[0] / 100;
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = (): void => {
    const video: HTMLVideoElement | null = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = async (): Promise<void> => {
    const container: HTMLDivElement | null = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      await container.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const skip = (seconds: number): void => {
    const video: HTMLVideoElement | null = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  };

  const changePlaybackRate = (rate: PlaybackRate): void => {
    const video: HTMLVideoElement | null = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time: number): string => {
    const hours: number = Math.floor(time / 3600);
    const minutes: number = Math.floor((time % 3600) / 60);
    const seconds: number = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = (): void => {
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = src;
    a.download = title || 'video';
    a.click();
  };

  const progress: number = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`relative group bg-black rounded-lg overflow-hidden shadow-2xl ${isFullscreen ? 'w-screen h-screen' : 'w-full'
        }`}
      onMouseMove={(): void => setShowControls(true)}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
      }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={src}
        poster={poster || undefined}
        preload="metadata"
        onClick={togglePlay}
      >
        Your browser does not support the video tag.
      </video>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Play button overlay */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Button
            variant="ghost"
            size="icon"
            className="h-20 w-20 rounded-full bg-white/20 hover:bg-white/30 text-white hover:text-white"
            onClick={togglePlay}
          >
            <Play className="h-8 w-8 ml-1" />
          </Button>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
        }`}>
        {/* Progress bar */}
        <div className="mb-4">
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full cursor-pointer"
          />
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            {/* Skip buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={(): void => skip(-10)}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={(): void => skip(10)}
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            {/* Volume controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ?
                  <VolumeX className="h-4 w-4" /> :
                  <Volume2 className="h-4 w-4" />
                }
              </Button>
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Time display */}
            <div className="text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Settings dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 text-white border-gray-600">
                <DropdownMenuItem onClick={(): void => changePlaybackRate(0.5)}>
                  Speed: 0.5x {playbackRate === 0.5 && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(): void => changePlaybackRate(0.75)}>
                  Speed: 0.75x {playbackRate === 0.75 && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(): void => changePlaybackRate(1)}>
                  Speed: 1x {playbackRate === 1 && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(): void => changePlaybackRate(1.25)}>
                  Speed: 1.25x {playbackRate === 1.25 && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(): void => changePlaybackRate(1.5)}>
                  Speed: 1.5x {playbackRate === 1.5 && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(): void => changePlaybackRate(2)}>
                  Speed: 2x {playbackRate === 2 && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Download button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Fullscreen toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              {isFullscreen ?
                <Minimize className="h-4 w-4" /> :
                <Maximize className="h-4 w-4" />
              }
            </Button>
          </div>
        </div>
      </div>

      {/* Video title */}
      {title && (
        <div className={`absolute top-4 left-4 text-white font-medium transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
          }`}>
          {title}
        </div>
      )}
    </div>
  );
}