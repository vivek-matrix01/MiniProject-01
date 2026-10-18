package com.architecture.reviewer.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class CounterfactualResultDto {
    @JsonProperty("original_scores")
    private Map<String, Double> originalScores;

    @JsonProperty("refactored_scores")
    private Map<String, Double> refactoredScores;

    @JsonProperty("score_deltas")
    private Map<String, Double> scoreDeltas;

    private String summary;

    @JsonProperty("applied_mutation")
    private CounterfactualMutationDto appliedMutation;

    public CounterfactualResultDto() {}

    public CounterfactualResultDto(Map<String, Double> originalScores, Map<String, Double> refactoredScores, Map<String, Double> scoreDeltas, String summary, CounterfactualMutationDto appliedMutation) {
        this.originalScores = originalScores;
        this.refactoredScores = refactoredScores;
        this.scoreDeltas = scoreDeltas;
        this.summary = summary;
        this.appliedMutation = appliedMutation;
    }

    public Map<String, Double> getOriginalScores() { return originalScores; }
    public void setOriginalScores(Map<String, Double> originalScores) { this.originalScores = originalScores; }

    public Map<String, Double> getRefactoredScores() { return refactoredScores; }
    public void setRefactoredScores(Map<String, Double> refactoredScores) { this.refactoredScores = refactoredScores; }

    public Map<String, Double> getScoreDeltas() { return scoreDeltas; }
    public void setScoreDeltas(Map<String, Double> scoreDeltas) { this.scoreDeltas = scoreDeltas; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public CounterfactualMutationDto getAppliedMutation() { return appliedMutation; }
    public void setAppliedMutation(CounterfactualMutationDto appliedMutation) { this.appliedMutation = appliedMutation; }
}
