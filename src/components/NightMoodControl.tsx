/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  Flame, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  Check, 
  Headphones, 
  SlidersHorizontal 
} from 'lucide-react';
import { NightMoodType, NIGHT_MOOD_PRESETS } from '../types/nightMood.ts';
import { nightAudio } from '../utils/nightAudio.ts';

interface NightMoodControlProps {
  currentMood: NightMoodType;
  onSelectMood: (mood: NightMoodType) => void;
  accentColor?: string;
}

export const NightMoodControl: React.FC<NightMoodControlProps> = ({
  currentMood,
  onSelectMood,
  accentColor = '#059669'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioTrack, setAudioTrack] = useState<'drone' | 'rain' | 'fireplace'>('drone');
  const [volume, setVolume] = useState<number>(50);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleAudio = () => {
    const newState = nightAudio.toggle(audioTrack);
    setIsPlayingAudio(newState);
  };

  const handleChangeTrack = (track: 'drone' | 'rain' | 'fireplace') => {
    setAudioTrack(track);
    if (isPlayingAudio) {
      nightAudio.play(track);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    nightAudio.setVolume(newVol / 100);
  };

  // Icon for current mood
  const renderCurrentIcon = () => {
    switch (currentMood) {
      case 'midnight':
        return <Moon className="w-4 h-4 text-sky-400" />;
      case 'candlelight':
        return <Flame className="w-4 h-4 text-amber-400 animate-pulse" />;
      case 'aurora':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'day':
      default:
        return <Sun className="w-4 h-4 text-amber-500" />;
    }
  };

  const currentPreset = NIGHT_MOOD_PRESETS.find(p => p.id === currentMood) || NIGHT_MOOD_PRESETS[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-medium transition-all shadow-2xs hover:shadow-xs group"
        title="Night Mood Atmosphere & Soundscape"
        aria-label="Night Mood Atmosphere Selector"
      >
        <span className="shrink-0">{renderCurrentIcon()}</span>
        <span className="hidden sm:inline font-semibold">
          {currentMood === 'day' ? 'Daylight' : 'Night Mood'}
        </span>
        <span className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-mono">
          {currentPreset.badge}
        </span>
        <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-4 z-50 text-neutral-900 dark:text-neutral-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 pb-2.5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-sky-400" />
                <span>Night Mood & Ambience</span>
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Atmospheric palettes designed for late-night scholarly reading
              </p>
            </div>
            {currentMood !== 'day' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                Active
              </span>
            )}
          </div>

          {/* Mood Options */}
          <div className="space-y-1.5">
            {NIGHT_MOOD_PRESETS.map((preset) => {
              const isSelected = currentMood === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectMood(preset.id);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-sky-500/80 bg-sky-50/40 dark:bg-sky-950/30 ring-1 ring-sky-500/30'
                      : 'border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white mt-0.5 shadow-2xs"
                    style={{ backgroundColor: preset.accentColor }}
                  >
                    {preset.id === 'midnight' && <Moon className="w-4 h-4" />}
                    {preset.id === 'candlelight' && <Flame className="w-4 h-4" />}
                    {preset.id === 'aurora' && <Sparkles className="w-4 h-4" />}
                    {preset.id === 'day' && <Sun className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                        <span>{preset.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {preset.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                      {preset.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Soundscape Synthesizer (Optional Soothing Study Ambience) */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                <span>Night Study Ambience</span>
              </span>
              <button
                onClick={handleToggleAudio}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  isPlayingAudio
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Volume2 className="w-3 h-3 animate-pulse" />
                    <span>Playing</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3 text-neutral-400" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>

            {/* Sound Presets */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                onClick={() => handleChangeTrack('drone')}
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors ${
                  audioTrack === 'drone'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs font-bold border border-sky-400/30'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                432Hz Calm
              </button>
              <button
                onClick={() => handleChangeTrack('rain')}
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors ${
                  audioTrack === 'rain'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs font-bold border border-sky-400/30'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Rain Shower
              </button>
              <button
                onClick={() => handleChangeTrack('fireplace')}
                className={`py-1.5 px-2 rounded-lg text-center font-medium transition-colors ${
                  audioTrack === 'fireplace'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-2xs font-bold border border-sky-400/30'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                Warm Hearth
              </button>
            </div>

            {/* Volume slider */}
            {isPlayingAudio && (
              <div className="flex items-center gap-2 pt-1">
                <Volume2 className="w-3 h-3 text-neutral-400 shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-full h-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <span className="text-[10px] font-mono text-neutral-400 w-7 text-right">
                  {volume}%
                </span>
              </div>
            )}
          </div>

          <div className="text-[10px] text-neutral-400 text-center font-mono">
            Pure client-side Web Audio synthesis · Zero tracking
          </div>

        </div>
      )}
    </div>
  );
};
