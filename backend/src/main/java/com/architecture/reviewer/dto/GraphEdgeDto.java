package com.architecture.reviewer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GraphEdgeDto {
    private int source;
    private int target;
    private String protocol = "REST";

    @JsonProperty("sync_nature")
    private int syncNature = 1;

    private double frequency = 0.5;

    public GraphEdgeDto() {}

    public GraphEdgeDto(int source, int target, String protocol, int syncNature, double frequency) {
        this.source = source;
        this.target = target;
        this.protocol = protocol;
        this.syncNature = syncNature;
        this.frequency = frequency;
    }

    public int getSource() { return source; }
    public void setSource(int source) { this.source = source; }

    public int getTarget() { return target; }
    public void setTarget(int target) { this.target = target; }

    public String getProtocol() { return protocol != null ? protocol : "REST"; }
    public void setProtocol(String protocol) { this.protocol = protocol; }

    public int getSyncNature() { return syncNature; }
    public void setSyncNature(int syncNature) { this.syncNature = syncNature; }

    public double getFrequency() { return frequency; }
    public void setFrequency(double frequency) { this.frequency = frequency; }
}
