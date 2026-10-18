package com.architecture.reviewer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GraphNodeDto {
    private int id;
    private String label;

    @JsonProperty("node_type")
    private String nodeType;

    @JsonProperty("is_stateful")
    private int isStateful;

    @JsonProperty("replication_factor")
    private int replicationFactor = 1;

    @JsonProperty("traffic_weight")
    private double trafficWeight = 0.5;

    public GraphNodeDto() {}

    public GraphNodeDto(int id, String label, String nodeType, int isStateful, int replicationFactor, double trafficWeight) {
        this.id = id;
        this.label = label;
        this.nodeType = nodeType;
        this.isStateful = isStateful;
        this.replicationFactor = replicationFactor;
        this.trafficWeight = trafficWeight;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getLabel() { return label != null ? label : "Node_" + id; }
    public void setLabel(String label) { this.label = label; }

    public String getNodeType() { return nodeType != null ? nodeType : "Service"; }
    public void setNodeType(String nodeType) { this.nodeType = nodeType; }

    public int getIsStateful() { return isStateful; }
    public void setIsStateful(int isStateful) { this.isStateful = isStateful; }

    public int getReplicationFactor() { return replicationFactor; }
    public void setReplicationFactor(int replicationFactor) { this.replicationFactor = replicationFactor; }

    public double getTrafficWeight() { return trafficWeight; }
    public void setTrafficWeight(double trafficWeight) { this.trafficWeight = trafficWeight; }
}
