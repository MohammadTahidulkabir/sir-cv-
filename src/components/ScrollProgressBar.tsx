/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

interface ScrollProgressBarProps {
  accentColor?: string;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ accentColor }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  const [percentage, setPercentage] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('Overview');

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;

    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const pct = Math.min(100, Math.max(0, Math.round(latest * 100)));
      setPercentage(pct);

      if (latest > 0.02) {
        setIsVisible(true);
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 2200);
      } else {
        setIsVisible(false);
      }
    });

    // Detect active section on scroll
    const handleScroll = () => {
      const sections = [
        { id: 'overview', label: 'Overview' },
        { id: 'trajectory', label: 'Trajectory' },
        { id: 'skills', label: 'Skills & Potential' },
        { id: 'publications', label: 'Publications' },
        { id: 'honors', label: 'Honors & Leadership' },
        { id: 'vault', label: 'Document Vault' },
        { id: 'contact', label: 'Contact & Inquiry' }
      ];

      const scrollPosition = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].label);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(hideTimer);
    };
  }, [scrollYProgress]);

  return (
    <>
      {/* Viewport Top Progress Track */}
      <div 
        className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-neutral-200/40 dark:bg-neutral-800/40 backdrop-blur-xs"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Portfolio scroll progress"
      >
        <motion.div
          className="h-full origin-left bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-colors"
          style={{ 
            scaleX,
            backgroundColor: accentColor || 'var(--accent-color, #059669)'
          }}
        />
      </div>

      {/* Subtle floating progress badge at top right - appears softly while scrolling */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ 
          opacity: isVisible && percentage > 3 ? 1 : 0, 
          y: isVisible && percentage > 3 ? 0 : -8 
        }}
        transition={{ duration: 0.2 }}
        className="fixed top-3.5 right-4 z-50 pointer-events-none hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-900/80 dark:bg-neutral-800/85 backdrop-blur-md text-[11px] font-mono text-white/90 border border-white/10 shadow-lg"
      >
        <span className="text-emerald-400 font-semibold">{percentage}%</span>
        <span className="text-neutral-400" aria-hidden="true">·</span>
        <span className="text-neutral-300 font-sans truncate max-w-[120px]">{activeSection}</span>
      </motion.div>
    </>
  );
};
