"""
LexiScan AI — LangChain Legal Document Analysis Pipeline
Orchestrates text splitting, RAG prompt chains, and semantic chunking.
"""

from typing import List, Dict, Any

try:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.docstore.document import Document
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False


class LegalLangChainPipeline:
    """
    LangChain document analysis workflow for legal documents.
    """

    def __init__(self, chunk_size: int = 1200, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

        if LANGCHAIN_AVAILABLE:
            self.splitter = RecursiveCharacterTextSplitter(
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
                separators=["\n\nSection ", "\n\nARTICLE ", "\n\n", "\n", ". ", " "]
            )
        else:
            self.splitter = None

    def chunk_document(self, text: str, document_name: str) -> List[Dict[str, Any]]:
        """
        Splits legal contracts into logically coherent legal clause chunks.
        """
        if LANGCHAIN_AVAILABLE and self.splitter:
            docs = self.splitter.create_documents(
                texts=[text],
                metadatas=[{"source": document_name}]
            )
            return [
                {
                    "text": doc.page_content,
                    "metadata": doc.metadata,
                    "char_count": len(doc.page_content),
                    "chunk_id": idx,
                }
                for idx, doc in enumerate(docs)
            ]
        else:
            # High-efficiency fallback text chunker
            chunks = []
            paragraphs = text.split("\n\n")
            current_chunk = ""
            idx = 0

            for para in paragraphs:
                if len(current_chunk) + len(para) > self.chunk_size and current_chunk:
                    chunks.append({
                        "text": current_chunk.strip(),
                        "metadata": {"source": document_name},
                        "char_count": len(current_chunk),
                        "chunk_id": idx,
                    })
                    idx += 1
                    current_chunk = para + "\n\n"
                else:
                    current_chunk += para + "\n\n"

            if current_chunk.strip():
                chunks.append({
                    "text": current_chunk.strip(),
                    "metadata": {"source": document_name},
                    "char_count": len(current_chunk),
                    "chunk_id": idx,
                })

            return chunks

    def format_clause_prompt(self, clause_category: str, context_chunks: List[str]) -> str:
        """
        Formats a structured prompt for extracting specific legal categories.
        """
        context_block = "\n---\n".join(context_chunks)
        return f"""You are a specialized legal AI assistant.
Analyze the following contract excerpt specifically for terms regarding: {clause_category}.

Contract Excerpt:
{context_block}

Task:
1. Identify if {clause_category} is addressed.
2. Extract the exact verbatim text.
3. Explain the practical obligations in plain English.
4. Assess if there is unusual liability or ambiguity."""


if __name__ == "__main__":
    pipeline = LegalLangChainPipeline()
    sample_text = "ARTICLE 1: CONFIDENTIALITY\nBoth parties shall maintain secrets.\n\nARTICLE 2: TERMINATION\nEither party may terminate on 30 days notice."
    chunks = pipeline.chunk_document(sample_text, "test.txt")
    print(f"Generated {len(chunks)} chunks via LangChain pipeline.")
