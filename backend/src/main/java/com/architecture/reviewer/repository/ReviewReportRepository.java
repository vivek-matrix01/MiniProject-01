package com.architecture.reviewer.repository;

import com.architecture.reviewer.model.ReviewReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewReportRepository extends JpaRepository<ReviewReport, Long> {
    List<ReviewReport> findAllByOrderByReviewedAtDesc();
    List<ReviewReport> findByArchitectureIdOrderByReviewedAtDesc(Long architectureId);
}
