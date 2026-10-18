package com.architecture.reviewer.repository;

import com.architecture.reviewer.model.ArchitectureDesign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArchitectureDesignRepository extends JpaRepository<ArchitectureDesign, Long> {
    List<ArchitectureDesign> findAllByOrderByCreatedAtDesc();
}
