/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { MapPin, ChevronRight, CheckCircle2, Sparkles, Compass } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { TrajectoryMilestone } from '../data/cvData.ts';

interface TimelineMilestoneCardProps {
  milestone: TrajectoryMilestone;
  index: number;
  total: number;
  onInspect: (milestone: TrajectoryMilestone) => void;
  onInViewChange?: (milestone: TrajectoryMilestone, isInView: boolean) => void;
}

export const TimelineMilestoneCard: React.FC<TimelineMilestoneCardProps> = ({
  milestone,
  index,
  total,
  onInspect,
  onInViewChange
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Detects when the milestone card is in the vertical center focal zone of the viewport
  const isInView = useInView(cardRef, {
    margin: "-22% 0px -32% 0px",
    amount: 0.25
  });

  useEffect(() => {
    if (onInViewChange) {
      onInViewChange(milestone, isInView);
    }
  }, [isInView, milestone, onInViewChange]);

  const categoryColor = {
    Teaching: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
    Research: 'text-blue-600 dark:text-blue-400 border-blue-500/40',
    Education: 'text-purple-600 dark:text-purple-400 border-purple-500/40',
    Fellowship: 'text-amber-600 dark:text-amber-400 border-amber-500/40'
  }[milestone.category] || 'text-neutral-600 border-neutral-400';

  return (
    <motion.div
      id={`milestone-${milestone.id}`}
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="relative group transition-all duration-300"
    >
      {/* Interactive Timeline Node on the Left Vertical Track */}
      <div className="absolute -left-[35px] sm:-left-[43px] top-6 z-10">
        <div className="relative flex items-center justify-center">
          {/* Pulsing Aura Wave when active in scroll view */}
          {isInView && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-8 h-8 rounded-full bg-emerald-500/30 dark:bg-emerald-400/25 pointer-events-none"
            />
          )}

          {/* Node core dot */}
          <motion.div
            animate={{
              scale: isInView ? 1.25 : 1,
              borderColor: isInView ? '#10B981' : '#CBD5E1'
            }}
            transition={{ duration: 0.3 }}
            className={`w-5 h-5 rounded-full bg-white dark:bg-neutral-950 border-[3px] shadow-sm flex items-center justify-center transition-colors ${
              isInView 
                ? 'border-emerald-500 dark:border-emerald-400 shadow-md shadow-emerald-500/20' 
                : 'border-neutral-300 dark:border-neutral-700'
            }`}
          >
            {/* Center dot bead */}
            <div 
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                isInView 
                  ? 'bg-emerald-500 dark:bg-emerald-400 shadow-xs' 
                  : 'bg-neutral-400 dark:bg-neutral-600'
              }`} 
            />
          </motion.div>
        </div>
      </div>

      {/* Milestone Content Card */}
      <div 
        className={`relative rounded-xl border p-5 sm:p-6 transition-all duration-300 shadow-xs ${
          isInView
            ? 'bg-white dark:bg-neutral-900 border-emerald-500/60 dark:border-emerald-400/50 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500/20 dark:ring-emerald-400/20'
            : 'bg-white/85 dark:bg-neutral-900/80 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
        }`}
      >
        {/* Subtle Ambient Accent Beam on Left Border of Card when in View */}
        <div 
          className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all duration-300 ${
            isInView ? 'bg-emerald-500 dark:bg-emerald-400 opacity-100' : 'bg-transparent opacity-0'
          }`}
        />

        <div className="space-y-4">
          
          {/* Card Top Metadata & In-View Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className={`tabular-nums font-bold transition-colors ${isInView ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  {milestone.period}
                </span>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                  {milestone.category}
                </span>
                {isInView && (
                  <>
                    <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      In Focus
                    </span>
                  </>
                )}
              </div>

              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-1 leading-snug">
                {milestone.role}
              </h3>
              
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {milestone.institution}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap shrink-0">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{milestone.location}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {milestone.description}
          </p>

          {/* Key Contributions List */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              Core Empirical Contributions & Highlights:
            </span>
            <ul className="space-y-1 text-xs text-neutral-700 dark:text-neutral-300">
              {milestone.keyContributions.map((contrib, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className={`mt-0.5 font-bold transition-colors ${isInView ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'}`} aria-hidden="true">
                    ›
                  </span>
                  <span>{contrib}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Metadata Footer: Tools Used & Inspect Button */}
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">Methods & Tools:</span>
              <span className="text-neutral-600 dark:text-neutral-400 font-mono">
                {milestone.toolsUsed.join(' · ')}
              </span>
            </div>

            <button
              onClick={() => onInspect(milestone)}
              className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <span>Inspect Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
