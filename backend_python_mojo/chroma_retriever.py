"""
LexiScan AI — ChromaDB Vector Store & Semantic Retrieval Module
Manages vector collections, document embeddings, and semantic clause searches.
"""

import os
import uuid
from typing import List, Dict, Any

try:
    import chromadb
    from chromadb.config import Settings
    CHROMA_AVAILABLE = True
except ImportError:
    CHROMA_AVAILABLE = False


class LegalChromaStore:
    """
    Vector database manager for semantic retrieval of legal clauses using ChromaDB.
    """

    def __init__(self, persist_directory: str = "./chroma_db"):
        self.persist_directory = persist_directory
        self.client = None
        self.collection = None

        if CHROMA_AVAILABLE:
            try:
                os.makedirs(self.persist_directory, exist_ok=True)
                self.client = chromadb.PersistentClient(path=self.persist_directory)
                self.collection = self.client.get_or_create_collection(
                    name="lexiscan_contracts",
                    metadata={"description": "Vector index of extracted legal contract clauses"}
                )
            except Exception as e:
                print(f"[LexiScan Chroma] Error initializing ChromaDB: {e}")
        else:
            print("[LexiScan Chroma] Note: chromadb package not installed. Operating in fallback mode.")

    def store_document_chunks(
        self,
        document_id: str,
        document_name: str,
        chunks: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Embeds and stores document chunks in ChromaDB.
        """
        if not self.collection:
            return {
                "success": False,
                "message": "ChromaDB is not active in this environment.",
                "chunks_stored": 0,
            }

        ids = []
        documents = []
        metadatas = []

        for idx, chunk in enumerate(chunks):
            chunk_id = f"{document_id}_chunk_{idx}_{uuid.uuid4().hex[:6]}"
            ids.append(chunk_id)
            documents.append(chunk.get("text", ""))
            metadatas.append({
                "document_id": document_id,
                "document_name": document_name,
                "page_number": chunk.get("page", 1),
                "chunk_index": idx,
            })

        self.collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )

        return {
            "success": True,
            "message": f"Successfully indexed {len(ids)} chunks in ChromaDB.",
            "chunks_stored": len(ids),
            "collection_name": self.collection.name,
        }

    def semantic_query(
        self,
        query: str,
        n_results: int = 5,
        document_id: str = None
    ) -> List[Dict[str, Any]]:
        """
        Performs semantic vector similarity search against indexed legal clauses.
        """
        if not self.collection:
            return []

        where_filter = {"document_id": document_id} if document_id else None

        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            where=where_filter
        )

        formatted_matches = []
        if results and "documents" in results and len(results["documents"]) > 0:
            doc_list = results["documents"][0]
            meta_list = results.get("metadatas", [[]])[0]
            dist_list = results.get("distances", [[]])[0] if "distances" in results else []

            for i, doc in enumerate(doc_list):
                meta = meta_list[i] if i < len(meta_list) else {}
                dist = dist_list[i] if i < len(dist_list) else 0.0
                similarity_score = round(max(0.0, 1.0 - (dist if dist is not None else 0.5)), 3)

                formatted_matches.append({
                    "text": doc,
                    "document_name": meta.get("document_name", "Unknown"),
                    "page_number": meta.get("page_number", 1),
                    "chunk_index": meta.get("chunk_index", 0),
                    "similarity_score": similarity_score,
                })

        return formatted_matches


if __name__ == "__main__":
    store = LegalChromaStore()
    if CHROMA_AVAILABLE:
        print("ChromaDB vector store initialized successfully.")
    else:
        print("ChromaDB ready for installation.")
