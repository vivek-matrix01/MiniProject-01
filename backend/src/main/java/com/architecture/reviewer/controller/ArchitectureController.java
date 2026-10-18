package com.architecture.reviewer.controller;

import com.architecture.reviewer.model.ArchitectureDesign;
import com.architecture.reviewer.service.ArchitectureReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/architectures")
@CrossOrigin(origins = "*")
public class ArchitectureController {

    private final ArchitectureReviewService reviewService;

    public ArchitectureController(ArchitectureReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ArchitectureDesign>> getAllDesigns() {
        return ResponseEntity.ok(reviewService.getAllDesigns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArchitectureDesign> getDesignById(@PathVariable Long id) {
        ArchitectureDesign design = reviewService.getDesignById(id);
        if (design == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(design);
    }
}
