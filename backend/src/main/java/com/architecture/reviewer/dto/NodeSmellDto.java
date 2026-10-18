package com.architecture.reviewer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class NodeSmellDto {
    @JsonProperty("node_id")
    private int nodeId;

    @JsonProperty("node_label")
    private String nodeLabel;

    @JsonProperty("smell_name")
    private String smellName;

    private double confidence;
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW
    private String description;

    @JsonProperty("suggested_action")
    private String suggestedAction;

    public NodeSmellDto() {}

    public NodeSmellDto(int nodeId, String nodeLabel, String smellName, double confidence, String severity, String description, String suggestedAction) {
        this.nodeId = nodeId;
        this.nodeLabel = nodeLabel;
        this.smellName = smellName;
        this.confidence = confidence;
        this.severity = severity;
        this.description = description;
        this.suggestedAction = suggestedAction;
    }

    public int getNodeId() { return nodeId; }
    public void setNodeId(int nodeId) { this.nodeId = nodeId; }

    public String getNodeLabel() { return nodeLabel; }
    public void setNodeLabel(String nodeLabel) { this.nodeLabel = nodeLabel; }

    public String getSmellName() { return smellName; }
    public void setSmellName(String smellName) { this.smellName = smellName; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSuggestedAction() { return suggestedAction; }
    public void setSuggestedAction(String suggestedAction) { this.suggestedAction = suggestedAction; }
}
