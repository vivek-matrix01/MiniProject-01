package com.architecture.reviewer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_reports")
public class ReviewReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "architecture_id")
    private ArchitectureDesign architecture;

    @Column(name = "overall_health_score", nullable = false)
    private Double overallHealthScore;

    @Column(name = "reliability_score", nullable = false)
    private Double reliabilityScore;

    @Column(name = "scalability_score", nullable = false)
    private Double scalabilityScore;

    @Column(name = "coupling_score", nullable = false)
    private Double couplingScore;

    @Column(name = "availability_score", nullable = false)
    private Double availabilityScore;

    @Column(name = "deterministic_cycles")
    private Integer deterministicCycles = 0;

    @Column(name = "deterministic_spofs")
    private Integer deterministicSpofs = 0;

    @Column(name = "smells_detected_count", nullable = false)
    private Integer smellsDetectedCount;

    @Column(name = "smells_json", nullable = false, columnDefinition = "TEXT")
    private String smellsJson;

    @Column(name = "counterfactuals_json", columnDefinition = "TEXT")
    private String counterfactualsJson;

    @Column(name = "inference_time_ms")
    private Double inferenceTimeMs;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt = LocalDateTime.now();

    public ReviewReport() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ArchitectureDesign getArchitecture() { return architecture; }
    public void setArchitecture(ArchitectureDesign architecture) { this.architecture = architecture; }

    public Double getOverallHealthScore() { return overallHealthScore; }
    public void setOverallHealthScore(Double overallHealthScore) { this.overallHealthScore = overallHealthScore; }

    public Double getReliabilityScore() { return reliabilityScore; }
    public void setReliabilityScore(Double reliabilityScore) { this.reliabilityScore = reliabilityScore; }

    public Double getScalabilityScore() { return scalabilityScore; }
    public void setScalabilityScore(Double scalabilityScore) { this.scalabilityScore = scalabilityScore; }

    public Double getCouplingScore() { return couplingScore; }
    public void setCouplingScore(Double couplingScore) { this.couplingScore = couplingScore; }

    public Double getAvailabilityScore() { return availabilityScore; }
    public void setAvailabilityScore(Double availabilityScore) { this.availabilityScore = availabilityScore; }

    public Integer getDeterministicCycles() { return deterministicCycles; }
    public void setDeterministicCycles(Integer deterministicCycles) { this.deterministicCycles = deterministicCycles; }

    public Integer getDeterministicSpofs() { return deterministicSpofs; }
    public void setDeterministicSpofs(Integer deterministicSpofs) { this.deterministicSpofs = deterministicSpofs; }

    public Integer getSmellsDetectedCount() { return smellsDetectedCount; }
    public void setSmellsDetectedCount(Integer smellsDetectedCount) { this.smellsDetectedCount = smellsDetectedCount; }

    public String getSmellsJson() { return smellsJson; }
    public void setSmellsJson(String smellsJson) { this.smellsJson = smellsJson; }

    public String getCounterfactualsJson() { return counterfactualsJson; }
    public void setCounterfactualsJson(String counterfactualsJson) { this.counterfactualsJson = counterfactualsJson; }

    public Double getInferenceTimeMs() { return inferenceTimeMs; }
    public void setInferenceTimeMs(Double inferenceTimeMs) { this.inferenceTimeMs = inferenceTimeMs; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}
