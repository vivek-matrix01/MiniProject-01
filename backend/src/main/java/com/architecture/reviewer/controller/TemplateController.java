package com.architecture.reviewer.controller;

import com.architecture.reviewer.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/templates")
@CrossOrigin(origins = "*")
public class TemplateController {

    @GetMapping
    public ResponseEntity<List<ArchitectureGraphDto>> getTemplates() {
        List<ArchitectureGraphDto> templates = new ArrayList<>();

        // 1. E-Commerce (SPOF & Shared Database Anti-Pattern)
        ArchitectureGraphDto ecommerce = new ArchitectureGraphDto();
        ecommerce.setName("E-Commerce Monolith-in-Disguise");
        ecommerce.setDescription("Classic anti-pattern: Multiple services coupling directly to a single shared PostgreSQL database instance with 1 replica, plus deep synchronous REST calls.");
        ecommerce.getNodes().addAll(List.of(
                new GraphNodeDto(0, "API Gateway", "Gateway", 0, 2, 0.85),
                new GraphNodeDto(1, "Order Service", "Service", 0, 1, 0.70),
                new GraphNodeDto(2, "Inventory Service", "Service", 0, 1, 0.65),
                new GraphNodeDto(3, "Payment Service", "Service", 0, 1, 0.75),
                new GraphNodeDto(4, "User Service", "Service", 0, 1, 0.50),
                new GraphNodeDto(5, "Shared Core DB", "Database", 1, 1, 0.95), // SPOF & Shared DB
                new GraphNodeDto(6, "Notification Queue", "Queue", 1, 2, 0.30)
        ));
        ecommerce.getEdges().addAll(List.of(
                new GraphEdgeDto(0, 1, "REST", 1, 0.8),
                new GraphEdgeDto(0, 4, "REST", 1, 0.5),
                new GraphEdgeDto(1, 2, "REST", 1, 0.7),
                new GraphEdgeDto(1, 3, "REST", 1, 0.75),
                new GraphEdgeDto(1, 5, "JDBC", 1, 0.85),
                new GraphEdgeDto(2, 5, "JDBC", 1, 0.80),
                new GraphEdgeDto(3, 5, "JDBC", 1, 0.90),
                new GraphEdgeDto(4, 5, "JDBC", 1, 0.60),
                new GraphEdgeDto(3, 6, "AMQP", 0, 0.40)
        ));
        templates.add(ecommerce);

        // 2. FinTech (Circular Dependency Cycle & Deep Sync Chain)
        ArchitectureGraphDto fintech = new ArchitectureGraphDto();
        fintech.setName("FinTech Core Banking System");
        fintech.setDescription("Catastrophic deadlocks waiting to happen: Circular dependency cycle (Payment -> Fraud -> Ledger -> Payment) with deep synchronous RPC chains.");
        fintech.getNodes().addAll(List.of(
                new GraphNodeDto(0, "Banking Gateway", "Gateway", 0, 2, 0.90),
                new GraphNodeDto(1, "Payment Service", "Service", 0, 2, 0.85),
                new GraphNodeDto(2, "Fraud Detection Service", "Service", 0, 2, 0.80),
                new GraphNodeDto(3, "Ledger Service", "Service", 0, 2, 0.75),
                new GraphNodeDto(4, "Compliance Engine", "Service", 0, 1, 0.60),
                new GraphNodeDto(5, "Ledger DB", "Database", 1, 2, 0.70),
                new GraphNodeDto(6, "Audit Store", "Database", 1, 1, 0.40)
        ));
        fintech.getEdges().addAll(List.of(
                new GraphEdgeDto(0, 1, "REST", 1, 0.9),
                new GraphEdgeDto(1, 2, "gRPC", 1, 0.85), // Cycle Part 1
                new GraphEdgeDto(2, 3, "gRPC", 1, 0.80), // Cycle Part 2
                new GraphEdgeDto(3, 1, "gRPC", 1, 0.75), // Cycle Part 3 (Back to Payment!)
                new GraphEdgeDto(3, 4, "REST", 1, 0.60), // Chain depth >= 4
                new GraphEdgeDto(4, 6, "JDBC", 1, 0.50),
                new GraphEdgeDto(3, 5, "JDBC", 1, 0.70)
        ));
        templates.add(fintech);

        // 3. Streaming Platform (God Service Hub & Service Intimacy)
        ArchitectureGraphDto streaming = new ArchitectureGraphDto();
        streaming.setName("Streaming Platform (Hub God Service)");
        streaming.setDescription("God Service anti-pattern: Video Stream Orchestrator couples to 6 downstream services synchronously with high frequency chatter.");
        streaming.getNodes().addAll(List.of(
                new GraphNodeDto(0, "Edge Gateway", "Gateway", 0, 3, 0.95),
                new GraphNodeDto(1, "Video Orchestrator", "Service", 0, 2, 0.95), // Hub Service
                new GraphNodeDto(2, "Metadata Service", "Service", 0, 2, 0.60),
                new GraphNodeDto(3, "DRM License Service", "Service", 0, 2, 0.70),
                new GraphNodeDto(4, "User Profile Service", "Service", 0, 2, 0.50),
                new GraphNodeDto(5, "Analytics Service", "Service", 0, 1, 0.80),
                new GraphNodeDto(6, "Ad Insertion Service", "Service", 0, 2, 0.75),
                new GraphNodeDto(7, "CDN Routing Service", "Service", 0, 2, 0.85),
                new GraphNodeDto(8, "Media Catalog DB", "Database", 1, 2, 0.65)
        ));
        streaming.getEdges().addAll(List.of(
                new GraphEdgeDto(0, 1, "REST", 1, 0.95),
                new GraphEdgeDto(1, 2, "gRPC", 1, 0.70),
                new GraphEdgeDto(1, 3, "gRPC", 1, 0.80),
                new GraphEdgeDto(1, 4, "REST", 1, 0.50),
                new GraphEdgeDto(1, 5, "REST", 1, 0.85),
                new GraphEdgeDto(1, 6, "gRPC", 1, 0.75),
                new GraphEdgeDto(1, 7, "gRPC", 1, 0.90),
                new GraphEdgeDto(2, 8, "JDBC", 1, 0.60)
        ));
        templates.add(streaming);

        // 4. Decoupled Cloud Native (High Resilience Benchmark)
        ArchitectureGraphDto cloudNative = new ArchitectureGraphDto();
        cloudNative.setName("Cloud Native Event-Driven Architecture");
        cloudNative.setDescription("Well-architected microservices: Database-per-service, Kafka queue event streaming, Redis caching layers, and 3 replicas for all services.");
        cloudNative.getNodes().addAll(List.of(
                new GraphNodeDto(0, "Ingress Gateway", "Gateway", 0, 3, 0.85),
                new GraphNodeDto(1, "Order Service", "Service", 0, 3, 0.65),
                new GraphNodeDto(2, "Order DB", "Database", 1, 3, 0.60),
                new GraphNodeDto(3, "Redis Cache", "Cache", 1, 2, 0.55),
                new GraphNodeDto(4, "Kafka Event Bus", "Queue", 1, 3, 0.70),
                new GraphNodeDto(5, "Fulfillment Service", "Service", 0, 3, 0.50),
                new GraphNodeDto(6, "Fulfillment DB", "Database", 1, 2, 0.45)
        ));
        cloudNative.getEdges().addAll(List.of(
                new GraphEdgeDto(0, 1, "REST", 1, 0.85),
                new GraphEdgeDto(1, 3, "REST", 1, 0.50),
                new GraphEdgeDto(1, 2, "JDBC", 1, 0.55),
                new GraphEdgeDto(1, 4, "AMQP", 0, 0.65),
                new GraphEdgeDto(4, 5, "AMQP", 0, 0.60),
                new GraphEdgeDto(5, 6, "JDBC", 1, 0.45)
        ));
        templates.add(cloudNative);

        return ResponseEntity.ok(templates);
    }
}
