/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  BarChart2, 
  Cpu, 
  BookOpen, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  RefreshCw,
  Compass,
  Zap
} from 'lucide-react';
import { SHUVRO_SEN_CV, SkillCategory } from '../data/cvData.ts';

export const SkillAnalysis: React.FC = () => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [expandedSubskill, setExpandedSubskill] = useState<string | null>(null);
  const [isSimulatingPotential, setIsSimulatingPotential] = useState<boolean>(true);
  const [potentialGrowthFactor, setPotentialGrowthFactor] = useState<number>(20); // 0 to 40% growth projection

  const currentCategory = SHUVRO_SEN_CV.skills[activeCategoryIndex];

  // Radar points calculation for current category subskills
  const subskills = currentCategory.subskills;
  const numAxes = subskills.length;
  const centerX = 160;
  const centerY = 160;
  const radius = 110;

  // Compute baseline radar polygon coordinates
  const getCoordinates = (level: number, index: number, total: number, boost = 0) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const effectiveLevel = Math.min(100, level + (isSimulatingPotential ? boost : 0));
    const r = (effectiveLevel / 100) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y };
  };

  const baselinePoints = subskills.map((s, i) => getCoordinates(s.level, i, numAxes, 0));
  const potentialPoints = subskills.map((s, i) => getCoordinates(s.level, i, numAxes, potentialGrowthFactor));

  const baselinePath = baselinePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';
  const potentialPath = potentialPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  // Overall calculated aggregate index
  const aggregateScore = Math.round(
    SHUVRO_SEN_CV.skills.reduce((acc, cat) => acc + cat.proficiencyScore, 0) / SHUVRO_SEN_CV.skills.length
  );

  const potentialAggregateScore = Math.min(99, Math.round(aggregateScore * (1 + potentialGrowthFactor / 100)));

  return (
    <section id="skills" className="py-16 md:py-24 border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="space-y-3 mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
            <Zap className="w-4 h-4" />
            <span>Empirical Competency Matrix</span>
            <span aria-hidden="true">·</span>
            <span>Potential Animation Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white" style={{ textWrap: 'balance' }}>
            Skills Analysis & Research Potential Engine
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-3xl">
            Rigorous breakdown of Shuvro Sen's multi-method expertise spanning quantitative econometric tools (R, SPSS), qualitative inquiry (NVivo, Grounded Theory), and systemic sustainability transitions.
          </p>
        </div>

        {/* 4 Core Competency Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SHUVRO_SEN_CV.skills.map((skill, idx) => {
            const isActive = activeCategoryIndex === idx;
            return (
              <button
                key={skill.name}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  isActive
                    ? 'bg-white dark:bg-neutral-900 border-blue-500 dark:border-blue-500 shadow-sm ring-1 ring-blue-500'
                    : 'bg-white/80 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-neutral-500 dark:text-neutral-400">
                    Domain 0{idx + 1}
                  </span>
                  <span className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                    {skill.proficiencyScore}%
                  </span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-1 mb-1">
                  {skill.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                  {skill.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Split Pane: Left Radar & Potential Simulator, Right Detailed Subskill Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Animated Radar & Potential Animation Engine */}
          <div className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-xs font-mono text-neutral-400 uppercase">Radar Visualization</span>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                  {currentCategory.name}
                </h4>
              </div>

              {/* Potential Animation Toggle */}
              <button
                onClick={() => setIsSimulatingPotential(!isSimulatingPotential)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isSimulatingPotential
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSimulatingPotential ? 'Potential Active' : 'Show Potential'}</span>
              </button>
            </div>

            {/* Animated SVG Spider Radar Chart */}
            <div className="relative flex justify-center items-center py-2">
              <svg width="320" height="320" viewBox="0 0 320 320" className="overflow-visible">
                {/* Concentric spider rings */}
                {[0.25, 0.5, 0.75, 1].map((pct, ringIdx) => {
                  const ringRadius = radius * pct;
                  return (
                    <circle
                      key={ringIdx}
                      cx={centerX}
                      cy={centerY}
                      r={ringRadius}
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={pct === 1 ? 'none' : '3 3'}
                      className="text-neutral-200 dark:text-neutral-800"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Axes lines */}
                {subskills.map((_, i) => {
                  const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
                  const x2 = centerX + radius * Math.cos(angle);
                  const y2 = centerY + radius * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={centerX}
                      y1={centerY}
                      x2={x2}
                      y2={y2}
                      stroke="currentColor"
                      className="text-neutral-200 dark:text-neutral-800"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Potential Expansion Area (Animated with CSS transition) */}
                {isSimulatingPotential && (
                  <path
                    d={potentialPath}
                    fill="rgba(59, 130, 246, 0.15)"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="transition-all duration-700 ease-out"
                  />
                )}

                {/* Baseline Competency Polygon */}
                <path
                  d={baselinePath}
                  fill="rgba(37, 99, 235, 0.35)"
                  stroke="#1D4ED8"
                  strokeWidth="2.5"
                  className="transition-all duration-500 ease-in-out"
                />

                {/* Vertex Points & Labels */}
                {subskills.map((sub, i) => {
                  const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
                  const pt = baselinePoints[i];
                  const labelR = radius + 24;
                  const lx = centerX + labelR * Math.cos(angle);
                  const ly = centerY + labelR * Math.sin(angle);
                  
                  return (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4"
                        fill="#1D4ED8"
                        className="transition-all duration-500"
                      />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[10px] font-medium fill-neutral-700 dark:fill-neutral-300 font-sans"
                      >
                        {sub.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Potential Animation Controls */}
            {isSimulatingPotential && (
              <div className="bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Projected Growth Horizon Vector:</span>
                  </span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold tabular-nums">
                    +{potentialGrowthFactor}% Expansion
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="5"
                  value={potentialGrowthFactor}
                  onChange={(e) => setPotentialGrowthFactor(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                  <span>1-Year Near Horizon</span>
                  <span>3-Year Lead PI Potential</span>
                </div>
              </div>
            )}

            {/* Quick Potential Stats */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
                  Current Domain Mastery
                </span>
                <span className="text-xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                  {currentCategory.proficiencyScore}%
                </span>
              </div>
              <div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
                  Projected Potential Peak
                </span>
                <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                  {Math.min(99, Math.round(currentCategory.proficiencyScore * (1 + potentialGrowthFactor / 100)))}%
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: In-Depth Subskill Breakdown & CV Grounded Proof */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Domain Overview Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Domain Competency Breakdown
                  </span>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                    {currentCategory.name}
                  </h3>
                </div>
                <div className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                  Evidence-Grounded
                </div>
              </div>

              {/* Exact Proof Extracted from Shuvro's CV */}
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/80 dark:border-neutral-700/70">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider block mb-1">
                  Documented CV Verification & Empirical Track Record:
                </span>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {currentCategory.evidence}
                </p>
              </div>

              {/* Subskills Interactive Sliders / Level Indicators */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                  Specific Methodological Proficiencies:
                </span>

                {currentCategory.subskills.map((sub) => {
                  const isExpanded = expandedSubskill === sub.name;
                  const animatedLevel = isSimulatingPotential 
                    ? Math.min(99, Math.round(sub.level + (potentialGrowthFactor * 0.7)))
                    : sub.level;

                  return (
                    <div 
                      key={sub.name}
                      className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="space-y-0.5">
                          <span className="text-sm font-bold text-neutral-900 dark:text-white">
                            {sub.name}
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 block">
                            {sub.description}
                          </span>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                            {animatedLevel}%
                          </span>
                          {isSimulatingPotential && (
                            <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                              +{animatedLevel - sub.level}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden relative">
                        <div 
                          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${animatedLevel}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Cross-Disciplinary Synergy Matrix Callout */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-xs">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">
                Multi-Methodological Synthesis (R + SPSS + NVivo)
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                What distinguishes Shuvro Sen's academic profile is the simultaneous mastery of quantitative econometric testing (R, SPSS, SEM) alongside rigorous qualitative grounded theory coding (NVivo, stakeholder interviews). This dual competence enables high-fidelity multi-tier supply chain audits and social justice policy formulation.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
                  <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">R & SPSS</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Quantitative SEM</div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">NVivo</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Qualitative Coding</div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
                  <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">PRISMA</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">150+ Systematic Lit</div>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
                  <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">Industry 5.0</div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Human-Centric Tech</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
