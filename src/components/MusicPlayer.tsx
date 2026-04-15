import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl border border-pink-500/30 p-6 shadow-[0_0_50px_rgba(236,72,153,0.15)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-6">
        {/* Album Art */}
        <div className="relative group">
          <motion.div 
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-pink-500/50 p-1"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Music className="w-8 h-8 text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white truncate tracking-tight">{currentTrack.title}</h3>
          <p className="text-pink-400/80 text-sm font-medium truncate">{currentTrack.artist}</p>
          
          <div className="mt-4 flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-pink-500 shadow-[0_0_10px_#ec4899]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-8">
        <button 
          onClick={skipBack}
          className="text-gray-400 hover:text-pink-400 transition-colors active:scale-90"
        >
          <SkipBack className="w-6 h-6 fill-current" />
        </button>

        <button 
          onClick={togglePlay}
          className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.4)]"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-1" />
          )}
        </button>

        <button 
          onClick={skipForward}
          className="text-gray-400 hover:text-pink-400 transition-colors active:scale-90"
        >
          <SkipForward className="w-6 h-6 fill-current" />
        </button>
      </div>
      
      <div className="mt-6 flex justify-center">
        <div className="px-3 py-1 bg-pink-500/10 rounded-full border border-pink-500/20">
          <span className="text-[10px] font-mono text-pink-400 uppercase tracking-[0.2em]">
            {isPlaying ? 'Now Playing' : 'Paused'}
          </span>
        </div>
      </div>
    </div>
  );
};
