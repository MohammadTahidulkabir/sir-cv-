/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  BookOpen, 
  Quote, 
  TrendingUp, 
  Maximize2,
  Filter,
  Info,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SHUVRO_SEN_CV, Publication } from '../data/cvData.ts';

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  type: 'theme' | 'publication';
  label: string;
  radius: number;
  color: string;
  publication?: Publication;
  connectedCount?: number;
  themeCategory?: string;
  citations?: number;
  tier?: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'pub-theme' | 'theme-cross';
  value: number;
}

const THEME_COLORS: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  "Sustainable Supply Chain Management": { bg: "#059669", border: "#10b981", glow: "rgba(16, 185, 129, 0.4)", text: "#ecfdf5" },
  "Industry 5.0": { bg: "#0284c7", border: "#38bdf8", glow: "rgba(56, 189, 248, 0.4)", text: "#f0f9ff" },
  "Digital Transformation": { bg: "#6366f1", border: "#818cf8", glow: "rgba(129, 140, 248, 0.4)", text: "#eef2ff" },
  "Circular Economy": { bg: "#d97706", border: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", text: "#fffbeb" },
  "Bioeconomy": { bg: "#65a30d", border: "#84cc16", glow: "rgba(132, 204, 22, 0.4)", text: "#f7fee7" },
  "Supply Chain Resilience": { bg: "#e11d48", border: "#f43f5e", glow: "rgba(244, 63, 94, 0.4)", text: "#fff1f2" }
};

const TIER_COLORS: Record<string, string> = {
  'Q1': '#10b981',
  'Q2': '#3b82f6',
  'Book Chapter': '#f59e0b',
  'Policy Report': '#8b5cf6'
};

const CROSS_THEME_LINKS = [
  { source: "Sustainable Supply Chain Management", target: "Supply Chain Resilience" },
  { source: "Sustainable Supply Chain Management", target: "Circular Economy" },
  { source: "Circular Economy", target: "Bioeconomy" },
  { source: "Industry 5.0", target: "Digital Transformation" },
  { source: "Supply Chain Resilience", target: "Industry 5.0" }
];

interface ResearchNetworkGraphProps {
  onSelectPublication?: (pub: Publication) => void;
}

export const ResearchNetworkGraph: React.FC<ResearchNetworkGraphProps> = ({ onSelectPublication }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Filter States
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [showCrossLinks, setShowCrossLinks] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Inspection states
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [copiedBibtex, setCopiedBibtex] = useState<boolean>(false);

  // Zoom reference
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Build the network data
  const { nodes, links, connectedMap } = useMemo(() => {
    const rawNodes: GraphNode[] = [];
    const rawLinks: GraphLink[] = [];
    const connected = new Map<string, Set<string>>();

    const addEdge = (src: string, tgt: string, type: 'pub-theme' | 'theme-cross', value: number) => {
      rawLinks.push({ source: src, target: tgt, type, value });
      if (!connected.has(src)) connected.set(src, new Set());
      if (!connected.has(tgt)) connected.set(tgt, new Set());
      connected.get(src)!.add(tgt);
      connected.get(tgt)!.add(src);
    };

    // 1. Add Theme Hub Nodes
    SHUVRO_SEN_CV.researchInterests.forEach(theme => {
      const config = THEME_COLORS[theme] || { bg: "#0d9488", border: "#14b8a6", glow: "rgba(20, 184, 166, 0.4)", text: "#f0fdfa" };
      rawNodes.push({
        id: theme,
        type: 'theme',
        label: theme,
        radius: 28,
        color: config.border,
        themeCategory: theme,
        connectedCount: 0
      });
    });

    // 2. Add Publication Nodes
    SHUVRO_SEN_CV.publications.forEach(pub => {
      // Calculate radius based on citations with smooth logarithmic scaling
      const baseRadius = 12;
      const citationBonus = Math.min(18, Math.log10(pub.citations + 1) * 5.2);
      const radius = Math.round(baseRadius + citationBonus);

      const pubNodeId = pub.id;
      rawNodes.push({
        id: pubNodeId,
        type: 'publication',
        label: pub.title,
        radius,
        color: TIER_COLORS[pub.tier] || '#10b981',
        publication: pub,
        citations: pub.citations,
        tier: pub.tier
      });

      // Connect to associated themes
      const topics = pub.topics || [];
      topics.forEach(t => {
        if (SHUVRO_SEN_CV.researchInterests.includes(t)) {
          addEdge(pubNodeId, t, 'pub-theme', 1.5);
          // Increment theme counter
          const themeNode = rawNodes.find(n => n.id === t);
          if (themeNode) {
            themeNode.connectedCount = (themeNode.connectedCount || 0) + 1;
          }
        }
      });
    });

    // 3. Add Cross-Theme Bridges
    CROSS_THEME_LINKS.forEach(cross => {
      addEdge(cross.source, cross.target, 'theme-cross', 0.8);
    });

    return { nodes: rawNodes, links: rawLinks, connectedMap: connected };
  }, []);

  // Filtered nodes and links based on UI selections
  const { filteredNodes, filteredLinks } = useMemo(() => {
    let activeNodes = [...nodes];

    // Filter by tier
    if (selectedTier !== 'All') {
      activeNodes = activeNodes.filter(n => {
        if (n.type === 'theme') return true;
        return n.publication?.tier === selectedTier;
      });
    }

    // Filter by theme
    if (selectedTheme) {
      const allowedPubIds = new Set<string>();
      links.forEach(l => {
        const srcId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
        const tgtId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
        if (srcId === selectedTheme) allowedPubIds.add(tgtId);
        if (tgtId === selectedTheme) allowedPubIds.add(srcId);
      });

      activeNodes = activeNodes.filter(n => {
        if (n.id === selectedTheme) return true;
        return allowedPubIds.has(n.id);
      });
    }

    const activeNodeIds = new Set(activeNodes.map(n => n.id));

    let activeLinks = links.filter(l => {
      const srcId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
      const tgtId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
      return activeNodeIds.has(srcId) && activeNodeIds.has(tgtId);
    });

    if (!showCrossLinks) {
      activeLinks = activeLinks.filter(l => l.type !== 'theme-cross');
    }

    return { filteredNodes: activeNodes, filteredLinks: activeLinks };
  }, [nodes, links, selectedTheme, selectedTier, showCrossLinks]);

  // Set up D3 simulation
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 560;

    svg.selectAll('*').remove();

    // Create main zoomable group
    const g = svg.append('g').attr('class', 'graph-viewport');

    // Define defs (glow filters, gradients, markers)
    const defs = svg.append('defs');

    // Glow filter for theme hubs
    const filter = defs.append('filter')
      .attr('id', 'hub-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Zoom setup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.35, 2.8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Center initial view
    svg.call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));

    // Deep clone data for simulation to avoid mutative issues on re-render
    const simNodes: GraphNode[] = filteredNodes.map(d => ({ ...d }));
    const simLinks: GraphLink[] = filteredLinks.map(d => ({
      source: typeof d.source === 'object' ? (d.source as GraphNode).id : d.source,
      target: typeof d.target === 'object' ? (d.target as GraphNode).id : d.target,
      type: d.type,
      value: d.value
    }));

    // Setup Force Simulation
    const simulation = d3.forceSimulation<GraphNode>(simNodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(simLinks)
        .id(d => d.id)
        .distance(d => d.type === 'theme-cross' ? 175 : 95)
        .strength(d => d.type === 'theme-cross' ? 0.35 : 0.8)
      )
      .force('charge', d3.forceManyBody<GraphNode>()
        .strength(d => d.type === 'theme' ? -480 : -220)
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius(d => d.radius + 16).iterations(3));

    // Render Links Group
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup.selectAll<SVGLineElement, GraphLink>('line')
      .data(simLinks)
      .enter()
      .append('line')
      .attr('stroke', d => d.type === 'theme-cross' ? '#94a3b8' : '#cbd5e1')
      .attr('stroke-opacity', d => d.type === 'theme-cross' ? 0.45 : 0.6)
      .attr('stroke-width', d => d.type === 'theme-cross' ? 1.5 : 2)
      .attr('stroke-dasharray', d => d.type === 'theme-cross' ? '4,4' : 'none')
      .attr('class', 'transition-opacity duration-200');

    // Render Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup.selectAll<SVGGElement, GraphNode>('g')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('class', 'cursor-pointer select-none group')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Node Outer Ring / Aura for Theme Hubs
    node.filter(d => d.type === 'theme')
      .append('circle')
      .attr('r', d => d.radius + 6)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.4)
      .attr('stroke-dasharray', '3,3')
      .attr('class', 'animate-pulse');

    // Node Core Circles
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => {
        if (d.type === 'theme') {
          const cfg = THEME_COLORS[d.id];
          return cfg ? cfg.bg : d.color;
        }
        return d.color;
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', d => d.type === 'theme' ? 3 : 2)
      .attr('filter', d => d.type === 'theme' ? 'url(#hub-glow)' : 'none')
      .attr('class', 'transition-transform duration-150 shadow-md');

    // Icon / Metric inside Theme Hub
    node.filter(d => d.type === 'theme')
      .append('text')
      .text(d => `${d.connectedCount || 0} papers`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none');

    // Citation badge inside publication circles
    node.filter(d => d.type === 'publication' && (d.citations || 0) > 0)
      .append('text')
      .text(d => {
        const c = d.citations || 0;
        return c > 999 ? `${(c / 1000).toFixed(1)}k` : `${c}`;
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#ffffff')
      .attr('font-size', d => d.radius > 16 ? '10px' : '8px')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none');

    // Label Group for Nodes
    const labels = node.append('g')
      .attr('transform', d => `translate(0, ${d.radius + 14})`)
      .attr('opacity', showLabels ? 1 : 0)
      .attr('class', 'transition-opacity duration-200');

    // Label background pill for crisp legibility
    labels.append('rect')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('fill', 'rgba(15, 23, 42, 0.85)')
      .attr('stroke', 'rgba(255, 255, 255, 0.15)')
      .attr('stroke-width', 0.5);

    // Label Text
    labels.append('text')
      .text(d => {
        if (d.type === 'theme') return d.label;
        // Truncate paper titles
        const words = d.label.split(' ');
        return words.length > 4 ? words.slice(0, 4).join(' ') + '…' : d.label;
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.32em')
      .attr('fill', '#f8fafc')
      .attr('font-size', d => d.type === 'theme' ? '11px' : '9.5px')
      .attr('font-weight', d => d.type === 'theme' ? '700' : '500')
      .attr('letter-spacing', '0.02em');

    // Size the label background rects dynamically
    labels.selectAll<SVGRectElement, GraphNode>('rect')
      .each(function () {
        const textElem = (this.parentNode as SVGGElement)?.querySelector('text');
        if (textElem) {
          const bbox = textElem.getBBox();
          d3.select(this)
            .attr('x', bbox.x - 6)
            .attr('y', bbox.y - 3)
            .attr('width', bbox.width + 12)
            .attr('height', bbox.height + 6);
        }
      });

    // Interactivity: Hover & Click
    node
      .on('mouseenter', (event, d) => {
        setHoveredNodeId(d.id);
        const neighbors = connectedMap.get(d.id) || new Set();

        // Highlight connected links
        link
          .attr('stroke-opacity', l => {
            const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
            const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
            return (sId === d.id || tId === d.id) ? 0.95 : 0.1;
          })
          .attr('stroke-width', l => {
            const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
            const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
            return (sId === d.id || tId === d.id) ? 3.5 : 1;
          })
          .attr('stroke', l => {
            const sId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source;
            const tId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target;
            return (sId === d.id || tId === d.id) ? '#10b981' : '#94a3b8';
          });

        // Dim non-neighbor nodes
        node.attr('opacity', n => {
          if (n.id === d.id || neighbors.has(n.id)) return 1;
          return 0.2;
        });
      })
      .on('mouseleave', () => {
        setHoveredNodeId(null);
        // Reset styles
        link
          .attr('stroke-opacity', l => l.type === 'theme-cross' ? 0.45 : 0.6)
          .attr('stroke-width', l => l.type === 'theme-cross' ? 1.5 : 2)
          .attr('stroke', l => l.type === 'theme-cross' ? '#94a3b8' : '#cbd5e1');
        node.attr('opacity', 1);
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        if (d.type === 'publication' && d.publication && onSelectPublication) {
          onSelectPublication(d.publication);
        }
      });

    // Simulation Tick Updates
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x || 0)
        .attr('y1', d => (d.source as GraphNode).y || 0)
        .attr('x2', d => (d.target as GraphNode).x || 0)
        .attr('y2', d => (d.target as GraphNode).y || 0);

      node.attr('transform', d => `translate(${d.x || 0}, ${d.y || 0})`);
    });

    // Canvas click clears selection
    svg.on('click', () => {
      setSelectedNode(null);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks, connectedMap, showLabels]);

  // Zoom control helpers
  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.77);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(500).call(
      zoomBehaviorRef.current.transform,
      d3.zoomIdentity
    );
  };

  // Connected items for selected node
  const activeInspectionDetails = useMemo(() => {
    if (!selectedNode) return null;

    if (selectedNode.type === 'publication' && selectedNode.publication) {
      return {
        type: 'publication' as const,
        pub: selectedNode.publication,
        themes: selectedNode.publication.topics || []
      };
    }

    if (selectedNode.type === 'theme') {
      const relatedPubs = SHUVRO_SEN_CV.publications.filter(p => 
        p.topics?.includes(selectedNode.id)
      );
      const totalCites = relatedPubs.reduce((acc, p) => acc + p.citations, 0);
      return {
        type: 'theme' as const,
        themeName: selectedNode.id,
        relatedPubs,
        totalCites,
        config: THEME_COLORS[selectedNode.id]
      };
    }

    return null;
  }, [selectedNode]);

  const handleCopyBibtex = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  return (
    <div className="relative w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 overflow-hidden shadow-sm backdrop-blur-md">
      
      {/* Network Header & Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-neutral-200/80 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Share2 className="w-3.5 h-3.5" />
            <span>Interactive Knowledge Graph</span>
            <span aria-hidden="true">·</span>
            <span>D3 Force Network</span>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
            Research Pillars & Publication Interconnections
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            Explore how peer-reviewed articles link across the 6 core research thematic hubs. Drag nodes, zoom in, or click to inspect papers.
          </p>
        </div>

        {/* View Options & Legend Toggle */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showLabels 
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border-neutral-300 dark:border-neutral-700' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white border-transparent'
            }`}
            title="Toggle node label tags"
          >
            Labels: {showLabels ? 'On' : 'Off'}
          </button>

          <button
            onClick={() => setShowCrossLinks(!showCrossLinks)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showCrossLinks 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white border-transparent'
            }`}
            title="Toggle theoretical cross-discipline bridges"
          >
            Synergies: {showCrossLinks ? 'Shown' : 'Hidden'}
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="px-4 py-2.5 bg-neutral-50/80 dark:bg-neutral-900/60 border-b border-neutral-200/60 dark:border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Research Themes Selector */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Theme:</span>
          </span>
          <button
            onClick={() => setSelectedTheme(null)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              selectedTheme === null
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Themes ({SHUVRO_SEN_CV.researchInterests.length})
          </button>
          {SHUVRO_SEN_CV.researchInterests.map(interest => {
            const isSelected = selectedTheme === interest;
            const cfg = THEME_COLORS[interest];
            return (
              <button
                key={interest}
                onClick={() => setSelectedTheme(isSelected ? null : interest)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'ring-2 ring-emerald-500 text-white font-semibold shadow-xs'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                }`}
                style={{ backgroundColor: isSelected ? cfg?.bg : undefined }}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: cfg?.border || '#10b981' }} 
                />
                <span>{interest}</span>
              </button>
            );
          })}
        </div>

        {/* Tier Filter */}
        <div className="flex items-center gap-1">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium mr-1">Tier:</span>
          {['All', 'Q1', 'Q2', 'Policy Report'].map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                selectedTier === tier
                  ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div 
        ref={containerRef}
        className="relative w-full h-[520px] sm:h-[600px] bg-radial from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900 cursor-grab active:cursor-grabbing overflow-hidden"
      >
        {/* Subtle Background Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.07]">
          <defs>
            <pattern id="network-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-grid)" />
        </svg>

        {/* The D3 SVG Element */}
        <svg 
          ref={svgRef} 
          className="w-full h-full block" 
        />

        {/* Zoom & Reset Floating Overlay Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-md z-10">
          <button
            onClick={handleZoomIn}
            className="p-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-0.5" />
          <button
            onClick={handleResetZoom}
            className="p-2 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            title="Reset Graph Center"
            aria-label="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Legend in Bottom Left */}
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-md text-[11px] text-neutral-600 dark:text-neutral-400 z-10 hidden sm:block max-w-[240px]">
          <div className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>Network Guide</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 bg-emerald-600/30 flex items-center justify-center text-[7px] text-emerald-700 dark:text-emerald-300 font-bold">
                H
              </span>
              <span>Large Hub = Core Research Pillar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Circle Size = Citation Scale</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-neutral-400" />
              <span>Dashed Line = Synergistic Cross-Link</span>
            </div>
          </div>
        </div>

        {/* Selected Node Detail Inspector Card (Bottom Right / Side Drawer) */}
        <AnimatePresence>
          {activeInspectionDetails && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 right-4 max-w-sm sm:max-w-md w-full bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-5 shadow-xl z-20"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {activeInspectionDetails.type === 'publication' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      <BookOpen className="w-3 h-3" />
                      <span>{activeInspectionDetails.pub.tier}</span>
                      <span>·</span>
                      <span>{activeInspectionDetails.pub.year}</span>
                    </span>
                  ) : (
                    <span 
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-white font-medium"
                      style={{ backgroundColor: activeInspectionDetails.config?.bg }}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Research Pillar</span>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="Close inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {activeInspectionDetails.type === 'publication' ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                    {activeInspectionDetails.pub.title}
                  </h4>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    <p className="italic">{activeInspectionDetails.pub.authors}</p>
                    <p className="font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
                      {activeInspectionDetails.pub.journal} {activeInspectionDetails.pub.volume && `(${activeInspectionDetails.pub.volume})`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono py-1 border-y border-neutral-100 dark:border-neutral-800">
                    <div>
                      <span className="text-neutral-400 text-[10px] block">CITATIONS</span>
                      <span className="font-bold text-neutral-900 dark:text-white text-sm">
                        {activeInspectionDetails.pub.citations.toLocaleString()}
                      </span>
                    </div>
                    {activeInspectionDetails.pub.annualGrowthRate && (
                      <div>
                        <span className="text-neutral-400 text-[10px] block">GROWTH</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          +{activeInspectionDetails.pub.annualGrowthRate}% YoY
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Connected Theme Badges */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block mb-1">
                      Connected Research Themes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeInspectionDetails.themes.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTheme(t)}
                          className="px-2 py-0.5 rounded text-[11px] bg-neutral-100 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 transition-colors border border-neutral-200 dark:border-neutral-700"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {activeInspectionDetails.pub.doi && (
                      <a
                        href={activeInspectionDetails.pub.doi.startsWith('10.') ? `https://doi.org/${activeInspectionDetails.pub.doi}` : '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Article / DOI</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleCopyBibtex(activeInspectionDetails.pub.bibtex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBibtex ? 'BibTeX Copied' : 'BibTeX'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                    {activeInspectionDetails.themeName}
                  </h4>
                  <div className="flex items-center gap-4 text-xs font-mono py-1.5 border-y border-neutral-100 dark:border-neutral-800">
                    <div>
                      <span className="text-neutral-400 text-[10px] block">TOTAL PAPERS</span>
                      <span className="font-bold text-neutral-900 dark:text-white text-sm">
                        {activeInspectionDetails.relatedPubs.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[10px] block">THEME CITATIONS</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {activeInspectionDetails.totalCites.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 tracking-wider block mb-1.5">
                      Included Works in this Hub:
                    </span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {activeInspectionDetails.relatedPubs.map(p => (
                        <div
                          key={p.id}
                          onClick={() => {
                            const nodeMatch = nodes.find(n => n.id === p.id);
                            if (nodeMatch) setSelectedNode(nodeMatch);
                          }}
                          className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 hover:border-emerald-500 cursor-pointer transition-colors"
                        >
                          <div className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-1">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-neutral-500 flex items-center justify-between mt-0.5 font-mono">
                            <span>{p.journal} ({p.year})</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{p.citations} cites</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
