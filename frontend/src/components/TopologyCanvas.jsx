import React, { useState } from 'react';
import { Server, Database, HardDrive, Inbox, ShieldCheck, AlertCircle, Eye, Filter, RefreshCw, Zap } from 'lucide-react';

const NODE_THEMES = {
  Gateway: {
    bg: '#0F2347',
    border: '#3B82F6',
    text: '#93C5FD',
    glow: 'rgba(59, 130, 246, 0.4)',
    accent: '#60A5FA'
  },
  Service: {
    bg: '#062E25',
    border: '#10B981',
    text: '#A7F3D0',
    glow: 'rgba(16, 185, 129, 0.4)',
    accent: '#34D399'
  },
  Database: {
    bg: '#3D1C06',
    border: '#F59E0B',
    text: '#FDE68A',
    glow: 'rgba(245, 158, 11, 0.4)',
    accent: '#FBBF24'
  },
  Cache: {
    bg: '#3A0D23',
    border: '#EC4899',
    text: '#FBCFE8',
    glow: 'rgba(236, 72, 153, 0.4)',
    accent: '#F472B6'
  },
  Queue: {
    bg: '#250E4A',
    border: '#8B5CF6',
    text: '#DDD6FE',
    glow: 'rgba(139, 92, 246, 0.4)',
    accent: '#A78BFA'
  },
};

export default function TopologyCanvas({ graph, smells = [], selectedNode, onSelectNode }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'SMELLS' | 'SERVICES' | 'DATABASES'

  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[520px] rounded-2xl glass-surface border border-gray-800 text-gray-500">
        <Server className="w-10 h-10 mb-3 opacity-30 animate-pulse text-blue-400" />
        <p className="text-sm font-medium text-gray-400">No architecture topology loaded</p>
        <p className="text-xs text-gray-600 mt-1">Paste a GitHub link or select a benchmark preset to visualize.</p>
      </div>
    );
  }

  const nodes = graph.nodes;
  const edges = graph.edges || [];

  // Map smells to node IDs
  const nodeSmellMap = {};
  smells.forEach(s => {
    if (!nodeSmellMap[s.node_id]) nodeSmellMap[s.node_id] = [];
    nodeSmellMap[s.node_id].push(s);
  });

  const width = 860;
  const height = 520;

  // Group nodes by tier
  const gateways = nodes.filter(n => n.node_type === 'Gateway');
  const services = nodes.filter(n => n.node_type === 'Service');
  const dbs = nodes.filter(n => n.node_type === 'Database');
  const caches = nodes.filter(n => n.node_type === 'Cache');
  const queues = nodes.filter(n => n.node_type === 'Queue');

  const positions = {};

  const placeRow = (items, y, startX = 80, endX = width - 80) => {
    const count = items.length;
    if (count === 0) return;
    const step = (endX - startX) / Math.max(1, count - 1);
    items.forEach((item, idx) => {
      const x = count === 1 ? width / 2 : startX + idx * step;
      positions[item.id] = { x, y };
    });
  };

  placeRow(gateways, 80);
  placeRow(services, 230);
  const dataTier = [...dbs, ...caches, ...queues];
  placeRow(dataTier, 410);

  // Fallback for any node
  nodes.forEach((n, idx) => {
    if (!positions[n.id]) {
      positions[n.id] = { x: 100 + (idx * 110) % (width - 200), y: 280 };
    }
  });

  const getNodeIcon = (type) => {
    switch (type) {
      case 'Gateway': return <ShieldCheck className="w-4 h-4" />;
      case 'Database': return <Database className="w-4 h-4" />;
      case 'Cache': return <HardDrive className="w-4 h-4" />;
      case 'Queue': return <Inbox className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const isVisible = (node) => {
    if (filterType === 'SMELLS') return !!nodeSmellMap[node.id];
    if (filterType === 'SERVICES') return node.node_type === 'Service' || node.node_type === 'Gateway';
    if (filterType === 'DATABASES') return node.node_type === 'Database' || node.node_type === 'Cache';
    return true;
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl glass-surface border border-white/[0.08] overflow-hidden shadow-2xl">
      {/* Top Controls Bar */}
      <div className="absolute top-3.5 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center space-x-2 bg-gray-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.06] shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-gray-200 tracking-wide uppercase">Live Topology Graph</span>
          <span className="text-gray-600">•</span>
          <span className="text-[11px] font-mono text-cyan-400">{nodes.length} Components</span>
          <span className="text-gray-600">•</span>
          <span className="text-[11px] font-mono text-indigo-400">{edges.length} Links</span>
        </div>

        {/* Filter Pills */}
        <div className="pointer-events-auto flex items-center space-x-1 bg-gray-950/80 backdrop-blur-md p-1 rounded-xl border border-white/[0.06] shadow-lg">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'SMELLS', label: `Smells (${smells.length})` },
            { id: 'SERVICES', label: 'Services' },
            { id: 'DATABASES', label: 'Data Tier' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                filterType === f.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <svg className="w-full h-full grid-canvas" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <marker id="arrow-sync-glow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#60A5FA" />
          </marker>
          <marker id="arrow-async-glow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#A78BFA" />
          </marker>
        </defs>

        {/* Tier Guidelines */}
        <g opacity="0.3">
          <line x1="30" y1="150" x2={width - 30} y2="150" stroke="#374151" strokeDasharray="3 4" />
          <text x="40" y="142" fill="#6B7280" fontSize="9" fontWeight="bold" letterSpacing="0.1em">INGRESS & GATEWAY TIER</text>

          <line x1="30" y1="320" x2={width - 30} y2="320" stroke="#374151" strokeDasharray="3 4" />
          <text x="40" y="312" fill="#6B7280" fontSize="9" fontWeight="bold" letterSpacing="0.1em">DOMAIN SERVICES & BOUNDED CONTEXTS</text>

          <text x="40" y="495" fill="#6B7280" fontSize="9" fontWeight="bold" letterSpacing="0.1em">DATA STORES, CACHES & EVENT BROKERS</text>
        </g>

        {/* Edges with animated flowing dashes */}
        {edges.map((edge, idx) => {
          const p1 = positions[edge.source];
          const p2 = positions[edge.target];
          if (!p1 || !p2) return null;

          const fromNode = nodes.find(n => n.id === edge.source);
          const toNode = nodes.find(n => n.id === edge.target);
          const isFaded = !isVisible(fromNode) || !isVisible(toNode);

          const isAsync = edge.sync_nature === 0 || edge.protocol === 'AMQP';
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          return (
            <g key={`edge-${idx}`} opacity={isFaded ? 0.15 : 1} className="transition-opacity duration-300">
              {/* Underlying glow path */}
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isAsync ? '#8B5CF6' : '#3B82F6'}
                strokeWidth={Math.max(2, (edge.frequency || 0.5) * 4)}
                strokeOpacity={0.25}
              />
              {/* Animated foreground flowing dashed line */}
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isAsync ? '#C4B5FD' : '#93C5FD'}
                strokeWidth="1.8"
                strokeDasharray="6 6"
                className="edge-flow"
                markerEnd={isAsync ? 'url(#arrow-async-glow)' : 'url(#arrow-sync-glow)'}
              />
              {/* Protocol pill */}
              <rect
                x={midX - 16}
                y={midY - 8}
                width="32"
                height="16"
                rx="4"
                fill="#0B0F19"
                stroke={isAsync ? '#8B5CF6' : '#3B82F6'}
                strokeWidth="0.8"
                strokeOpacity="0.6"
              />
              <text
                x={midX}
                y={midY + 3.5}
                fill={isAsync ? '#DDD6FE' : '#93C5FD'}
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                className="select-none"
              >
                {edge.protocol}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const p = positions[node.id];
          if (!p) return null;

          const theme = NODE_THEMES[node.node_type] || NODE_THEMES.Service;
          const isSelected = selectedNode && selectedNode.id === node.id;
          const isHovered = hoveredNode === node.id;
          const nodeSmells = nodeSmellMap[node.id] || [];
          const hasCriticalSmell = nodeSmells.some(s => s.severity === 'CRITICAL');
          const hasSmell = nodeSmells.length > 0;
          const isFaded = !isVisible(node);

          return (
            <g
              key={`node-${node.id}`}
              transform={`translate(${p.x}, ${p.y})`}
              className="cursor-pointer transition-all duration-300"
              opacity={isFaded ? 0.2 : 1}
              onClick={() => onSelectNode(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Outer pulsing ring for critical vulnerabilities */}
              {hasCriticalSmell && (
                <circle
                  r="34"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2"
                  className="pulse-node"
                />
              )}

              {/* Node Card / Circular Badge */}
              <circle
                r="24"
                fill={theme.bg}
                stroke={hasCriticalSmell ? '#F43F5E' : isSelected ? '#38BDF8' : theme.border}
                strokeWidth={isSelected ? 3.5 : hasSmell ? 2.5 : 1.8}
                filter={isSelected || isHovered ? 'url(#node-glow)' : 'none'}
              />

              {/* Center icon */}
              <g transform="translate(-8, -8)" fill="none" stroke={theme.text}>
                {getNodeIcon(node.node_type)}
              </g>

              {/* Node Label Card below */}
              <g transform="translate(0, 36)">
                <rect
                  x="-55"
                  y="-10"
                  width="110"
                  height="20"
                  rx="6"
                  fill="#0B0F19"
                  stroke={isSelected ? '#38BDF8' : 'rgba(255, 255, 255, 0.1)'}
                  strokeWidth="1"
                />
                <text
                  y="4"
                  fill="#F3F4F6"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                  className="select-none font-sans"
                >
                  {node.label && node.label.length > 14 ? node.label.substring(0, 13) + '…' : (node.label || `Node_${node.id}`)}
                </text>
              </g>

              {/* Replicas & RPS Badge above */}
              <g transform="translate(0, -32)">
                <text
                  fill="#94A3B8"
                  fontSize="9"
                  fontWeight="600"
                  textAnchor="middle"
                  className="select-none font-mono"
                >
                  {node.replication_factor}x rep • {Math.round((node.traffic_weight || 0.5) * 100)}% load
                </text>
              </g>

              {/* Smell Indicator Alert Pip */}
              {hasSmell && (
                <g transform="translate(16, -18)">
                  <circle r="8" fill="#F43F5E" stroke="#0B0F19" strokeWidth="2" />
                  <text y="3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">!</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Bottom Canvas Footer / Legend */}
      <div className="absolute bottom-3 left-4 right-4 z-10 flex flex-wrap items-center justify-between text-xs pointer-events-none">
        <div className="pointer-events-auto flex items-center space-x-3 bg-gray-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.06]">
          {Object.entries(NODE_THEMES).map(([type, c]) => (
            <div key={type} className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.border }} />
              <span className="text-[11px] text-gray-300 font-medium">{type}</span>
            </div>
          ))}
        </div>

        <div className="pointer-events-auto flex items-center space-x-2 text-[11px] text-gray-400 bg-gray-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/[0.06]">
          <span className="text-blue-400 font-mono">━━</span> <span>Sync REST/gRPC</span>
          <span className="text-purple-400 font-mono">┅┅</span> <span>Async Queue/Event</span>
        </div>
      </div>
    </div>
  );
}
