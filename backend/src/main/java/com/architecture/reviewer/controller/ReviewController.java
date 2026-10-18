package com.architecture.reviewer.controller;

import com.architecture.reviewer.dto.*;
import com.architecture.reviewer.model.ReviewReport;
import com.architecture.reviewer.service.ArchitectureReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ArchitectureReviewService reviewService;

    public ReviewController(ArchitectureReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResultDto> analyzeArchitecture(@RequestBody ArchitectureGraphDto graph) {
        AnalysisResultDto result = reviewService.reviewAndSave(graph);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/counterfactual")
    public ResponseEntity<CounterfactualResultDto> simulateCounterfactual(@RequestBody Map<String, Object> payload) {
        CounterfactualResultDto result = reviewService.simulateCounterfactual(payload);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ReviewReport>> getReviewHistory() {
        return ResponseEntity.ok(reviewService.getAllReports());
    }
}
