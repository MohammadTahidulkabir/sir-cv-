/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Moon, Sun, ShieldCheck, Menu, X, Palette } from 'lucide-react';
import { NightMoodType } from '../types/nightMood.ts';
import { NightMoodControl } from './NightMoodControl.tsx';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  nightMood: NightMoodType;
  onSelectNightMood: (mood: NightMoodType) => void;
  onOpenPdfViewer: () => void;
  onOpenThemeModal: () => void;
  accentColor?: string;
  customDomain?: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  nightMood,
  onSelectNightMood,
  onOpenPdfViewer,
  onOpenThemeModal,
  accentColor = '#059669',
  customDomain
}) => {


  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Trajectory', href: '#trajectory' },
    { label: 'Skills & Potential', href: '#skills' },
    { label: 'Publications', href: '#publications' },
    { label: 'Document Vault', href: '#vault' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element with animated portrait thumbnail) */}
        <a 
          href="#overview" 
          className="flex items-center gap-3 group text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500/30 group-hover:ring-emerald-500 transition-all duration-300 shadow-xs">
            <img 
              src="/assets/aistudio/53_f8d65841.png" 
              alt="Shuvro Sen" 
              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span>Shuvro Sen</span>
        </a>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions (Night Mood Atmosphere Controller, Theme Customizer & Primary Action) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Night Mood & Ambience Control */}
          <NightMoodControl
            currentMood={nightMood}
            onSelectMood={onSelectNightMood}
            accentColor={accentColor}
          />

          {/* Appearance & Domain Studio Button */}
          <button
            onClick={onOpenThemeModal}
            aria-label="Customize Appearance & Domain"
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title="Customize Appearance, Colors & Domain"
          >
            <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          <button
            onClick={onOpenPdfViewer}
            style={{ backgroundColor: accentColor }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white hover:opacity-90 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-950"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>View CV PDF</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                onToggleDarkMode();
                setMobileMenuOpen(false);
              }}
              className="text-center py-2 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-400" />}
              <span>{nightMood === 'day' ? 'Night' : 'Day'}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenThemeModal();
              }}
              className="text-center py-2 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Theme</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPdfViewer();
              }}
              style={{ backgroundColor: accentColor }}
              className="text-center py-2 text-xs font-semibold text-white rounded-lg flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CV PDF</span>
            </button>
          </div>
        </div>
      )}


    </header>
  );
};
