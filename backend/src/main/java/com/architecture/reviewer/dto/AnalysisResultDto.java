package com.architecture.reviewer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

public class AnalysisResultDto {
    @JsonProperty("overall_score")
    private double overallScore;

    @JsonProperty("reliability_score")
    private double reliabilityScore;

    @JsonProperty("scalability_score")
    private double scalabilityScore;

    @JsonProperty("coupling_score")
    private double couplingScore;

    @JsonProperty("availability_score")
    private double availabilityScore;

    @JsonProperty("deterministic_cycles")
    private int deterministicCycles;

    @JsonProperty("deterministic_spofs")
    private int deterministicSpofs;

    @JsonProperty("inference_time_ms")
    private double inferenceTimeMs;

    @JsonProperty("analysis_engine")
    private String analysisEngine = "Hybrid Neuro-Symbolic (Tarjan + GraphSAGE + GATv2)";

    private List<NodeSmellDto> smells = new ArrayList<>();

    @JsonProperty("counterfactual_recommendations")
    private List<CounterfactualMutationDto> counterfactualRecommendations = new ArrayList<>();

    public AnalysisResultDto() {}

    public double getOverallScore() { return overallScore; }
    public void setOverallScore(double overallScore) { this.overallScore = overallScore; }

    public double getReliabilityScore() { return reliabilityScore; }
    public void setReliabilityScore(double reliabilityScore) { this.reliabilityScore = reliabilityScore; }

    public double getScalabilityScore() { return scalabilityScore; }
    public void setScalabilityScore(double scalabilityScore) { this.scalabilityScore = scalabilityScore; }

    public double getCouplingScore() { return couplingScore; }
    public void setCouplingScore(double couplingScore) { this.couplingScore = couplingScore; }

    public double getAvailabilityScore() { return availabilityScore; }
    public void setAvailabilityScore(double availabilityScore) { this.availabilityScore = availabilityScore; }

    public int getDeterministicCycles() { return deterministicCycles; }
    public void setDeterministicCycles(int deterministicCycles) { this.deterministicCycles = deterministicCycles; }

    public int getDeterministicSpofs() { return deterministicSpofs; }
    public void setDeterministicSpofs(int deterministicSpofs) { this.deterministicSpofs = deterministicSpofs; }

    public double getInferenceTimeMs() { return inferenceTimeMs; }
    public void setInferenceTimeMs(double inferenceTimeMs) { this.inferenceTimeMs = inferenceTimeMs; }

    public String getAnalysisEngine() { return analysisEngine; }
    public void setAnalysisEngine(String analysisEngine) { this.analysisEngine = analysisEngine; }

    public List<NodeSmellDto> getSmells() { return smells; }
    public void setSmells(List<NodeSmellDto> smells) { this.smells = smells; }

    public List<CounterfactualMutationDto> getCounterfactualRecommendations() { return counterfactualRecommendations; }
    public void setCounterfactualRecommendations(List<CounterfactualMutationDto> counterfactualRecommendations) { this.counterfactualRecommendations = counterfactualRecommendations; }
}
