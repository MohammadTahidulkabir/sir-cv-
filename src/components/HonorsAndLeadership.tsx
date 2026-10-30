/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Users, Globe, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { SHUVRO_SEN_CV } from '../data/cvData.ts';

export const HonorsAndLeadership: React.FC = () => {
  return (
    <section className="py-16 md:py-24 border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Awards & Competitive Fellowships */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                <Award className="w-4 h-4" />
                <span>Recognition & Merit</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Awards & Competitive Fellowships
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Recognized internationally and domestically for academic excellence, innovative empirical research, and policy dissemination.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {SHUVRO_SEN_CV.awards.map((award, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                      {award.title}
                    </h4>
                    <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums shrink-0">
                      {award.year}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {award.organization}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {award.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Leadership, Outreach & Consortium Network */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                <Users className="w-4 h-4" />
                <span>Global Outreach</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Leadership & Engagement
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Bridging institutional research with community impact and European alumni coordination.
              </p>
            </div>

            {/* Erasmus Mundus Association Leadership Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  Leadership Role
                </span>
                <span className="text-xs font-mono text-neutral-400">Ongoing</span>
              </div>
              <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                Coordinator, Public Relations
              </h4>
              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Erasmus Mundus Association Bangladesh
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Coordinated stakeholder engagement and promotional activities for the Erasmus Mundus Association Bangladesh, supporting student outreach initiatives and mentorship for emerging South Asian scholars.
              </p>
            </div>

            {/* Academic Dissemination & Policy Dialogues */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                Policy & Academic Dissemination
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                {SHUVRO_SEN_CV.academicEngagement.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Consortium Mobility Map Card */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-neutral-900 dark:to-neutral-900 rounded-xl border border-blue-100 dark:border-neutral-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block">
                European Consortium Network
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                Academic collaboration across University College Dublin (Ireland), NOVA FCSH (Portugal), Poznan University of Economics and Business (Poland), and Danube University Krems (Austria).
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
