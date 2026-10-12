import React, { useState } from "react";
import { Sparkles, FileText, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, Eye, EyeOff } from "lucide-react";
import { DocumentUploadCard } from "./DocumentUploadCard.js";
import { AnalysisResultsDashboard } from "./AnalysisResultsDashboard.js";
import { ExtractedDocument } from "../utils/documentExtractor.js";
import { LegalAnalysisResult } from "../server/api.js";
import { SavedAnalysis } from "../types.js";

interface AnalyzeDocumentViewProps {
  currentDocument: ExtractedDocument | null;
  currentAnalysis: LegalAnalysisResult | null;
  isAnalyzing: boolean;
  onDocumentExtracted: (doc: ExtractedDocument) => void;
  onPerformAnalysis: (doc: ExtractedDocument) => void;
  onClearDocument: () => void;
  errorMessage: string | null;
}

export const AnalyzeDocumentView: React.FC<AnalyzeDocumentViewProps> = ({
  currentDocument,
  currentAnalysis,
  isAnalyzing,
  onDocumentExtracted,
  onPerformAnalysis,
  onClearDocument,
  errorMessage,
}) => {
  const [showPreviewText, setShowPreviewText] = useState(false);

  // If analysis is already performed, show the full interactive dashboard
  if (currentAnalysis && currentDocument) {
    return (
      <AnalysisResultsDashboard
        analysis={currentAnalysis}
        extractedText={currentDocument.text}
        pageCount={currentDocument.pageCount}
        onClearAnalysis={onClearDocument}
        onReanalyze={() => onPerformAnalysis(currentDocument)}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Step Header */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#E5C378] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Document Ingestion & AI Extraction</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Analyze Legal Contract
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Upload your PDF or plain text document to generate an executive summary, clause detection, and risk audit.
          </p>
        </div>
      </div>

      {/* If no document extracted yet, show upload component */}
      {!currentDocument ? (
        <DocumentUploadCard
          onDocumentExtracted={onDocumentExtracted}
          isProcessing={isAnalyzing}
        />
      ) : (
        /* Document Extracted: Ready for AI Analysis */
        <div className="space-y-6 animate-fade-in">
          {/* Document Extracted Card */}
          <div className="p-6 rounded-2xl border border-emerald-900/40 bg-emerald-950/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300">
                      Text Extracted Successfully
                    </span>
                    <span className="text-xs text-slate-400 font-mono-code">
                      {currentDocument.pageCount} Page{currentDocument.pageCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {currentDocument.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentDocument.text.length.toLocaleString()} characters extracted · Ready for Gemini 3.8 Flash legal analysis
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreviewText(!showPreviewText)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                >
                  {showPreviewText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPreviewText ? "Hide Text" : "Inspect Text"}</span>
                </button>

                <button
                  onClick={onClearDocument}
                  disabled={isAnalyzing}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition-colors disabled:opacity-50"
                >
                  Change File
                </button>
              </div>
            </div>

            {/* Extracted Text Collapsible Preview */}
            {showPreviewText && (
              <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono-code text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {currentDocument.text}
              </div>
            )}

            {/* Error Message if Analysis Failed */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onPerformAnalysis(currentDocument)}
                disabled={isAnalyzing}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-slate-950 font-bold text-sm hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-[#C5A880]/20 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Document with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Complete Legal Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis In-Progress Animation Card */}
          {isAnalyzing && (
            <div className="p-8 rounded-2xl border border-[#C5A880]/40 bg-slate-900/80 text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 flex items-center justify-center text-[#E5C378]">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  LexiScan AI is reviewing the contract...
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Extracting executive summary, evaluating liability caps, identifying termination conditions, and checking for missing clauses.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
