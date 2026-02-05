"use client";

import { useEffect, useRef, useState } from "react";

interface YouTubePlayerProps {
    videos: { id: number; title: string; youtubeId: string }[];
}

export default function YouTubePlayer({ videos }: YouTubePlayerProps) {
    const playerRef = useRef<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (videos.length === 0) return;

        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // @ts-ignore
        window.onYouTubeIframeAPIReady = () => {
            // @ts-ignore
            playerRef.current = new YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: videos[0].youtubeId,
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    controls: 0,
                    rel: 0,
                    modestbranding: 1,
                    showinfo: 0,
                    fs: 1,
                    iv_load_policy: 3,
                    playsinline: 1,
                    enablejsapi: 1,
                    origin: typeof window !== 'undefined' ? window.location.origin : '',
                },
                events: {
                    onReady: (event: any) => {
                        event.target.playVideo();
                        setIsPlaying(true);
                    },
                    onStateChange: (event: any) => {
                        // @ts-ignore
                        if (event.data === YT.PlayerState.ENDED) {
                            const nextIndex = (currentIndex + 1) % videos.length;
                            setCurrentIndex(nextIndex);
                            playerRef.current.loadVideoById(videos[nextIndex].youtubeId);
                        }
                    },
                },
            });
        };
    }, [videos, currentIndex]);

    const togglePlay = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (playerRef.current) {
            if (isMuted) {
                playerRef.current.unMute();
            } else {
                playerRef.current.mute();
            }
            setIsMuted(!isMuted);
        }
    };

    const playNext = () => {
        const nextIndex = (currentIndex + 1) % videos.length;
        setCurrentIndex(nextIndex);
        playerRef.current?.loadVideoById(videos[nextIndex].youtubeId);
    };

    const playPrevious = () => {
        const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
        setCurrentIndex(prevIndex);
        playerRef.current?.loadVideoById(videos[prevIndex].youtubeId);
    };

    if (videos.length === 0) return null;

    return (
        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl group">
            {/* Video Container - 16:9 aspect ratio */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div id="youtube-player" className="absolute inset-0 w-full h-full"></div>

                {/* Gradient Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Premium Control Panel */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent transform translate-y-0 transition-all duration-300">
                {/* Song Info */}
                <div className="mb-4">
                    <h3 className="text-white font-bold text-xl mb-1 drop-shadow-lg">
                        {videos[currentIndex]?.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium border border-amber-500/30">
                            {currentIndex + 1} / {videos.length}
                        </span>
                        <span className="text-slate-400">播放清單</span>
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Playback Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={playPrevious}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10"
                            title="上一首"
                        >
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                            </svg>
                        </button>

                        <button
                            onClick={togglePlay}
                            className="p-4 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/50"
                            title={isPlaying ? "暫停" : "播放"}
                        >
                            {isPlaying ? (
                                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={playNext}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10"
                            title="下一首"
                        >
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                            </svg>
                        </button>
                    </div>

                    {/* Right: Volume Control */}
                    <button
                        onClick={toggleMute}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10"
                        title={isMuted ? "開啟聲音" : "靜音"}
                    >
                        {isMuted ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
