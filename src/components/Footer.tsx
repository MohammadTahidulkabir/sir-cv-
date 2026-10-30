/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUp, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { SHUVRO_SEN_CV } from '../data/cvData.ts';

interface FooterProps {
  onOpenPdfViewer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPdfViewer }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-100 dark:border-neutral-900">
          <div>
            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
              Shuvro Sen
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Lecturer in General Management · Independent University, Bangladesh (IUB)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-600 dark:text-neutral-400">
            <a href="#overview" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Overview</a>
            <a href="#trajectory" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Trajectory</a>
            <a href="#skills" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Skills Analysis</a>
            <a href="#publications" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Publications</a>
            <a 
              href={SHUVRO_SEN_CV.contact.googleScholar} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
            >
              <span>Google Scholar (2,035+ Cites)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="#vault" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Document Vault</a>
            <button onClick={onOpenPdfViewer} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Original CV (PDF)
            </button>
          </div>


          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <p>
            © {new Date().getFullYear()} Shuvro Sen. Academic Portfolio & Trajectory Dashboard.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Erasmus Mundus Scholar Verified</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
