/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { TrajectoryDashboard } from './components/TrajectoryDashboard.tsx';
import { SkillAnalysis } from './components/SkillAnalysis.tsx';
import { PublicationsSection } from './components/PublicationsSection.tsx';
import { HonorsAndLeadership } from './components/HonorsAndLeadership.tsx';
import { DocumentVault } from './components/DocumentVault.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { PdfViewerModal } from './components/PdfViewerModal.tsx';
import { ThemeCustomizerModal, ThemeConfig } from './components/ThemeCustomizerModal.tsx';
import { ScrollProgressBar } from './components/ScrollProgressBar.tsx';
import { NightMoodBackdrop } from './components/NightMoodBackdrop.tsx';
import { NightMoodType } from './types/nightMood.ts';

const DEFAULT_THEME: ThemeConfig = {
  paletteId: 'emerald',
  accentColor: '#059669',
  fontTheme: 'geometric',
  customDomain: 'shuvrosen.academic.bio'
};

export default function App() {
  const [nightMood, setNightMood] = useState<NightMoodType>(() => {
    if (typeof window !== 'undefined') {
      const savedMood = localStorage.getItem('shuvro_night_mood');
      if (savedMood && (savedMood === 'midnight' || savedMood === 'candlelight' || savedMood === 'aurora' || savedMood === 'day')) {
        return savedMood as NightMoodType;
      }
      const savedTheme = localStorage.getItem('shuvro_theme');
      if (savedTheme === 'dark') return 'midnight';
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'midnight';
    }
    return 'day';
  });

  const darkMode = nightMood !== 'day';

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('shuvro_sen_theme_config_v1');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_THEME;
  });

  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Apply dark mode & night mood atmosphere
  useEffect(() => {
    if (nightMood !== 'day') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-night-mood', nightMood);
      localStorage.setItem('shuvro_theme', 'dark');
      localStorage.setItem('shuvro_night_mood', nightMood);
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-night-mood');
      localStorage.setItem('shuvro_theme', 'light');
      localStorage.setItem('shuvro_night_mood', 'day');
    }
  }, [nightMood]);

  // Apply typography and accent color
  useEffect(() => {
    document.documentElement.setAttribute('data-font-theme', themeConfig.fontTheme);
    document.documentElement.style.setProperty('--accent-color', themeConfig.accentColor);
    try {
      localStorage.setItem('shuvro_sen_theme_config_v1', JSON.stringify(themeConfig));
    } catch {
      // ignore
    }
  }, [themeConfig]);

  const toggleDarkMode = () => {
    setNightMood(prev => (prev === 'day' ? 'midnight' : 'day'));
  };

  const handleSelectNightMood = (mood: NightMoodType) => {
    setNightMood(mood);
  };

  return (
    <div className="relative min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Night Mood Canvas / Atmospheric Backdrop (Twinkling stars, candlelight glow, or aurora) */}
      <NightMoodBackdrop mood={nightMood} />

      {/* Subtle Scroll Progress Bar at Viewport Top */}
      <ScrollProgressBar accentColor={themeConfig.accentColor} />

      {/* Primary Top Bar with Night Mood Control */}
      <div className="relative z-40">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          nightMood={nightMood}
          onSelectNightMood={handleSelectNightMood}
          onOpenPdfViewer={() => setIsPdfViewerOpen(true)}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          accentColor={themeConfig.accentColor}
          customDomain={themeConfig.customDomain}
        />
      </div>

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero
          onOpenPdfViewer={() => setIsPdfViewerOpen(true)}
        />

        <TrajectoryDashboard />

        <SkillAnalysis />

        <PublicationsSection />

        <HonorsAndLeadership />

        <DocumentVault
          onOpenPdfViewer={() => setIsPdfViewerOpen(true)}
        />

        <ContactSection />
      </main>

      {/* Quiet Academic Footer */}
      <div className="relative z-10">
        <Footer
          onOpenPdfViewer={() => setIsPdfViewerOpen(true)}
        />
      </div>

      {/* Global Modals */}
      <PdfViewerModal
        isOpen={isPdfViewerOpen}
        onClose={() => setIsPdfViewerOpen(false)}
        pdfUrl="/assets/aistudio/Shuvro_Sen_CV-1_664242a1.pdf"
      />

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        config={themeConfig}
        onUpdateConfig={setThemeConfig}
        nightMood={nightMood}
        onSelectNightMood={handleSelectNightMood}
      />
    </div>
  );
}
