package com.architecture.reviewer.service;

import com.architecture.reviewer.dto.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DeterministicGraphAnalyzer {

    public static class DeterministicAnalysis {
        public List<List<Integer>> stronglyConnectedComponents = new ArrayList<>();
        public Set<Integer> cycleNodes = new HashSet<>();
        public Set<Integer> articulationPoints = new HashSet<>();
        public Set<Integer> syncChainNodes = new HashSet<>();
        public Map<Integer, Integer> inDegrees = new HashMap<>();
        public Map<Integer, Integer> outDegrees = new HashMap<>();
        public Map<Integer, Integer> syncInDegrees = new HashMap<>();
    }

    public DeterministicAnalysis analyze(ArchitectureGraphDto graph) {
        DeterministicAnalysis result = new DeterministicAnalysis();
        List<GraphNodeDto> nodes = graph.getNodes();
        List<GraphEdgeDto> edges = graph.getEdges();

        Map<Integer, List<Integer>> adj = new HashMap<>();
        Map<Integer, List<Integer>> undirectedAdj = new HashMap<>();
        Map<Integer, List<Integer>> syncAdj = new HashMap<>();

        for (GraphNodeDto node : nodes) {
            adj.put(node.getId(), new ArrayList<>());
            undirectedAdj.put(node.getId(), new ArrayList<>());
            syncAdj.put(node.getId(), new ArrayList<>());
            result.inDegrees.put(node.getId(), 0);
            result.outDegrees.put(node.getId(), 0);
            result.syncInDegrees.put(node.getId(), 0);
        }

        for (GraphEdgeDto edge : edges) {
            int u = edge.getSource();
            int v = edge.getTarget();

            if (adj.containsKey(u) && adj.containsKey(v)) {
                adj.get(u).add(v);
                result.outDegrees.put(u, result.outDegrees.getOrDefault(u, 0) + 1);
                result.inDegrees.put(v, result.inDegrees.getOrDefault(v, 0) + 1);

                undirectedAdj.get(u).add(v);
                undirectedAdj.get(v).add(u);

                if (edge.getSyncNature() == 1) {
                    syncAdj.get(u).add(v);
                    result.syncInDegrees.put(v, result.syncInDegrees.getOrDefault(v, 0) + 1);
                }
            }
        }

        // 1. Tarjan's SCC for Exact Directed Cycles in O(V + E)
        findSCCsTarjan(nodes, adj, result);

        // 2. Articulation Points on Undirected Projection in O(V + E)
        findArticulationPoints(nodes, undirectedAdj, result);

        // 3. Find Synchronous Chains of length >= 4
        findSyncChains(nodes, syncAdj, result);

        return result;
    }

    private void findSCCsTarjan(List<GraphNodeDto> nodes, Map<Integer, List<Integer>> adj, DeterministicAnalysis result) {
        Map<Integer, Integer> disc = new HashMap<>();
        Map<Integer, Integer> low = new HashMap<>();
        Map<Integer, Boolean> onStack = new HashMap<>();
        Deque<Integer> stack = new ArrayDeque<>();
        int[] timer = new int[]{0};

        for (GraphNodeDto node : nodes) {
            disc.put(node.getId(), -1);
            low.put(node.getId(), -1);
            onStack.put(node.getId(), false);
        }

        for (GraphNodeDto node : nodes) {
            if (disc.get(node.getId()) == -1) {
                tarjanDFS(node.getId(), adj, disc, low, onStack, stack, timer, result);
            }
        }
    }

    private void tarjanDFS(int u, Map<Integer, List<Integer>> adj, Map<Integer, Integer> disc,
                           Map<Integer, Integer> low, Map<Integer, Boolean> onStack,
                           Deque<Integer> stack, int[] timer, DeterministicAnalysis result) {
        disc.put(u, timer[0]);
        low.put(u, timer[0]);
        timer[0]++;
        stack.push(u);
        onStack.put(u, true);

        for (int v : adj.getOrDefault(u, Collections.emptyList())) {
            if (disc.get(v) == -1) {
                tarjanDFS(v, adj, disc, low, onStack, stack, timer, result);
                low.put(u, Math.min(low.get(u), low.get(v)));
            } else if (Boolean.TRUE.equals(onStack.get(v))) {
                low.put(u, Math.min(low.get(u), disc.get(v)));
            }
        }

        if (low.get(u).equals(disc.get(u))) {
            List<Integer> component = new ArrayList<>();
            while (true) {
                int node = stack.pop();
                onStack.put(node, false);
                component.add(node);
                if (node == u) break;
            }
            if (component.size() > 1) {
                result.stronglyConnectedComponents.add(component);
                result.cycleNodes.addAll(component);
            }
        }
    }

    private void findArticulationPoints(List<GraphNodeDto> nodes, Map<Integer, List<Integer>> undirectedAdj, DeterministicAnalysis result) {
        Map<Integer, Integer> disc = new HashMap<>();
        Map<Integer, Integer> low = new HashMap<>();
        Map<Integer, Integer> parent = new HashMap<>();
        Set<Integer> visited = new HashSet<>();
        int[] timer = new int[]{0};

        for (GraphNodeDto node : nodes) {
            disc.put(node.getId(), -1);
            low.put(node.getId(), -1);
            parent.put(node.getId(), -1);
        }

        for (GraphNodeDto node : nodes) {
            if (!visited.contains(node.getId())) {
                artPointsDFS(node.getId(), undirectedAdj, disc, low, parent, visited, timer, result);
            }
        }
    }

    private void artPointsDFS(int u, Map<Integer, List<Integer>> adj, Map<Integer, Integer> disc,
                              Map<Integer, Integer> low, Map<Integer, Integer> parent,
                              Set<Integer> visited, int[] timer, DeterministicAnalysis result) {
        visited.add(u);
        disc.put(u, timer[0]);
        low.put(u, timer[0]);
        timer[0]++;
        int children = 0;

        for (int v : adj.getOrDefault(u, Collections.emptyList())) {
            if (!visited.contains(v)) {
                children++;
                parent.put(v, u);
                artPointsDFS(v, adj, disc, low, parent, visited, timer, result);
                low.put(u, Math.min(low.get(u), low.get(v)));

                // Condition 1: u is root of DFS tree and has >= 2 children
                if (parent.get(u) == -1 && children > 1) {
                    result.articulationPoints.add(u);
                }
                // Condition 2: u is not root and low value of child >= disc value of u
                if (parent.get(u) != -1 && low.get(v) >= disc.get(u)) {
                    result.articulationPoints.add(u);
                }
            } else if (v != parent.get(u)) {
                low.put(u, Math.min(low.get(u), disc.get(v)));
            }
        }
    }

    private void findSyncChains(List<GraphNodeDto> nodes, Map<Integer, List<Integer>> syncAdj, DeterministicAnalysis result) {
        for (GraphNodeDto root : nodes) {
            // BFS from root along sync edges
            Queue<Integer> queue = new LinkedList<>();
            Map<Integer, Integer> dist = new HashMap<>();
            Map<Integer, Integer> prev = new HashMap<>();

            queue.add(root.getId());
            dist.put(root.getId(), 0);

            while (!queue.isEmpty()) {
                int curr = queue.poll();
                int d = dist.get(curr);

                if (d >= 4) {
                    // Backtrack path and add to syncChainNodes
                    int p = curr;
                    while (p != root.getId()) {
                        result.syncChainNodes.add(p);
                        p = prev.get(p);
                    }
                    result.syncChainNodes.add(root.getId());
                }

                for (int next : syncAdj.getOrDefault(curr, Collections.emptyList())) {
                    if (!dist.containsKey(next)) {
                        dist.put(next, d + 1);
                        prev.put(next, curr);
                        queue.add(next);
                    }
                }
            }
        }
    }
}
