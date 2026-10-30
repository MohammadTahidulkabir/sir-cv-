/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, ExternalLink, ShieldCheck, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl = '/assets/aistudio/Shuvro_Sen_CV-1_664242a1.pdf'
}) => {
  const [zoom, setZoom] = useState<number>(100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-5xl w-full h-[92vh] border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-tight">
                Shuvro_Sen_CV-1.pdf
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono">
                Official Curriculum Vitae · Verified Original Document
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-mono">
              <button
                onClick={() => setZoom(Math.max(70, zoom - 15))}
                className="p-1 hover:text-blue-600 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 tabular-nums">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(160, zoom + 15))}
                className="p-1 hover:text-blue-600 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="p-1 hover:text-blue-600 transition-colors ml-1 text-neutral-400"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <a
              href={pdfUrl}
              download="Shuvro_Sen_CV_Official.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close PDF Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded PDF Viewer Viewport */}
        <div className="flex-1 bg-neutral-100 dark:bg-neutral-950 p-2 sm:p-4 overflow-auto flex justify-center items-start">
          <div 
            className="w-full h-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-200"
            style={{ width: `${zoom}%` }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0`}
              title="Shuvro Sen Official CV"
              className="w-full h-full min-h-[500px] border-0"
            />
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
          <span className="truncate">
            Source: <code className="font-mono text-[11px]">/public/assets/aistudio/Shuvro_Sen_CV-1_664242a1.pdf</code>
          </span>
          <span className="text-[11px] font-mono shrink-0 ml-2">
            2 Pages · PDF
          </span>
        </div>

      </div>
    </div>
  );
};
