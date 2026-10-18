package com.architecture.reviewer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "architecture_designs")
public class ArchitectureDesign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "system_type")
    private String systemType = "Microservice";

    @Column(name = "node_count", nullable = false)
    private Integer nodeCount;

    @Column(name = "edge_count", nullable = false)
    private Integer edgeCount;

    @Column(name = "graph_data_json", nullable = false, columnDefinition = "TEXT")
    private String graphDataJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public ArchitectureDesign() {}

    public ArchitectureDesign(String name, String description, String systemType, Integer nodeCount, Integer edgeCount, String graphDataJson) {
        this.name = name;
        this.description = description;
        this.systemType = systemType;
        this.nodeCount = nodeCount;
        this.edgeCount = edgeCount;
        this.graphDataJson = graphDataJson;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSystemType() { return systemType; }
    public void setSystemType(String systemType) { this.systemType = systemType; }

    public Integer getNodeCount() { return nodeCount; }
    public void setNodeCount(Integer nodeCount) { this.nodeCount = nodeCount; }

    public Integer getEdgeCount() { return edgeCount; }
    public void setEdgeCount(Integer edgeCount) { this.edgeCount = edgeCount; }

    public String getGraphDataJson() { return graphDataJson; }
    public void setGraphDataJson(String graphDataJson) { this.graphDataJson = graphDataJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
