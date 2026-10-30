/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Layers, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  ChevronRight, 
  Sliders, 
  TrendingUp, 
  X, 
  Sparkles,
  ArrowDown,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { SHUVRO_SEN_CV, TrajectoryMilestone } from '../data/cvData.ts';
import { TimelineMilestoneCard } from './TimelineMilestoneCard.tsx';

export const TrajectoryDashboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeYearFilter, setActiveYearFilter] = useState<number>(2026);
  const [inspectMilestone, setInspectMilestone] = useState<TrajectoryMilestone | null>(null);
  const [focusedMilestoneId, setFocusedMilestoneId] = useState<string>(SHUVRO_SEN_CV.trajectory[0]?.id || '');

  // Future trajectory simulation sliders
  const [researchIntensity, setResearchIntensity] = useState<number>(85);
  const [consortiumCollaboration, setConsortiumCollaboration] = useState<number>(75);
  const [grantFocus, setGrantFocus] = useState<number>(65);

  const categories = ['All', 'Teaching', 'Research', 'Education', 'Fellowship'];

  // Ref for the vertical scrolling timeline container
  const timelineTrackRef = useRef<HTMLDivElement>(null);

  // Scroll tracking across the vertical timeline track
  const { scrollYProgress } = useScroll({
    target: timelineTrackRef,
    offset: ["start 70%", "end 45%"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001
  });

  // Numeric percentage calculation for the HUD
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  scrollYProgress.on("change", (latest) => {
    setScrollPercent(Math.round(latest * 100));
  });

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    return SHUVRO_SEN_CV.trajectory.filter((m) => {
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      const matchesYear = m.startYear <= activeYearFilter;
      return matchesCategory && matchesYear;
    });
  }, [selectedCategory, activeYearFilter]);

  // Handle milestone coming into center reading view
  const handleMilestoneInView = useCallback((milestone: TrajectoryMilestone, isInView: boolean) => {
    if (isInView) {
      setFocusedMilestoneId(milestone.id);
    }
  }, []);

  const scrollToMilestone = (id: string) => {
    const el = document.getElementById(`milestone-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Real-time simulated future projections (2026-2030) based on user tuning
  const projections = useMemo(() => {
    const baseOutputs = SHUVRO_SEN_CV.metrics.researchOutputs;
    const baseHIndex = SHUVRO_SEN_CV.metrics.hIndex;
    
    // Growth algorithms
    const additionalOutputs = Math.round((researchIntensity / 100) * 8 + (consortiumCollaboration / 100) * 4);
    const projectedHIndex = Math.round(baseHIndex + (researchIntensity / 100) * 5 + (grantFocus / 100) * 3);
    const projectedCitations = Math.round(SHUVRO_SEN_CV.metrics.citationsTotal * (1 + (researchIntensity * 0.012) + (consortiumCollaboration * 0.008)));
    const grantCaptureProbability = Math.round(60 + (grantFocus * 0.25) + (consortiumCollaboration * 0.15));

    return {
      projectedOutputs: baseOutputs + additionalOutputs,
      projectedHIndex: Math.min(24, projectedHIndex),
      projectedCitations,
      grantCaptureProbability: Math.min(96, grantCaptureProbability)
    };
  }, [researchIntensity, consortiumCollaboration, grantFocus]);

  const activeFocusedMilestone = useMemo(() => {
    return SHUVRO_SEN_CV.trajectory.find(m => m.id === focusedMilestoneId) || SHUVRO_SEN_CV.trajectory[0];
  }, [focusedMilestoneId]);

  return (
    <section id="trajectory" className="py-16 md:py-24 border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="space-y-3 mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span>Career Analytics</span>
            <span aria-hidden="true">·</span>
            <span>Vertical Scrolling Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white" style={{ textWrap: 'balance' }}>
            Professional Trajectory & Milestone Dashboard
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
            Tracing Shuvro Sen's progression from academic foundations at University of Dhaka through European Commission Erasmus Mundus scholarship to faculty appointment at Independent University, Bangladesh (IUB). Scroll to illuminate key milestones.
          </p>
        </div>

        {/* Interactive Controls Bar: Category Filters & Year Scrubber */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 sm:p-5 mb-8 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Interactive Segmented Filter Controls */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {cat === 'All' ? 'All Trajectory' : cat}
                </button>
              ))}
            </div>

            {/* Trajectory Year Time Machine Scrubber */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                Timeline Horizon:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="2012"
                  max="2026"
                  step="1"
                  value={activeYearFilter}
                  onChange={(e) => setActiveYearFilter(Number(e.target.value))}
                  className="w-28 sm:w-36 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-xs font-mono font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 tabular-nums">
                  {activeYearFilter === 2026 ? 'Present (2026)' : `Up to ${activeYearFilter}`}
                </span>
              </div>
            </div>

          </div>

          {/* Quick status line */}
          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span>
              Showing {filteredMilestones.length} milestone{filteredMilestones.length !== 1 ? 's' : ''} in view
            </span>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setActiveYearFilter(2026);
              }}
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Live Scroll Navigation & Active Era Indicator Bar */}
        <div className="sticky top-20 z-30 mb-8 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-xl border border-neutral-200/90 dark:border-neutral-800 p-3 sm:p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            
            {/* Active Milestone In-Focus Badge */}
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Active Scroll Focus:</span>
              </span>
              <span className="font-medium text-neutral-900 dark:text-white truncate">
                {activeFocusedMilestone.role} · {activeFocusedMilestone.institution}
              </span>
              <span className="hidden md:inline font-mono text-neutral-400 dark:text-neutral-500 shrink-0">
                ({activeFocusedMilestone.period})
              </span>
            </div>

            {/* Quick jump navigation dots across milestones */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              <span className="text-[11px] text-neutral-400 mr-1 hidden lg:inline">Jump to:</span>
              {filteredMilestones.map((m) => {
                const isSelected = m.id === focusedMilestoneId;
                return (
                  <button
                    key={m.id}
                    onClick={() => scrollToMilestone(m.id)}
                    className={`px-2 py-1 text-[11px] font-mono rounded transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                    title={`${m.role} (${m.period})`}
                  >
                    {m.startYear}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Scroll Progress Bar */}
          <div className="mt-2.5 h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div 
              style={{ scaleX: scaleY, transformOrigin: 'left' }}
              className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-400 rounded-full"
            />
          </div>
        </div>

        {/* Milestone Cards Timeline Track with Vertical Scroll Animation */}
        <div ref={timelineTrackRef} className="relative ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-12">
          
          {/* Base Neutral Vertical Track Line */}
          <div className="absolute left-[2px] sm:left-[5px] top-6 bottom-6 w-0.5 sm:w-1 bg-neutral-200 dark:bg-neutral-800 rounded-full" />

          {/* Animated Scroll Progress Line Beam */}
          <motion.div
            style={{ scaleY, transformOrigin: 'top' }}
            className="absolute left-[2px] sm:left-[5px] top-6 bottom-6 w-0.5 sm:w-1 bg-gradient-to-b from-blue-600 via-emerald-500 to-teal-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] z-0"
          />

          {/* Milestone List */}
          <AnimatePresence mode="popLayout">
            {filteredMilestones.map((milestone, idx) => (
              <TimelineMilestoneCard
                key={milestone.id}
                milestone={milestone}
                index={idx}
                total={filteredMilestones.length}
                onInspect={(m) => setInspectMilestone(m)}
                onInViewChange={handleMilestoneInView}
              />
            ))}
          </AnimatePresence>

          {filteredMilestones.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-500">
              No milestones found for the selected category and timeline range. Try adjusting your filters.
            </div>
          )}
        </div>

        {/* Real-Time Trajectory Simulator / Potential Projection Panel */}
        <div className="mt-16 bg-neutral-900 dark:bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-md">
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>Forward Trajectory Simulator (2026 – 2030)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Simulate Shuvro Sen's Academic & Research Trajectory
            </h3>
            <p className="text-sm text-neutral-300 max-w-2xl">
              Adjust research weighting and international consortium parameters in real-time to project publication velocity, scholarly impact, and grant capture probabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Sliders Column */}
            <div className="lg:col-span-6 space-y-5 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800">
              {/* Slider 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300 font-medium">Empirical Research Allocation</span>
                  <span className="font-mono text-blue-400 tabular-nums font-semibold">{researchIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={researchIntensity}
                  onChange={(e) => setResearchIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-[11px] text-neutral-400 block">
                  Focus on Q1 journal empirical submissions (Current Psychology, JIMA, etc.)
                </span>
              </div>

              {/* Slider 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300 font-medium">European & Global Consortium Reach</span>
                  <span className="font-mono text-emerald-400 tabular-nums font-semibold">{consortiumCollaboration}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={consortiumCollaboration}
                  onChange={(e) => setConsortiumCollaboration(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <span className="text-[11px] text-neutral-400 block">
                  Erasmus Mundus partner universities (UCD Ireland, NOVA FCSH, Poznan, Danube)
                </span>
              </div>

              {/* Slider 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-300 font-medium">Industry 5.0 Policy & Grant Focus</span>
                  <span className="font-mono text-purple-400 tabular-nums font-semibold">{grantFocus}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={grantFocus}
                  onChange={(e) => setGrantFocus(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-[11px] text-neutral-400 block">
                  Targeting Horizon Europe, FES economy transitions, and circular supply chain grants
                </span>
              </div>
            </div>

            {/* Real-Time Projected Outcomes Display */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                  Projected Research Outputs
                </span>
                <div className="text-3xl font-bold font-mono text-white tabular-nums">
                  {projections.projectedOutputs}
                </div>
                <div className="text-xs text-blue-400">
                  +{projections.projectedOutputs - SHUVRO_SEN_CV.metrics.researchOutputs} over 36 months
                </div>
              </div>

              <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                  Projected h-index
                </span>
                <div className="text-3xl font-bold font-mono text-white tabular-nums">
                  {projections.projectedHIndex}
                </div>
                <div className="text-xs text-emerald-400">
                  From baseline 9 to {projections.projectedHIndex}
                </div>
              </div>

              <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                  Estimated Total Citations
                </span>
                <div className="text-3xl font-bold font-mono text-white tabular-nums">
                  {projections.projectedCitations}
                </div>
                <div className="text-xs text-neutral-400">
                  Global academic reach
                </div>
              </div>

              <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400 uppercase tracking-wider block">
                  Grant Capture Feasibility
                </span>
                <div className="text-3xl font-bold font-mono text-white tabular-nums">
                  {projections.grantCaptureProbability}%
                </div>
                <div className="text-xs text-purple-400">
                  EU & Multilateral funding
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Milestone Detail Inspection Modal */}
      {inspectMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-2xl w-full border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                  {inspectMilestone.category} · {inspectMilestone.period}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {inspectMilestone.role}
                </h3>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  {inspectMilestone.institution} · {inspectMilestone.location}
                </p>
              </div>
              <button
                onClick={() => setInspectMilestone(null)}
                className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-5 text-sm">
              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-1.5">
                  Institutional Context & Engagement Scope
                </h4>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {inspectMilestone.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                  Documented Contributions in CV
                </h4>
                <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-300">
                  {inspectMilestone.keyContributions.map((kc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                      <span>{kc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-neutral-900 dark:text-white mb-1.5">
                  Outputs Produced
                </h4>
                <div className="flex flex-wrap gap-2">
                  {inspectMilestone.outputs.map((out, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                    >
                      {out}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs font-medium text-neutral-500 block mb-1">
                  Empirical Methodology & Software Stack:
                </span>
                <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300">
                  {inspectMilestone.toolsUsed.join(' · ')}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setInspectMilestone(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
