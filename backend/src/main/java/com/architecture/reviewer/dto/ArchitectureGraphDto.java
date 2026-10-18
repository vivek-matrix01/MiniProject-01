package com.architecture.reviewer.dto;

import java.util.ArrayList;
import java.util.List;

public class ArchitectureGraphDto {
    private String name = "Microservice Topology";
    private String description = "Microservice Architecture Graph";
    private List<GraphNodeDto> nodes = new ArrayList<>();
    private List<GraphEdgeDto> edges = new ArrayList<>();

    public ArchitectureGraphDto() {}

    public ArchitectureGraphDto(String name, String description, List<GraphNodeDto> nodes, List<GraphEdgeDto> edges) {
        this.name = name;
        this.description = description;
        this.nodes = nodes != null ? nodes : new ArrayList<>();
        this.edges = edges != null ? edges : new ArrayList<>();
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<GraphNodeDto> getNodes() { return nodes; }
    public void setNodes(List<GraphNodeDto> nodes) { this.nodes = nodes; }

    public List<GraphEdgeDto> getEdges() { return edges; }
    public void setEdges(List<GraphEdgeDto> edges) { this.edges = edges; }
}
