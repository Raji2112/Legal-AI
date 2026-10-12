import React from "react";
import {
  Scale,
  Sparkles,
  ShieldAlert,
  MessageSquare,
  FileText,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
  BookOpen,
  History,
} from "lucide-react";
import { DocumentUploadCard } from "./DocumentUploadCard.js";
import { ExtractedDocument } from "../utils/documentExtractor.js";
import { SavedAnalysis } from "../types.js";
import { SAMPLE_DOCUMENTS } from "../data/sampleDocuments.js";

interface DashboardViewProps {
  onDocumentExtracted: (doc: ExtractedDocument) => void;
  isProcessing: boolean;
  history: SavedAnalysis[];
  onSelectSaved: (saved: SavedAnalysis) => void;
  onNavigateToAnalyze: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onDocumentExtracted,
  isProcessing,
  history,
  onSelectSaved,
  onNavigateToAnalyze,
}) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-[#C5A880]/30 text-xs font-semibold text-[#E5C378] shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Professional Legal Document Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif-legal leading-[1.15]">
          Understand Legal Documents with AI
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Upload any contract or agreement to extract actionable plain-English summaries, detect hidden risks, inspect critical clauses, and ask questions with cited verbatim excerpts.
        </p>

        {/* Legal Disclaimer Pill */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 max-w-xl mx-auto">
          ⚖️ Educational & preliminary analysis tool. Does not constitute formal legal advice.
        </div>
      </section>

      {/* Main Drag-and-Drop Ingestion Area */}
      <section className="max-w-3xl mx-auto">
        <DocumentUploadCard
          onDocumentExtracted={onDocumentExtracted}
          isProcessing={isProcessing}
        />
      </section>

      {/* Recent Analysis Strip (if available) */}
      {history.length > 0 && (
        <section className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <History className="w-4 h-4 text-[#E5C378]" />
              <span>Recent Document Analyses</span>
            </div>
            <span className="text-xs text-slate-400">
              {history.length} saved locally
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectSaved(item)}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-[#C5A880]/50 hover:bg-slate-800/80 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900/50">
                    {item.documentType}
                  </span>
                  <h4 className="mt-2 text-xs font-bold text-white group-hover:text-[#E5C378] transition-colors truncate">
                    {item.documentName}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                    {item.analysis.executiveSummary}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-[#E5C378]">
                  <span>View Report</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Platform Capabilities Grid */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white font-serif-legal">
            Complete Legal Technology Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered with strict legal tech design principles and precision AI grounding
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Executive Summaries</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synthesizes multi-page legal prose into clear, simple English explaining what the contract is, who signs it, and core objectives.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/60 flex items-center justify-center text-[#E5C378]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Clause Detection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Categorizes provisions across 12 legal classifications: Termination, Indemnity, Automatic Renewal, IP, and Penalties with citations.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800/60 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Red Flag Radar</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Highlights unbalanced obligations, uncapped liabilities, missing dispute venues, and non-compete enforceability risks.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Grounded Q&A Chat</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask any question about your agreement. LexiScan quotes supporting contract text verbatim and disclaims unstated facts.
            </p>
          </div>
        </div>
      </section>

      {/* College Project Architecture Highlight Banner */}
      <section className="p-7 rounded-2xl border border-[#C5A880]/30 bg-gradient-to-r from-slate-950 via-[#0B192C] to-slate-950 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-[#E5C378] text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Academic Capstone Innovation</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Python, LangChain, ChromaDB, Modular MAX & Mojo Integrated
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Includes a dedicated native backend codebase combining Mojo SIMD string scanning kernels, LangChain text splitters, ChromaDB vector storage, and Modular MAX Engine acceleration.
          </p>
        </div>

        <button
          onClick={onNavigateToAnalyze}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#E5C378] text-xs font-bold border border-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          Try Live Analysis &rarr;
        </button>
      </section>
    </div>
  );
};
