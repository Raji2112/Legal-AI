"""
LexiScan AI — College Project Backend Service
Combines Python, LangChain, ChromaDB, Modular MAX, and Mojo into a cohesive architecture.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import time

from mojo_bridge import MojoClauseScanner
from chroma_retriever import LegalChromaStore
from langchain_analyzer import LegalLangChainPipeline
from max_inference import ModularMAXInferenceEngine

app = FastAPI(
    title="LexiScan AI — Python & Mojo Backend Engine",
    description="Full-stack legal document processing pipeline integrating Python, LangChain, ChromaDB, Modular MAX, and Mojo.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Subsystems
mojo_scanner = MojoClauseScanner()
chroma_store = LegalChromaStore()
langchain_pipe = LegalLangChainPipeline()
max_engine = ModularMAXInferenceEngine()


class DocumentAnalysisRequest(BaseModel):
    document_name: str
    document_text: str
    run_mojo_scan: Optional[bool] = True
    index_in_chromadb: Optional[bool] = True


class SemanticQueryRequest(BaseModel):
    query: str
    document_id: Optional[str] = None
    limit: Optional[int] = 5


@app.get("/health")
def health():
    return {
        "status": "online",
        "service": "LexiScan AI Python/Mojo Backend",
        "components": {
            "python_runtime": "Active (Python 3.10+)",
            "langchain_pipeline": "Initialized",
            "chroma_vector_db": "Active" if chroma_store.collection else "Ready (Fallback mode)",
            "modular_max_engine": "Configured" if max_engine.is_available() else "Ready (Hardware Dependent)",
            "mojo_simd_kernel": "Active (Native)" if mojo_scanner.is_native_mojo_active else "Active (Bridge Mode)",
        },
        "timestamp": time.time(),
    }


@app.post("/api/v1/fast-clause-scan")
def fast_clause_scan(payload: DocumentAnalysisRequest):
    """
    Executes Mojo-accelerated SIMD keyword and pattern scanning across the contract.
    """
    if not payload.document_text:
        raise HTTPException(status_code=400, detail="Document text cannot be empty.")

    scan_result = mojo_scanner.scan_text(payload.document_text)
    return {
        "document_name": payload.document_name,
        "mojo_result": scan_result,
    }


@app.post("/api/v1/chunk-and-index")
def chunk_and_index(payload: DocumentAnalysisRequest):
    """
    Uses LangChain to split the document and indexes chunks into ChromaDB for vector retrieval.
    """
    chunks = langchain_pipe.chunk_document(payload.document_text, payload.document_name)
    
    chroma_result = None
    if payload.index_in_chromadb:
        chroma_result = chroma_store.store_document_chunks(
            document_id=payload.document_name.replace(" ", "_"),
            document_name=payload.document_name,
            chunks=chunks
        )

    return {
        "document_name": payload.document_name,
        "total_chunks_created": len(chunks),
        "chunks_preview": chunks[:3],
        "chroma_indexing": chroma_result,
    }


@app.post("/api/v1/semantic-search")
def semantic_search(payload: SemanticQueryRequest):
    """
    Performs vector similarity search in ChromaDB for specific clauses.
    """
    matches = chroma_store.semantic_query(
        query=payload.query,
        n_results=payload.limit,
        document_id=payload.document_id
    )
    return {
        "query": payload.query,
        "match_count": len(matches),
        "matches": matches,
    }


@app.get("/api/v1/max-acceleration-profile")
def max_profile():
    """
    Returns Modular MAX Engine acceleration profile and supported models.
    """
    return max_engine.get_hardware_acceleration_profile()


if __name__ == "__main__":
    import uvicorn
    print("Starting LexiScan AI Python/Mojo Backend on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
