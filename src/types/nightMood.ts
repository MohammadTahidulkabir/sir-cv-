/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NightMoodType = 'day' | 'midnight' | 'candlelight' | 'aurora';

export interface NightMoodPreset {
  id: NightMoodType;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
  badge: string;
  features: string[];
  recommendedFor: string;
}

export const NIGHT_MOOD_PRESETS: NightMoodPreset[] = [
  {
    id: 'midnight',
    name: 'Midnight Deep Space',
    subtitle: 'Obsidian Black & Twinkling Celestial Stars',
    description: 'Ultra-deep OLED obsidian blacks with gentle twinkling constellations, cool silver-blue star luminescence, and minimal eye strain.',
    accentColor: '#38BDF8',
    badge: 'Deep OLED',
    features: ['Subtle twinkling starfield', 'Shooting star animation', 'Cool silver-blue luminescence', 'OLED energy efficient'],
    recommendedFor: 'Late night coding, manuscript proofreading, and quiet concentration'
  },
  {
    id: 'candlelight',
    name: 'Warm Candlelight Reading',
    subtitle: 'Warm Amber Sepia & Zero Blue-Light Comfort',
    description: 'Soothing warm honey and roasted espresso hues replicating a cozy university library lamp. Softens paper contrast and eliminates harsh blue spectrum.',
    accentColor: '#F59E0B',
    badge: 'Eye Comfort',
    features: ['Blue-light filtering palette', 'Subtle warm ambient lamp glow', 'High-legibility creamy text', 'Relaxed reading contrast'],
    recommendedFor: 'Reading journal articles, thesis drafts, and extended academic review'
  },
  {
    id: 'aurora',
    name: 'Nordic Aurora Night',
    subtitle: 'Boreal Indigo & Ethereal Emerald Shimmer',
    description: 'Inspired by Finnish & Swedish winter nights from Shuvro’s European Erasmus mobility. Deep oceanic night with drifting emerald atmospheric hues.',
    accentColor: '#10B981',
    badge: 'Atmospheric',
    features: ['Ethereal boreal wave mesh', 'Bioeconomy emerald shimmer', 'Deep oceanic indigo depths', 'Subtle organic glow'],
    recommendedFor: 'Reflective contemplation, grant ideation, and immersive presentation'
  },
  {
    id: 'day',
    name: 'Daylight Scholar',
    subtitle: 'Crisp Natural Sunlight & Editorial Clarity',
    description: 'High-contrast clean daylight aesthetic with neutral paper-white backgrounds and vivid academic accents.',
    accentColor: '#059669',
    badge: 'Daylight',
    features: ['Maximum daytime contrast', 'Crisp typography rendering', 'Standard daylight illumination', 'Academic paper aesthetic'],
    recommendedFor: 'Bright daytime environments and presentation projection'
  }
];
