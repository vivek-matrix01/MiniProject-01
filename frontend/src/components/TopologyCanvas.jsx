import React, { useState } from 'react';
import { Server, Database, HardDrive, Inbox, ShieldCheck, AlertTriangle } from 'lucide-react';

const NODE_COLORS = {
  Gateway: { bg: '#1E3A8A', border: '#3B82F6', text: '#93C5FD' },
  Service: { bg: '#064E3B', border: '#10B981', text: '#A7F3D0' },
  Database: { bg: '#78350F', border: '#F59E0B', text: '#FDE68A' },
  Cache: { bg: '#831843', border: '#EC4899', text: '#FBCFE8' },
  Queue: { bg: '#4C1D95', border: '#8B5CF6', text: '#DDD6FE' },
};

export default function TopologyCanvas({ graph, smells = [], selectedNode, onSelectNode }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 border border-dashed border-gray-700 rounded-xl text-gray-500">
        No topology loaded. Select a template or upload an architecture graph.
      </div>
    );
  }

  // Pre-calculate tiered coordinates for clean architecture layout
  const nodes = graph.nodes;
  const edges = graph.edges || [];

  // Map smell nodes
  const nodeSmellMap = {};
  smells.forEach(s => {
    if (!nodeSmellMap[s.node_id]) nodeSmellMap[s.node_id] = [];
    nodeSmellMap[s.node_id].push(s);
  });

  // Calculate layout coordinates
  const width = 800;
  const height = 480;

  // Group by type tiers
  const gateways = nodes.filter(n => n.node_type === 'Gateway');
  const services = nodes.filter(n => n.node_type === 'Service');
  const dbs = nodes.filter(n => n.node_type === 'Database');
  const caches = nodes.filter(n => n.node_type === 'Cache');
  const queues = nodes.filter(n => n.node_type === 'Queue');

  const positions = {};

  const placeRow = (items, y, startX = 60, endX = width - 60) => {
    const count = items.length;
    if (count === 0) return;
    const step = (endX - startX) / Math.max(1, count - 1);
    items.forEach((item, idx) => {
      const x = count === 1 ? width / 2 : startX + idx * step;
      positions[item.id] = { x, y };
    });
  };

  placeRow(gateways, 70);
  placeRow(services, 200);
  const bottomTier = [...dbs, ...caches, ...queues];
  placeRow(bottomTier, 370);

  // Fallback for any node not positioned
  nodes.forEach((n, idx) => {
    if (!positions[n.id]) {
      positions[n.id] = { x: 100 + (idx * 90) % (width - 200), y: 280 };
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

  return (
    <div className="relative w-full h-[500px] bg-gray-950/80 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
      <div className="absolute top-3 left-4 z-10 flex items-center space-x-3 text-xs text-gray-400">
        <span className="font-semibold text-gray-200 uppercase tracking-wider">Topology Canvas</span>
        <span>•</span>
        <span>{nodes.length} Components</span>
        <span>•</span>
        <span>{edges.length} Directed Dependencies</span>
      </div>

      <div className="absolute top-3 right-4 z-10 flex items-center space-x-2 text-xs">
        {Object.entries(NODE_COLORS).map(([type, c]) => (
          <div key={type} className="flex items-center space-x-1 px-2 py-0.5 rounded bg-gray-900 border border-gray-800">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.border }} />
            <span className="text-gray-300">{type}</span>
          </div>
        ))}
      </div>

      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <marker id="arrow-sync" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#60A5FA" />
          </marker>
          <marker id="arrow-async" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#A78BFA" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, idx) => {
          const p1 = positions[edge.source];
          const p2 = positions[edge.target];
          if (!p1 || !p2) return null;

          const isAsync = edge.sync_nature === 0 || edge.protocol === 'AMQP';
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2 - 10;

          return (
            <g key={`edge-${idx}`}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isAsync ? '#A78BFA' : '#60A5FA'}
                strokeWidth={Math.max(1.5, (edge.frequency || 0.5) * 3)}
                strokeDasharray={isAsync ? '4 3' : 'none'}
                strokeOpacity={0.65}
                markerEnd={isAsync ? 'url(#arrow-async)' : 'url(#arrow-sync)'}
              />
              <text
                x={midX}
                y={midY}
                fill={isAsync ? '#DDD6FE' : '#93C5FD'}
                fontSize="9"
                textAnchor="middle"
                className="select-none opacity-80"
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

          const styling = NODE_COLORS[node.node_type] || NODE_COLORS.Service;
          const isSelected = selectedNode && selectedNode.id === node.id;
          const isHovered = hoveredNode === node.id;
          const nodeSmells = nodeSmellMap[node.id] || [];
          const hasCriticalSmell = nodeSmells.some(s => s.severity === 'CRITICAL');
          const hasSmell = nodeSmells.length > 0;

          return (
            <g
              key={`node-${node.id}`}
              transform={`translate(${p.x}, ${p.y})`}
              className="cursor-pointer transition-transform duration-200"
              onClick={() => onSelectNode(node)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Pulsing indicator for smelled nodes */}
              {hasCriticalSmell && (
                <circle
                  r="30"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  className="animate-ping opacity-50"
                />
              )}

              {/* Node background circle */}
              <circle
                r="22"
                fill={styling.bg}
                stroke={hasCriticalSmell ? '#EF4444' : isSelected ? '#38BDF8' : styling.border}
                strokeWidth={isSelected ? 3 : hasSmell ? 2.5 : 1.5}
                className="transition-all duration-200"
              />

              {/* Icon */}
              <g transform="translate(-8, -8)" fill="none" stroke={styling.text}>
                {getNodeIcon(node.node_type)}
              </g>

              {/* Label */}
              <text
                y="34"
                fill="#E2E8F0"
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
                className="select-none font-mono"
              >
                {node.label || `Node_${node.id}`}
              </text>

              {/* Replica / Traffic badge */}
              <text
                y="-26"
                fill="#94A3B8"
                fontSize="9"
                textAnchor="middle"
                className="select-none"
              >
                {node.replication_factor ? `${node.replication_factor}x rep` : ''}
              </text>

              {/* Smell warning icon */}
              {hasSmell && (
                <g transform="translate(12, -22)">
                  <circle r="7" fill="#EF4444" />
                  <text y="3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">!</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
