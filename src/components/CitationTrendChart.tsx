/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { CitationYearData } from '../data/cvData.ts';

interface CitationTrendChartProps {
  data: CitationYearData[];
  height?: number;
  width?: number;
  color?: string;
  showLabels?: boolean;
}

export const CitationTrendChart: React.FC<CitationTrendChartProps> = ({
  data,
  height = 54,
  width = 160,
  color = '#10B981', // Emerald
  showLabels = true
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<CitationYearData | null>(null);

  if (!data || data.length === 0) return null;

  const paddingX = 8;
  const paddingY = 8;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  const minCount = 0;
  const maxCount = Math.max(...data.map(d => d.count), 1);

  // Generate SVG coordinates
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * graphWidth;
    const y = height - paddingY - ((d.count - minCount) / (maxCount - minCount)) * graphHeight;
    return { x, y, data: d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  const gradientId = `citation-grad-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="relative inline-flex flex-col items-start select-none">
      
      {/* SVG Sparkline Container */}
      <div 
        className="relative cursor-crosshair group/chart"
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Shaded Area Under Curve */}
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            className="transition-all duration-300"
          />

          {/* Stroke Trend Curve */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Interactive Data Points */}
          {points.map((p, i) => {
            const isHovered = hoveredPoint?.year === p.data.year;
            return (
              <g key={i}>
                {/* Hit area for easy mouse tracking */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="7"
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint(p.data)}
                  className="cursor-pointer"
                />

                {/* Visible dot (always on endpoints, or when hovered) */}
                {(isHovered || i === 0 || i === points.length - 1) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 4.5 : 2.5}
                    fill={isHovered ? '#FFFFFF' : color}
                    stroke={color}
                    strokeWidth={isHovered ? 2.5 : 1}
                    className="transition-all duration-200"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div 
            className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none z-20 px-2 py-0.5 rounded bg-neutral-900/90 text-white text-[10px] font-mono whitespace-nowrap shadow-md backdrop-blur-xs flex items-center gap-1 border border-neutral-700"
          >
            <span className="text-neutral-300 font-semibold">{hoveredPoint.year}:</span>
            <span className="text-emerald-400 font-bold tabular-nums">{hoveredPoint.count} cites</span>
          </div>
        )}
      </div>

      {/* Axis Baseline Label Range */}
      {showLabels && (
        <div className="w-full flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 font-mono pt-1">
          <span>{data[0].year}</span>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-sans font-medium flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>trend</span>
          </span>
          <span>{data[data.length - 1].year}</span>
        </div>
      )}

    </div>
  );
};
