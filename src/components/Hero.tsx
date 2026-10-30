/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  ArrowRight, 
  FileText, 
  Maximize2, 
  Sparkles, 
  GraduationCap, 
  Building2, 
  Award, 
  SlidersHorizontal,
  X,
  ZoomIn,
  Download,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SHUVRO_SEN_CV } from '../data/cvData.ts';

interface HeroProps {
  onOpenPdfViewer: () => void;
}

type PhotoFilter = 'natural' | 'warm' | 'mono' | 'crisp';

export const Hero: React.FC<HeroProps> = ({ onOpenPdfViewer }) => {

  const [activeFilter, setActiveFilter] = useState<PhotoFilter>('natural');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt state
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Animated counters
  const [countCitations, setCountCitations] = useState(0);
  const [countOutputs, setCountOutputs] = useState(0);
  const [countHIndex, setCountHIndex] = useState(0);
  const [countUnis, setCountUnis] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const steps = 35;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(1, step / steps);
      // easeOutQuad
      const eased = 1 - (1 - progress) * (1 - progress);

      setCountCitations(Math.round(eased * 2035));
      setCountOutputs(Math.round(eased * 10));
      setCountHIndex(Math.round(eased * 9));
      setCountUnis(Math.round(eased * 4));

      if (step >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    setIsHovered(false);
  };

  const filterStyles: Record<PhotoFilter, string> = {
    natural: 'brightness-105 contrast-105 saturate-105',
    warm: 'sepia-[0.18] brightness-105 contrast-105 saturate-115 hue-rotate-[-5deg]',
    mono: 'grayscale contrast-125 brightness-95',
    crisp: 'contrast-125 saturate-110 brightness-100'
  };

  return (
    <section id="overview" className="relative pt-10 pb-16 md:pt-16 md:pb-24 border-b border-neutral-200/80 dark:border-neutral-800 overflow-hidden">
      
      {/* Subtle Ambient Background Glows */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-blue-500/10 to-teal-500/5 blur-3xl pointer-events-none rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Split Screen 2-Column Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Typographic Narrative */}
          <motion.div 
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* Editorial Kicker (Unboxed Text, No Static Pill) */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Academic Profile & Research Portfolio</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Erasmus Mundus Scholar</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50" style={{ textWrap: 'balance' }}>
                Shuvro Sen
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-neutral-600 dark:text-neutral-300">
                Lecturer in General Management · <span className="text-neutral-900 dark:text-white font-semibold">Independent University, Bangladesh</span>
              </p>
            </div>

            {/* Profile Narrative from CV */}
            <p className="text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-2xl">
              Specializing in <span className="text-neutral-900 dark:text-white font-medium">sustainability transitions, Industry 5.0, circular economies,</span> and <span className="text-neutral-900 dark:text-white font-medium">supply chain resilience</span>. Experienced in quantitative and qualitative empirical research using R, SPSS, and NVivo, with 13 published research outputs across leading Q1/Q2 journals and international policy monographs.
            </p>

            {/* Contact & Affiliation Details */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              <a 
                href={`mailto:${SHUVRO_SEN_CV.contact.email}`} 
                className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{SHUVRO_SEN_CV.contact.email}</span>
              </a>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">/</span>
              <a 
                href={`tel:${SHUVRO_SEN_CV.contact.phone}`} 
                className="inline-flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{SHUVRO_SEN_CV.contact.phone}</span>
              </a>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">/</span>
              <span className="inline-flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
                <span>Dhaka, Bangladesh</span>
              </span>
            </div>

            {/* Academic Link Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#trajectory"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <span>Trajectory Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={SHUVRO_SEN_CV.contact.googleScholar}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
              >
                <span>Google Scholar (2,035+ Citations)</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </a>

              <button
                onClick={onOpenPdfViewer}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700/80 transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Inspect PDF CV</span>
              </button>
            </div>


            {/* Research Pillars Text List */}
            <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800">
              <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-2">
                Core Research Focus Areas:
              </span>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-600 dark:text-neutral-300">
                {SHUVRO_SEN_CV.researchInterests.map((interest, idx) => (
                  <span key={interest} className="inline-flex items-center">
                    <span>{interest}</span>
                    {idx < SHUVRO_SEN_CV.researchInterests.length - 1 && (
                      <span className="ml-3 text-neutral-300 dark:text-neutral-700" aria-hidden="true">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Right Column: Interactive 3D Animated Portrait Showcase */}
          <div className="lg:col-span-5 flex justify-center perspective-[1200px]">
            <div className="relative w-full max-w-md">
              
              {/* Animated Floating Botanical Aura Ring */}
              <motion.div
                animate={{
                  scale: [1, 1.06, 1],
                  opacity: [0.45, 0.7, 0.45],
                  rotate: [0, 8, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-blue-500/25 rounded-3xl blur-2xl -z-10"
              />

              {/* Floating Badge 1 (Top Left): Erasmus Mundus Scholar */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-700 shadow-md text-xs font-semibold text-neutral-800 dark:text-neutral-100"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <span>Erasmus Mundus Scholar</span>
              </motion.div>

              {/* Floating Badge 2 (Bottom Right): Lecturer @ IUB */}
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 -right-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-700 shadow-md text-xs font-semibold text-neutral-800 dark:text-neutral-100"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span>Lecturer @ IUB · Dhaka</span>
              </motion.div>

              {/* 3D Interactive Card Container */}
              <div
                ref={cardRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
                  transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
                }}
                className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 p-4 shadow-lg group overflow-hidden"
              >
                {/* Specular Glare Effect following mouse pointer */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    opacity: isHovered ? 0.12 : 0,
                    background: `radial-gradient(circle 240px at ${tilt.glareX}% ${tilt.glareY}%, white, transparent)`
                  }}
                />

                {/* Main Photo Frame */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 cursor-pointer group/img">
                  <img
                    src="/assets/aistudio/53_f8d65841.png"
                    alt="Shuvro Sen - Academic Lecturer & Researcher"
                    className={`w-full h-full object-cover object-top transition-all duration-700 group-hover/img:scale-105 ${filterStyles[activeFilter]}`}
                    onClick={() => setIsLightboxOpen(true)}
                  />

                  {/* Corner Expand Button */}
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs transition-all duration-200 opacity-80 group-hover/img:opacity-100"
                    aria-label="Expand High-Resolution Photo"
                    title="View High-Resolution Image"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Subtle Natural Ambient Overlay Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                  {/* Photo Tone Pills on Bottom Edge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                    <span className="text-[11px] font-medium text-white/90 drop-shadow-xs">
                      Natural Foliage Portrait
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLightboxOpen(true);
                      }}
                      className="text-[11px] font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs px-2.5 py-1 rounded-md transition-colors"
                    >
                      Inspect Bio Photo
                    </button>
                  </div>
                </div>

                {/* Tone Preset Filter Bar */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <SlidersHorizontal className="w-3 h-3" />
                      <span>Visual Tone Modes:</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 capitalize">
                      {activeFilter} mode
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg text-[11px]">
                    <button
                      onClick={() => setActiveFilter('natural')}
                      className={`py-1 rounded text-center transition-all ${
                        activeFilter === 'natural' 
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold shadow-xs' 
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      Natural
                    </button>
                    <button
                      onClick={() => setActiveFilter('warm')}
                      className={`py-1 rounded text-center transition-all ${
                        activeFilter === 'warm' 
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold shadow-xs' 
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      Golden
                    </button>
                    <button
                      onClick={() => setActiveFilter('crisp')}
                      className={`py-1 rounded text-center transition-all ${
                        activeFilter === 'crisp' 
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold shadow-xs' 
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      Crisp
                    </button>
                    <button
                      onClick={() => setActiveFilter('mono')}
                      className={`py-1 rounded text-center transition-all ${
                        activeFilter === 'mono' 
                          ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold shadow-xs' 
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      Mono
                    </button>
                  </div>
                </div>

                {/* Scholar Metadata Annotation */}
                <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 dark:text-white">Erasmus Mundus Scholar (TISE)</span>
                    <span className="text-neutral-500 font-mono tabular-nums">2021 – 2023</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                    Joint Master's Degree: UCD (Ireland), NOVA FCSH (Portugal), Poznan (Poland), Danube Krems (Austria).
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Full-Width Key Metrics Strip with Live Animated Counters */}
        <div className="mt-14 pt-8 border-t border-neutral-200/80 dark:border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="space-y-1"
          >
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono tabular-nums flex items-baseline gap-1">
              <span>{countCitations.toLocaleString()}+</span>
            </div>
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Total Scholar Citations
            </div>
            <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Google Scholar ID: JZz99IUAAAAJ
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-1"
          >
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono tabular-nums">
              {countHIndex} / {countHIndex}
            </div>
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              h-index & i10-index
            </div>
            <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Google Scholar verified impact
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="space-y-1"
          >
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono tabular-nums">
              {countOutputs}+
            </div>
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Core Publications & Monographs
            </div>
            <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Q1/Q2 journals, books & reports
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="space-y-1"
          >
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono tabular-nums">
              {countUnis}
            </div>
            <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              European Universities
            </div>
            <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Joint Degree consortium mobility
            </div>
          </motion.div>
        </div>

      </div>

      {/* Lightbox / Expanded Portrait Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Shuvro Sen · Academic Portrait
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    Lecturer in General Management · Independent University, Bangladesh
                  </p>
                </div>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 bg-neutral-950 flex justify-center items-center">
                <img
                  src="/assets/aistudio/53_f8d65841.png"
                  alt="Shuvro Sen Full Portrait"
                  className={`max-h-[60vh] rounded-xl object-contain shadow-2xl ${filterStyles[activeFilter]}`}
                />
              </div>

              <div className="p-6 bg-white dark:bg-neutral-900 space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
                <p className="leading-relaxed">
                  The natural botanical foliage reflects Shuvro Sen's central research passion: <strong className="text-neutral-900 dark:text-white">ecological transitions, bioeconomy, and sustainable supply chains</strong>. With field studies spanning Bangladesh's garment sector to multi-tier European supply chains, his scholarship bridges technical analytics (R, SPSS) with human-centric social justice.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500">
                  <span>h-index: 9 · i10-index: 9 · 13 Outputs</span>
                  <a
                    href="/assets/aistudio/53_f8d65841.png"
                    download="Shuvro_Sen_Portrait.png"
                    className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Portrait Asset</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
