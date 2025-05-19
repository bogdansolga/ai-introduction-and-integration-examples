BEGIN TRANSACTION;

-- Enable the pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

CREATE SEQUENCE IF NOT EXISTS embeddings_seq START WITH 1 INCREMENT BY 1;

create TABLE IF NOT EXISTS embeddings
(
    id          BIGINT PRIMARY KEY DEFAULT nextval('embeddings_seq'),
    content     text not null unique,
    embedding   vector(1536)  not null,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_embedding_content_hash ON embeddings (MD5(content));

COMMIT;
