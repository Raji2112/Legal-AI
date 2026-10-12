# LexiScan AI — Legal Document Analyzer

**LexiScan AI** is a professional, full-stack legal technology web application engineered to analyze, summarize, audit, and interrogate contracts and legal instruments. It translates dense legal jargon into plain English, detects and categorizes clauses, flags risks and ambiguities, identifies missing terms, and enables grounded document question-answering with verbatim citations.

---

## 1. Key Capabilities & Features

1. **Executive Summaries**: High-level, simple-English synthesis of the contract, its purpose, effective dates, and governing jurisdiction.
2. **Identified Parties & Responsibilities**: Extraction of contracting parties, defined commercial roles, and explicit covenants.
3. **Clause Detection & Audit**: Granular categorization across 12 legal classifications:
   - Payment and Fees
   - Termination and Default
   - Confidentiality and Non-Disclosure
   - Liability and Indemnification (including liability caps)
   - Renewal (including automatic evergreen renewals)
   - Penalties and Late Charges
   - Dispute Resolution and Arbitration
   - Governing Law and Venue
   - Rights and Obligations
   - Intellectual Property and Work-for-Hire
   - Non-Compete and Restrictive Covenants
   - Force Majeure and General Provisions
4. **Risk Radar & Missing Terms**: Highlights unbalanced indemnification, uncapped liability, ambiguous cure periods, and missing dispute venues without making unsupported legal claims.
5. **Interactive Document Q&A**: Interactive chat grounded strictly in the uploaded document text with verbatim citations, page references, and explicit disclosures when a fact is absent from the text.
6. **Multi-Format Export**: One-click download of polished, professional **PDF Reports**, formatted **Markdown/Text Reports**, and structured **JSON Data**.
7. **Document Ingestion & Validation**:
   - Accepts searchable `.pdf` and plain `.txt` files up to 15MB.
   - Detects scanned image-only PDFs and provides OCR instructions.
   - Detects password-encrypted, empty, or corrupted files with helpful guidance.
   - Includes 4 built-in realistic sample contracts (Mutual NDA, SaaS MSA, Executive Employment & IP Agreement, Commercial Lease) for instant 1-click evaluation.
8. **Analysis History**: Persists past analyses privately in `localStorage` for quick re-examination.

---

## 2. Technology Stack & Multi-Engine Architecture

LexiScan AI features a hybrid architecture designed for college project demonstration and production reliability:

### Frontend & Web Application
- **Framework**: React 19 with TypeScript and Vite 8
- **Styling**: Tailwind CSS 4 with custom legal tech palette (Deep Navy Blue `#0B192C`, Crisp White, and Elegant Gold `#C5A880` / `#D4AF37`)
- **Typography**: Google Fonts (*Cinzel* for regal headings, *Plus Jakarta Sans* for clean interface legibility, *JetBrains Mono* for clause quotes)
- **Icons & Motion**: Lucide React and Motion
- **Document Processing**: `pdfjs-dist` for client-side multi-page PDF text extraction and `jspdf` for PDF report generation

### Server Backend & AI Pipeline
- **Backend Server**: Node.js & Express server (`server.ts` / `src/server/`) serving API endpoints on port 3000
- **AI Intelligence**: Google Gemini 3.8 Flash accessed through `@google/genai` TypeScript SDK via server-side proxy
- **Security**: The API key is stored strictly on the server (`process.env.GEMINI_API_KEY`) and never exposed to browser client bundles

### Native Research Backend (`backend_python_mojo/`)
For the college project requirements, a dedicated backend module demonstrates all five specified technologies:

| Technology | Implementation File | Role in LexiScan AI Pipeline |
| :--- | :--- | :--- |
| **Python** | `backend_python_mojo/app.py` | FastAPI REST service orchestrating ingestion, endpoints, and bridges. |
| **LangChain** | `backend_python_mojo/langchain_analyzer.py` | `RecursiveCharacterTextSplitter` with legal boundary separators (`ARTICLE`, `Section`, `WHEREAS`) for coherent clause chunking. |
| **ChromaDB** | `backend_python_mojo/chroma_retriever.py` | Local persistent vector database storing high-dimensional clause embeddings for semantic cosine similarity queries. |
| **Modular MAX** | `backend_python_mojo/max_inference.py` | Modular Accelerated Xecution engine compiling transformer execution graphs for high-throughput local model execution. |
| **Mojo** | `backend_python_mojo/clause_matcher.mojo` | SIMD-accelerated zero-copy string scanning kernel written in Mojo for microsecond-latency keyword matching across contracts. |

---

## 3. Environment Compatibility & Setup Instructions

### Deploying to Render
See [RENDER_DEPLOYMENT.md](file:///c:/Users/user/Downloads/lexiscan-ai-%E2%80%94-legal-document-analyzer/RENDER_DEPLOYMENT.md) for full instructions.

**Quick Blueprint Deploy (1-Click)**:
1. Push this repository to GitHub or GitLab.
2. In Render Dashboard, click **New +** -> **Blueprint**.
3. Select your repository (Render automatically detects `render.yaml`).
4. Enter your `GEMINI_API_KEY` when prompted and click **Apply**.

**Manual Web Service Settings**:
- **Runtime**: `Node`
- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`
- **Environment Variable**: `GEMINI_API_KEY=your_key_here`, `NODE_ENV=production`

---

### Running Locally
1. **Clone or open the project directory**.
2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Secrets**:
   Copy `.env.example` to `.env`:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=3000
   ```
4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000`.

5. **Build & Run Production Locally**:
   ```bash
   npm run build
   npm start
   ```

---

### Running the Python + Mojo Backend (Optional Local Companion)
To execute the Python/Mojo backend locally:
```bash
cd backend_python_mojo

# Install Python requirements
pip install -r requirements.txt

# (Optional) Compile native Mojo kernel if Modular CLI is installed
mojo build clause_matcher.mojo -o clause_matcher.so

# Start the FastAPI service
python3 app.py
```
API Documentation will be available at `http://localhost:8000/docs`.

---

## 4. Verification Checklist

- [x] **Home screen**: Displays "Understand Legal Documents with AI" with responsive navigation.
- [x] **Upload & Extraction**: Accurately extracts text from `.pdf` and `.txt` files with page counts.
- [x] **Scanned PDF Handling**: Detects image-based PDFs lacking text layer and guides users to OCR.
- [x] **Sample Contracts**: One-click instant loading for NDA, SaaS MSA, Employment, and Commercial Lease.
- [x] **AI Summary & Clauses**: Generates structured executive summary, parties, and categorized clauses with risk flags.
- [x] **Interactive Q&A**: Answers questions strictly grounded in the uploaded document with quotes.
- [x] **Report Generation**: Exports formatted PDF, Markdown text, and JSON reports with document name and timestamp.
- [x] **Security & Privacy**: Ephemeral in-memory processing, zero permanent storage, clear data button.
- [x] **Legal Disclaimer**: Prominently visible educational disclaimer banner throughout the application.

---

## 5. Educational Disclaimer

> **Notice**: LexiScan AI provides general educational assistance and preliminary document analysis. It does not provide legal advice and does not substitute for consultation with a licensed attorney.
