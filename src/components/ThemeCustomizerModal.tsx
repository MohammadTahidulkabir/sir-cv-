/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Palette, 
  Type, 
  Globe, 
  Check, 
  Copy, 
  ExternalLink, 
  Sparkles, 
  Sliders, 
  RotateCcw,
  ShieldCheck,
  Share2,
  CheckCircle2,
  Moon,
  Sun,
  Flame,
  Headphones,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SHUVRO_SEN_CV } from '../data/cvData.ts';
import { NightMoodType, NIGHT_MOOD_PRESETS } from '../types/nightMood.ts';
import { nightAudio } from '../utils/nightAudio.ts';


export interface ThemeConfig {
  paletteId: 'emerald' | 'blue' | 'amber' | 'burgundy' | 'indigo' | 'custom';
  accentColor: string;
  fontTheme: 'geometric' | 'editorial' | 'technical';
  customDomain: string;
}

export const PRESET_PALETTES = [
  {
    id: 'emerald',
    name: 'Emerald & Bioeconomy',
    description: 'Sustainability transitions & circular economy theme',
    color: '#059669',
    lightColor: '#10B981',
    bgSample: 'bg-emerald-500'
  },
  {
    id: 'blue',
    name: 'Oxford Academic Blue',
    description: 'Collegiate prestige & global consortium mobility',
    color: '#2563EB',
    lightColor: '#3B82F6',
    bgSample: 'bg-blue-600'
  },
  {
    id: 'amber',
    name: 'Golden Ratio & Amber',
    description: 'High-contrast editorial warmth & empirical rigor',
    color: '#D97706',
    lightColor: '#F59E0B',
    bgSample: 'bg-amber-500'
  },
  {
    id: 'burgundy',
    name: 'Monograph Burgundy',
    description: 'Classical institutional scholarly press styling',
    color: '#991B1B',
    lightColor: '#DC2626',
    bgSample: 'bg-red-700'
  },
  {
    id: 'indigo',
    name: 'Modern Slate & Indigo',
    description: 'Minimalist quantitative modeling & tech focus',
    color: '#4F46E5',
    lightColor: '#6366F1',
    bgSample: 'bg-indigo-600'
  }
];

export const FONT_OPTIONS = [
  {
    id: 'geometric',
    name: 'Contemporary Geometric',
    displayFont: 'Plus Jakarta Sans',
    bodyFont: 'DM Sans',
    sample: 'Shuvro Sen · Empirical Research Portfolio',
    description: 'Clean modern sans-serif optimized for research analytics & dashboards.'
  },
  {
    id: 'editorial',
    name: 'Scholarly Editorial Serif',
    displayFont: 'Playfair Display',
    bodyFont: 'DM Sans',
    sample: 'Shuvro Sen · Empirical Research Portfolio',
    description: 'Prestigious academic monograph serif paired with legible sans body prose.'
  },
  {
    id: 'technical',
    name: 'Modern Technical & Data',
    displayFont: 'Outfit',
    bodyFont: 'DM Sans',
    sample: 'Shuvro Sen · Empirical Research Portfolio',
    description: 'Crisp neo-grotesque display paired with monospace tabular numerals.'
  }
];

const STORAGE_KEY = 'shuvro_sen_theme_config_v1';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ThemeConfig;
  onUpdateConfig: (config: ThemeConfig) => void;
  nightMood: NightMoodType;
  onSelectNightMood: (mood: NightMoodType) => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  nightMood,
  onSelectNightMood
}) => {
  const [activeTab, setActiveTab] = useState<'palette' | 'typography' | 'night' | 'domain'>('palette');
  const [copied, setCopied] = useState<boolean>(false);
  const [domainInput, setDomainInput] = useState<string>(config.customDomain || 'shuvrosen.academic.bio');
  const [customHex, setCustomHex] = useState<string>(config.accentColor);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioTrack, setAudioTrack] = useState<'drone' | 'rain' | 'fireplace'>('drone');
  const [audioVolume, setAudioVolume] = useState<number>(50);


  if (!isOpen) return null;

  const handlePaletteSelect = (palette: typeof PRESET_PALETTES[0]) => {
    const updated: ThemeConfig = {
      ...config,
      paletteId: palette.id as any,
      accentColor: palette.color
    };
    onUpdateConfig(updated);
    setCustomHex(palette.color);
    showToast(`Applied ${palette.name}`);
  };

  const handleCustomHexChange = (hex: string) => {
    setCustomHex(hex);
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      onUpdateConfig({
        ...config,
        paletteId: 'custom',
        accentColor: hex
      });
    }
  };

  const handleFontSelect = (fontId: 'geometric' | 'editorial' | 'technical') => {
    const updated: ThemeConfig = {
      ...config,
      fontTheme: fontId
    };
    onUpdateConfig(updated);
    showToast(`Typography set to ${FONT_OPTIONS.find(f => f.id === fontId)?.name}`);
  };

  const handleSaveDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = domainInput.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    onUpdateConfig({
      ...config,
      customDomain: clean
    });
    showToast(`Custom domain updated to ${clean}`);
  };

  const handleResetDefaults = () => {
    const defaultConfig: ThemeConfig = {
      paletteId: 'emerald',
      accentColor: '#059669',
      fontTheme: 'geometric',
      customDomain: 'shuvrosen.academic.bio'
    };
    onUpdateConfig(defaultConfig);
    setDomainInput('shuvrosen.academic.bio');
    setCustomHex('#059669');
    showToast('Reset to default styling');
  };

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl max-w-3xl w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">
                Design & Domain Appearance Studio
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Customize scholarly color palettes, typography pairings, and your custom domain branding in real time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-xs">
          <button
            onClick={() => setActiveTab('palette')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'palette'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 font-semibold'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Color Palettes & Accents</span>
          </button>

          <button
            onClick={() => setActiveTab('typography')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'typography'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 font-semibold'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Typography Pairings</span>
          </button>

          <button
            onClick={() => setActiveTab('night')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'night'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 font-semibold'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Moon className="w-4 h-4 text-sky-400" />
            <span>Night Mood & Ambience</span>
          </button>

          <button
            onClick={() => setActiveTab('domain')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'domain'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 font-semibold'
                : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Custom Domain & SEO Link</span>
          </button>
        </div>


        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: PALETTES */}
          {activeTab === 'palette' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                  Curated Academic Palettes
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Select a tailored palette designed specifically for academic faculty portfolios and data visualizations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESET_PALETTES.map((pal) => {
                  const isSelected = config.paletteId === pal.id;
                  return (
                    <button
                      key={pal.id}
                      onClick={() => handlePaletteSelect(pal)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                      }`}
                    >
                      <div 
                        className="w-8 h-8 rounded-lg shrink-0 shadow-xs flex items-center justify-center text-white"
                        style={{ backgroundColor: pal.color }}
                      >
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-neutral-900 dark:text-white">
                          {pal.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                          {pal.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Hex Color Picker */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Fine-Tune Custom Accent Color</span>
                  </span>
                  <span className="font-mono text-neutral-500">{customHex}</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => handleCustomHexChange(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={customHex}
                    onChange={(e) => handleCustomHexChange(e.target.value)}
                    placeholder="#059669"
                    className="flex-1 px-3 py-2 text-xs font-mono bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white uppercase"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 bg-neutral-950 text-white rounded-xl space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono block">
                  Live UI Element Preview:
                </span>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button 
                    className="px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm"
                    style={{ backgroundColor: config.accentColor }}
                  >
                    Primary Action Button
                  </button>
                  <span 
                    className="text-xs font-mono font-bold"
                    style={{ color: config.accentColor }}
                  >
                    +15.5% YoY Citations
                  </span>
                  <span className="px-2.5 py-1 rounded text-[11px] bg-white/10 text-white">
                    Verified Scholar Badge
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                  Academic Font Pairings
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Switch the headline display and body prose fonts to match your preferred scholarly or modern aesthetic.
                </p>
              </div>

              <div className="space-y-3">
                {FONT_OPTIONS.map((font) => {
                  const isSelected = config.fontTheme === font.id;
                  return (
                    <button
                      key={font.id}
                      onClick={() => handleFontSelect(font.id as any)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                          <span>{font.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                        </span>
                        <span className="text-xs font-mono text-neutral-500">
                          {font.displayFont} + {font.bodyFont}
                        </span>
                      </div>

                      <div 
                        className={`text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-1 ${
                          font.id === 'editorial' ? 'font-serif italic' : ''
                        }`}
                      >
                        {font.sample}
                      </div>

                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
                        {font.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: NIGHT MOOD & AMBIENCE */}
          {activeTab === 'night' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span>Nocturnal Reading & Atmosphere Presets</span>
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Custom-engineered night moods that eliminate retinal fatigue during late-night thesis research and publication reviews.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {NIGHT_MOOD_PRESETS.map((preset) => {
                  const isSelected = nightMood === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectNightMood(preset.id);
                        showToast(`Activated ${preset.name}`);
                      }}
                      className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/20 dark:bg-sky-950/30 ring-2 ring-sky-500/20 shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-white shadow-2xs"
                            style={{ backgroundColor: preset.accentColor }}
                          >
                            {preset.id === 'midnight' && <Moon className="w-4 h-4" />}
                            {preset.id === 'candlelight' && <Flame className="w-4 h-4" />}
                            {preset.id === 'aurora' && <Sparkles className="w-4 h-4" />}
                            {preset.id === 'day' && <Sun className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                              {preset.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {preset.badge}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                            <Check className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                        {preset.description}
                      </p>

                      <div className="mt-auto pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                        <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                          Key Features:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {preset.features.map((feat, i) => (
                            <span 
                              key={i} 
                              className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Soundscape Synthesizer in Modal */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Headphones className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                    <span>Acoustic Study Atmosphere (Web Audio API)</span>
                  </span>
                  <button
                    onClick={() => {
                      const state = nightAudio.toggle(audioTrack);
                      setIsPlayingAudio(state);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      isPlayingAudio
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                        <span>Sound Active</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Start Soundscape</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Calming background tones synthesized entirely within your browser to promote deep focus and reduce distraction.
                </p>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => {
                      setAudioTrack('drone');
                      if (isPlayingAudio) nightAudio.play('drone');
                    }}
                    className={`py-2 px-3 rounded-lg text-center font-medium border transition-colors ${
                      audioTrack === 'drone'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-800'
                    }`}
                  >
                    432Hz Calm Drone
                  </button>
                  <button
                    onClick={() => {
                      setAudioTrack('rain');
                      if (isPlayingAudio) nightAudio.play('rain');
                    }}
                    className={`py-2 px-3 rounded-lg text-center font-medium border transition-colors ${
                      audioTrack === 'rain'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-800'
                    }`}
                  >
                    Gentle Rain Shower
                  </button>
                  <button
                    onClick={() => {
                      setAudioTrack('fireplace');
                      if (isPlayingAudio) nightAudio.play('fireplace');
                    }}
                    className={`py-2 px-3 rounded-lg text-center font-medium border transition-colors ${
                      audioTrack === 'fireplace'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-800'
                    }`}
                  >
                    Warm Library Hearth
                  </button>
                </div>

                {isPlayingAudio && (
                  <div className="flex items-center gap-3 pt-1">
                    <Volume2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={audioVolume}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAudioVolume(val);
                        nightAudio.setVolume(val / 100);
                      }}
                      className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <span className="text-xs font-mono text-neutral-500 w-8 text-right">
                      {audioVolume}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM DOMAIN & LINK SHARING */}
          {activeTab === 'domain' && (

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                  Custom Domain Configuration & Web Identity
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Map your academic portfolio to a custom domain (e.g., your university profile alias or personal scholar website).
                </p>
              </div>

              <form onSubmit={handleSaveDomain} className="space-y-3">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                  Configured Custom Domain Name
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                      https://
                    </span>
                    <input
                      type="text"
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      placeholder="shuvrosen.academic.bio"
                      className="w-full pl-16 pr-3 py-2 text-xs font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-colors shrink-0"
                    style={{ backgroundColor: config.accentColor }}
                  >
                    Save Domain
                  </button>
                </div>
              </form>

              {/* DNS Instructions Card */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>DNS Routing Instructions</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">SSL Auto-Provisioned</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                  To point your custom domain registrar (Namecheap, Cloudflare, GoDaddy, or University DNS) to this applet, add the following CNAME record:
                </p>
                <div className="p-2.5 bg-neutral-900 text-neutral-100 rounded-lg font-mono text-[11px] flex items-center justify-between">
                  <span>CNAME @ → ais-pre-6fxwqu4sgkyakl3gogdvdg.asia-southeast1.run.app</span>
                  <button
                    onClick={() => copyToClipboard('ais-pre-6fxwqu4sgkyakl3gogdvdg.asia-southeast1.run.app')}
                    className="hover:text-emerald-400 transition-colors p-1"
                    title="Copy Target Host"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Social Share Card Preview */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                  Live Social Share Card Preview (OpenGraph / LinkedIn / Twitter):
                </span>
                <div className="p-4 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center gap-4">
                  <img
                    src="/assets/aistudio/53_f8d65841.png"
                    alt="Shuvro Sen"
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 truncate">
                      {domainInput || 'shuvrosen.academic.bio'}
                    </div>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      Shuvro Sen · Academic Portfolio & Trajectory
                    </div>
                    <p className="text-[11px] text-neutral-500 line-clamp-1">
                      Lecturer in General Management @ IUB · Erasmus Mundus Scholar · 13 Research Outputs
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Toast Notification */}
          {saveToast && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{saveToast}</span>
            </motion.div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50 text-xs">
          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-white rounded-lg shadow-xs transition-colors"
            style={{ backgroundColor: config.accentColor }}
          >
            Apply & Close
          </button>
        </div>

      </motion.div>
    </div>
  );
};
