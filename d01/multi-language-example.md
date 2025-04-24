# Simple RAG Implementation Example

This example demonstrates a basic RAG (Retrieval Augmented Generation) implementation across three programming languages. Follow the steps below to understand and run the example in your preferred language.

## 🎯 Learning Objective

Implement a simple RAG system that:
1. Processes text documents into chunks
2. Creates and stores embeddings
3. Performs semantic search
4. Generates contextually enhanced responses using an LLM

## ⏱️ Duration: 15-20 minutes

## 📋 Prerequisites

- API key for OpenAI or Anthropic
- Basic knowledge of the chosen programming language
- Environment setup according to language requirements

## 🗂️ Files Structure

```
/simple_rag/
├── README.md               # This instruction file
├── /common/
│   ├── sample_docs/        # Sample documents for testing
│   │   ├── ai_ethics.txt
│   │   ├── neural_networks.txt
│   │   └── transformers.txt
│   └── prompts.json        # Common prompts for all implementations
├── /python/
│   ├── requirements.txt
│   ├── simple_rag.py       # Complete Python implementation
│   └── README.md           # Python-specific instructions
├── /java/
│   ├── pom.xml
│   ├── src/                # Complete Java implementation 
│   └── README.md           # Java-specific instructions
└── /typescript/
    ├── package.json
    ├── tsconfig.json
    ├── src/                # Complete TypeScript implementation
    └── README.md           # TypeScript-specific instructions
```

## 🧩 Implementations

Choose your preferred language implementation:

### Python Implementation

```python
# simple_rag.py

import os
import json
import openai
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# 1. Configuration
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "your-api-key-here")
openai.api_key = OPENAI_API_KEY
EMBEDDING_MODEL = "text-embedding-ada-002"
LLM_MODEL = "gpt-3.5-turbo"

# 2. Document processing
def load_documents(directory):
    """Load documents from a directory."""
    documents = []
    for filename in os.listdir(directory):
        if filename.endswith(".txt"):
            with open(os.path.join(directory, filename), "r") as f:
                documents.append({"id": filename, "text": f.read()})
    return documents

def chunk_document(document, chunk_size=500, overlap=50):
    """Split a document into chunks."""
    text = document["text"]
    chunks = []
    
    for i in range(0, len(text), chunk_size - overlap):
        chunk_text = text[i:i + chunk_size]
        if len(chunk_text) >= 100:  # Avoid tiny chunks
            chunks.append({
                "id": f"{document['id']}_chunk_{i}",
                "text": chunk_text,
                "source": document["id"]
            })
            
    return chunks

# 3. Embedding creation
def create_embedding(text):
    """Create an embedding for the given text."""
    response = openai.Embedding.create(
        input=text,
        model=EMBEDDING_MODEL
    )
    return response["data"][0]["embedding"]

def embed_chunks(chunks):
    """Create embeddings for all chunks."""
    for chunk in chunks:
        chunk["embedding"] = create_embedding(chunk["text"])
    return chunks

# 4. Retrieval
def semantic_search(query, chunks, top_k=3):
    """Find the most relevant chunks for a query."""
    query_embedding = create_embedding(query)
    
    # Convert the embeddings to a numpy array for efficient cosine similarity calculation
    chunk_embeddings = np.array([chunk["embedding"] for chunk in chunks])
    query_embedding_array = np.array(query_embedding).reshape(1, -1)
    
    # Calculate similarity scores
    similarities = cosine_similarity(query_embedding_array, chunk_embeddings)[0]
    
    # Sort chunks by similarity score
    results = sorted(
        [{"chunk": chunk, "score": float(score)} 
         for chunk, score in zip(chunks, similarities)],
        key=lambda x: x["score"],
        reverse=True
    )
    
    # Return top k results
    return results[:top_k]

# 5. Response generation
def generate_response(query, context_chunks):
    """Generate a response using the LLM with retrieved context."""
    # Create system prompt with context
    context_text = "\n\n".join([chunk["chunk"]["text"] for chunk in context_chunks])
    
    system_prompt = f"""
    You are a helpful AI assistant. Answer the user's question based on the following context:
    
    {context_text}
    
    If the context doesn't contain relevant information, acknowledge that and provide a general response.
    Always cite the source document when possible.
    """
    
    # Generate response
    response = openai.ChatCompletion.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ],
        temperature=0.3,
        max_tokens=500
    )
    
    return response.choices[0].message["content"]

# 6. Main RAG pipeline
def run_rag_pipeline(query, docs_directory="./common/sample_docs"):
    """Run the complete RAG pipeline."""
    print(f"Query: {query}")
    print("Loading documents...")
    documents = load_documents(docs_directory)
    
    print("Chunking documents...")
    all_chunks = []
    for doc in documents:
        all_chunks.extend(chunk_document(doc))
    
    print(f"Created {len(all_chunks)} chunks")
    
    print("Creating embeddings...")
    embedded_chunks = embed_chunks(all_chunks)
    
    print("Retrieving relevant chunks...")
    results = semantic_search(query, embedded_chunks)
    
    print(f"Top {len(results)} relevant chunks:")
    for i, result in enumerate(results):
        print(f"Result {i+1} (Score: {result['score']:.4f}):")
        print(f"Source: {result['chunk']['source']}")
        print(f"Preview: {result['chunk']['text'][:100]}...\n")
    
    print("Generating response...")
    response = generate_response(query, results)
    
    print("\nFinal Response:")
    print(response)
    
    return response

# Example usage
if __name__ == "__main__":
    query = "What are neural networks and how do they work?"
    run_rag_pipeline(query)
```

### Java Implementation

```java
// SimpleRag.java

package com.example.rag;

import com.knuddels.jtokkit.Encodings;
import com.knuddels.jtokkit.api.Encoding;
import com.knuddels.jtokkit.api.EncodingRegistry;
import com.knuddels.jtokkit.api.EncodingType;
import com.theokanning.openai.OpenAiService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.embedding.EmbeddingRequest;
import com.theokanning.openai.embedding.EmbeddingResult;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class SimpleRag {
    private static final String OPENAI_API_KEY = System.getenv("OPENAI_API_KEY");
    private static final String EMBEDDING_MODEL = "text-embedding-ada-002";
    private static final String LLM_MODEL = "gpt-3.5-turbo";
    private static final OpenAiService service = new OpenAiService(OPENAI_API_KEY);

    public static void main(String[] args) {
        String query = "What are neural networks and how do they work?";
        runRagPipeline(query, "./common/sample_docs");
    }

    // 6. Main RAG pipeline
    public static String runRagPipeline(String query, String docsDirectory) {
        System.out.println("Query: " + query);
        System.out.println("Loading documents...");
        List<Document> documents = loadDocuments(docsDirectory);

        System.out.println("Chunking documents...");
        List<Chunk> allChunks = new ArrayList<>();
        for (Document doc : documents) {
            allChunks.addAll(chunkDocument(doc));
        }
        System.out.println("Created " + allChunks.size() + " chunks");

        System.out.println("Creating embeddings...");
        List<Chunk> embeddedChunks = embedChunks(allChunks);

        System.out.println("Retrieving relevant chunks...");
        List<ChunkScore> results = semanticSearch(query, embeddedChunks, 3);

        System.out.println("Top " + results.size() + " relevant chunks:");
        for (int i = 0; i < results.size(); i++) {
            ChunkScore result = results.get(i);
            System.out.println("Result " + (i + 1) + " (Score: " + String.format("%.4f", result.score) + "):");
            System.out.println("Source: " + result.chunk.source);
            String preview = result.chunk.text.length() > 100 ? result.chunk.text.substring(0, 100) + "..." : result.chunk.text;
            System.out.println("Preview: " + preview + "\n");
        }

        System.out.println("Generating response...");
        String response = generateResponse(query, results);

        System.out.println("\nFinal Response:");
        System.out.println(response);

        return response;
    }

    // 1. Document processing
    public static List<Document> loadDocuments(String directory) {
        List<Document> documents = new ArrayList<>();
        try (Stream<Path> paths = Files.walk(Paths.get(directory))) {
            paths.filter(Files::isRegularFile)
                    .filter(path -> path.toString().endsWith(".txt"))
                    .forEach(path -> {
                        try {
                            String content = Files.readString(path);
                            documents.add(new Document(path.getFileName().toString(), content));
                        } catch (IOException e) {
                            System.err.println("Error reading file: " + path);
                            e.printStackTrace();
                        }
                    });
        } catch (IOException e) {
            System.err.println("Error walking directory: " + directory);
            e.printStackTrace();
        }
        return documents;
    }

    // 2. Document chunking
    public static List<Chunk> chunkDocument(Document document) {
        String text = document.text;
        List<Chunk> chunks = new ArrayList<>();
        int chunkSize = 500;
        int overlap = 50;

        for (int i = 0; i < text.length(); i += (chunkSize - overlap)) {
            int end = Math.min(i + chunkSize, text.length());
            String chunkText = text.substring(i, end);
            
            if (chunkText.length() >= 100) {  // Avoid tiny chunks
                chunks.add(new Chunk(document.id + "_chunk_" + i, chunkText, document.id));
            }
        }
        return chunks;
    }

    // 3. Embedding creation
    public static List<Float> createEmbedding(String text) {
        EmbeddingRequest embeddingRequest = EmbeddingRequest.builder()
                .model(EMBEDDING_MODEL)
                .input(Collections.singletonList(text))
                .build();
        
        EmbeddingResult result = service.createEmbeddings(embeddingRequest);
        return result.getData().get(0).getEmbedding();
    }

    public static List<Chunk> embedChunks(List<Chunk> chunks) {
        for (Chunk chunk : chunks) {
            chunk.embedding = createEmbedding(chunk.text);
        }
        return chunks;
    }

    // 4. Retrieval
    public static List<ChunkScore> semanticSearch(String query, List<Chunk> chunks, int topK) {
        List<Float> queryEmbedding = createEmbedding(query);
        List<ChunkScore> scores = new ArrayList<>();

        for (Chunk chunk : chunks) {
            double similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
            scores.add(new ChunkScore(chunk, (float) similarity));
        }

        // Sort by score descending
        scores.sort(Comparator.comparing(ChunkScore::getScore).reversed());
        
        // Return top k results
        return scores.stream().limit(topK).collect(Collectors.toList());
    }

    // 5. Response generation
    public static String generateResponse(String query, List<ChunkScore> contextChunks) {
        // Create system prompt with context
        String contextText = contextChunks.stream()
                .map(cs -> cs.chunk.text)
                .collect(Collectors.joining("\n\n"));

        String systemPrompt = "You are a helpful AI assistant. Answer the user's question based on the following context:\n\n" +
                contextText + "\n\n" +
                "If the context doesn't contain relevant information, acknowledge that and provide a general response.\n" +
                "Always cite the source document when possible.";

        // Generate response
        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                .model(LLM_MODEL)
                .messages(Arrays.asList(
                        new ChatMessage("system", systemPrompt),
                        new ChatMessage("user", query)
                ))
                .temperature(0.3)
                .maxTokens(500)
                .build();

        return service.createChatCompletion(chatCompletionRequest)
                .getChoices().get(0).getMessage().getContent();
    }

    // Helper function for cosine similarity
    private static double cosineSimilarity(List<Float> vec1, List<Float> vec2) {
        if (vec1.size() != vec2.size()) {
            throw new IllegalArgumentException("Vectors must have the same dimensionality");
        }

        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;

        for (int i = 0; i < vec1.size(); i++) {
            dotProduct += vec1.get(i) * vec2.get(i);
            norm1 += Math.pow(vec1.get(i), 2);
            norm2 += Math.pow(vec2.get(i), 2);
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    // Data structures
    static class Document {
        String id;
        String text;

        public Document(String id, String text) {
            this.id = id;
            this.text = text;
        }
    }

    static class Chunk {
        String id;
        String text;
        String source;
        List<Float> embedding;

        public Chunk(String id, String text, String source) {
            this.id = id;
            this.text = text;
            this.source = source;
        }
    }

    static class ChunkScore {
        Chunk chunk;
        float score;

        public ChunkScore(Chunk chunk, float score) {
            this.chunk = chunk;
            this.score = score;
        }

        public float getScore() {
            return score;
        }
    }
}
```

### TypeScript Implementation

```typescript
// simpleRag.ts

import * as fs from 'fs';
import * as path from 'path';
import { OpenAI } from 'openai';

// 1. Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-api-key-here';
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const EMBEDDING_MODEL = 'text-embedding-ada-002';
const LLM_MODEL = 'gpt-3.5-turbo';

// Interface definitions
interface Document {
  id: string;
  text: string;
}

interface Chunk {
  id: string;
  text: string;
  source: string;
  embedding?: number[];
}

interface ChunkScore {
  chunk: Chunk;
  score: number;
}

// 2. Document processing
async function loadDocuments(directory: string): Promise<Document[]> {
  const documents: Document[] = [];
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    if (file.endsWith('.txt')) {
      const filePath = path.join(directory, file);
      const text = fs.readFileSync(filePath, 'utf-8');
      documents.push({ id: file, text });
    }
  }
  
  return documents;
}

function chunkDocument(document: Document, chunkSize = 500, overlap = 50): Chunk[] {
  const text = document.text;
  const chunks: Chunk[] = [];
  
  for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
    const chunkText = text.substring(i, i + chunkSize);
    
    if (chunkText.length >= 100) { // Avoid tiny chunks
      chunks.push({
        id: `${document.id}_chunk_${i}`,
        text: chunkText,
        source: document.id
      });
    }
  }
  
  return chunks;
}

// 3. Embedding creation
async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text
  });
  
  return response.data[0].embedding;
}

async function embedChunks(chunks: Chunk[]): Promise<Chunk[]> {
  for (const chunk of chunks) {
    chunk.embedding = await createEmbedding(chunk.text);
  }
  
  return chunks;
}

// 4. Retrieval
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function semanticSearch(query: string, chunks: Chunk[], topK = 3): Promise<ChunkScore[]> {
  const queryEmbedding = await createEmbedding(query);
  
  // Calculate similarity for each chunk
  const results: ChunkScore[] = chunks.map(chunk => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding!)
  }));
  
  // Sort by similarity score (descending)
  results.sort((a, b) => b.score - a.score);
  
  // Return top k results
  return results.slice(0, topK);
}

// 5. Response generation
async function generateResponse(query: string, contextChunks: ChunkScore[]): Promise<string> {
  // Create system prompt with context
  const contextText = contextChunks.map(item => item.chunk.text).join('\n\n');
  
  const systemPrompt = `
  You are a helpful AI assistant. Answer the user's question based on the following context:
  
  ${contextText}
  
  If the context doesn't contain relevant information, acknowledge that and provide a general response.
  Always cite the source document when possible.
  `;
  
  // Generate response
  const response = await openai.chat.completions.create({
    model: LLM_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ],
    temperature: 0.3,
    max_tokens: 500
  });
  
  return response.choices[0].message.content || 'No response generated';
}

// 6. Main RAG pipeline
async function runRagPipeline(query: string, docsDirectory = './common/sample_docs'): Promise<string> {
  console.log(`Query: ${query}`);
  console.log('Loading documents...');
  const documents = await loadDocuments(docsDirectory);
  
  console.log('Chunking documents...');
  let allChunks: Chunk[] = [];
  for (const doc of documents) {
    allChunks = allChunks.concat(chunkDocument(doc));
  }
  
  console.log(`Created ${allChunks.length} chunks`);
  
  console.log('Creating embeddings...');
  const embeddedChunks = await embedChunks(allChunks);
  
  console.log('Retrieving relevant chunks...');
  const results = await semanticSearch(query, embeddedChunks);
  
  console.log(`Top ${results.length} relevant chunks:`);
  for (let i = 0; i < results.length; i++) {
    console.log(`Result ${i+1} (Score: ${results[i].score.toFixed(4)}):`);
    console.log(`Source: ${results[i].chunk.source}`);
    console.log(`Preview: ${results[i].chunk.text.substring(0, 100)}...\n`);
  }
  
  console.log('Generating response...');
  const response = await generateResponse(query, results);
  
  console.log('\nFinal Response:');
  console.log(response);
  
  return response;
}

// Example usage
(async () => {
  const query = "What are neural networks and how do they work?";
  await runRagPipeline(query);
})();
```

## 🚀 Getting Started

### For Python Users

1. Navigate to the Python directory:
   ```
   cd simple_rag/python
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set your OpenAI API key:
   ```
   export OPENAI_API_KEY=your-api-key-here
   ```

4. Run the example:
   ```
   python simple_rag.py
   ```

### For Java Users

1. Navigate to the Java directory:
   ```
   cd simple_rag/java
   ```

2. Build the project:
   ```
   mvn compile
   ```

3. Set your OpenAI API key:
   ```
   export OPENAI_API_KEY=your-api-key-here
   ```

4. Run the example:
   ```
   mvn exec:java -Dexec.mainClass="com.example.rag.SimpleRag"
   ```

### For TypeScript Users

1. Navigate to the TypeScript directory:
   ```
   cd simple_rag/typescript
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set your OpenAI API key:
   ```
   export OPENAI_API_KEY=your-api-key-here
   ```

4. Run the example:
   ```
   npx ts-node src/simpleRag.ts
   ```

## 🔍 What to Observe

As you run this example, pay attention to:

1. How documents are broken into chunks
2. The relevance scores of retrieved chunks
3. How the final response incorporates information from the chunks
4. The citation of sources in the response

## 🧪 Experiment Ideas

1. Try different chunk sizes (larger/smaller) and observe retrieval quality
2. Test with different queries to see how retrieval changes
3. Modify the system prompt to change the style or format of responses
4. Try adding more documents to the sample collection

## 📚 Further Learning

- Explore chunking strategies (semantic vs. fixed-size)
- Implement metadata filtering for more targeted retrieval
- Add reranking to improve relevance
- Implement caching of embeddings for better performance