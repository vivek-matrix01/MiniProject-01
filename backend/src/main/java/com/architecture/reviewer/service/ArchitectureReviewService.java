package com.architecture.reviewer.service;

import com.architecture.reviewer.dto.*;
import com.architecture.reviewer.model.ArchitectureDesign;
import com.architecture.reviewer.model.ReviewReport;
import com.architecture.reviewer.repository.ArchitectureDesignRepository;
import com.architecture.reviewer.repository.ReviewReportRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class ArchitectureReviewService {

    private static final Logger log = LoggerFactory.getLogger(ArchitectureReviewService.class);

    private final ArchitectureDesignRepository architectureRepository;
    private final ReviewReportRepository reportRepository;
    private final AiEngineClient aiEngineClient;
    private final ObjectMapper objectMapper;
    private final GitHubArchitectureExtractorService gitHubExtractorService;

    public ArchitectureReviewService(ArchitectureDesignRepository architectureRepository,
                                     ReviewReportRepository reportRepository,
                                     AiEngineClient aiEngineClient,
                                     ObjectMapper objectMapper,
                                     GitHubArchitectureExtractorService gitHubExtractorService) {
        this.architectureRepository = architectureRepository;
        this.reportRepository = reportRepository;
        this.aiEngineClient = aiEngineClient;
        this.objectMapper = objectMapper;
        this.gitHubExtractorService = gitHubExtractorService;
    }

    public Map<String, Object> reviewFromGitHub(String repoUrl, String token) {
        ArchitectureGraphDto extractedGraph = gitHubExtractorService.extractArchitectureFromRepo(repoUrl, token);
        AnalysisResultDto analysis = reviewAndSave(extractedGraph);

        Map<String, Object> result = new HashMap<>();
        result.put("graph", extractedGraph);
        result.put("analysis", analysis);
        result.put("repoUrl", repoUrl);
        return result;
    }

    @Transactional
    public AnalysisResultDto reviewAndSave(ArchitectureGraphDto graphDto) {
        // 1. Invoke the Hybrid AI Engine (or fallback)
        AnalysisResultDto analysisResult = aiEngineClient.analyzeArchitecture(graphDto);

        // 2. Persist Architecture Design
        try {
            String graphJson = objectMapper.writeValueAsString(graphDto);
            ArchitectureDesign design = new ArchitectureDesign(
                    graphDto.getName() != null ? graphDto.getName() : "Microservice Architecture",
                    graphDto.getDescription() != null ? graphDto.getDescription() : "Evaluated microservice topology",
                    "Microservice",
                    graphDto.getNodes().size(),
                    graphDto.getEdges().size(),
                    graphJson
            );
            design = architectureRepository.save(design);

            // 3. Persist Review Report
            String smellsJson = objectMapper.writeValueAsString(analysisResult.getSmells());
            String counterfactualsJson = objectMapper.writeValueAsString(analysisResult.getCounterfactualRecommendations());

            ReviewReport report = new ReviewReport();
            report.setArchitecture(design);
            report.setOverallHealthScore(analysisResult.getOverallScore());
            report.setReliabilityScore(analysisResult.getReliabilityScore());
            report.setScalabilityScore(analysisResult.getScalabilityScore());
            report.setCouplingScore(analysisResult.getCouplingScore());
            report.setAvailabilityScore(analysisResult.getAvailabilityScore());
            report.setDeterministicCycles(analysisResult.getDeterministicCycles());
            report.setDeterministicSpofs(analysisResult.getDeterministicSpofs());
            report.setSmellsDetectedCount(analysisResult.getSmells().size());
            report.setSmellsJson(smellsJson);
            report.setCounterfactualsJson(counterfactualsJson);
            report.setInferenceTimeMs(analysisResult.getInferenceTimeMs());

            reportRepository.save(report);
            log.info("Saved review report #{} for architecture #{} with score {}", report.getId(), design.getId(), report.getOverallHealthScore());
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize graph data or review report: {}", e.getMessage());
        }

        return analysisResult;
    }

    public CounterfactualResultDto simulateCounterfactual(Map<String, Object> payload) {
        return aiEngineClient.refactorArchitecture(payload);
    }

    public List<ArchitectureDesign> getAllDesigns() {
        return architectureRepository.findAllByOrderByCreatedAtDesc();
    }

    public ArchitectureDesign getDesignById(Long id) {
        return architectureRepository.findById(id).orElse(null);
    }

    public List<ReviewReport> getAllReports() {
        return reportRepository.findAllByOrderByReviewedAtDesc();
    }
}
