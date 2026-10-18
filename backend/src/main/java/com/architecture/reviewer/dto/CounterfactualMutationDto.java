package com.architecture.reviewer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CounterfactualMutationDto {
    @JsonProperty("node_id")
    private int nodeId;

    @JsonProperty("action_type")
    private String actionType; // INCREASE_REPLICAS, INSERT_CACHE, CONVERT_TO_ASYNC, ISOLATE_DB

    private String description;

    @JsonProperty("target_attribute")
    private String targetAttribute;

    @JsonProperty("new_value")
    private Object newValue;

    public CounterfactualMutationDto() {}

    public CounterfactualMutationDto(int nodeId, String actionType, String description, String targetAttribute, Object newValue) {
        this.nodeId = nodeId;
        this.actionType = actionType;
        this.description = description;
        this.targetAttribute = targetAttribute;
        this.newValue = newValue;
    }

    public int getNodeId() { return nodeId; }
    public void setNodeId(int nodeId) { this.nodeId = nodeId; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTargetAttribute() { return targetAttribute; }
    public void setTargetAttribute(String targetAttribute) { this.targetAttribute = targetAttribute; }

    public Object getNewValue() { return newValue; }
    public void setNewValue(Object newValue) { this.newValue = newValue; }
}
