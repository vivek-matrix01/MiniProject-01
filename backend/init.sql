-- Architecture Reviewer Database Initialization Script
CREATE TABLE IF NOT EXISTS architecture_designs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    system_type VARCHAR(100) DEFAULT 'Microservice',
    node_count INT NOT NULL,
    edge_count INT NOT NULL,
    graph_data_json TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS review_reports (
    id BIGSERIAL PRIMARY KEY,
    architecture_id BIGINT REFERENCES architecture_designs(id) ON DELETE CASCADE,
    overall_health_score DOUBLE PRECISION NOT NULL,
    reliability_score DOUBLE PRECISION NOT NULL,
    scalability_score DOUBLE PRECISION NOT NULL,
    coupling_score DOUBLE PRECISION NOT NULL,
    availability_score DOUBLE PRECISION NOT NULL,
    deterministic_cycles INT DEFAULT 0,
    deterministic_spofs INT DEFAULT 0,
    smells_detected_count INT NOT NULL,
    smells_json TEXT NOT NULL,
    counterfactuals_json TEXT,
    inference_time_ms DOUBLE PRECISION,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_arch_created_at ON architecture_designs(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_arch_id ON review_reports(architecture_id);
