import React, { useState } from "react";
import { History, FileText, Trash2, ArrowRight, Download, Search, Calendar, Scale } from "lucide-react";
import { SavedAnalysis } from "../types.js";
import { downloadPdfReport, downloadTextReport } from "../utils/reportGenerator.js";

interface HistoryViewProps {
  history: SavedAnalysis[];
  onSelectAnalysis: (saved: SavedAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
  onClearAllHistory: () => void;
  onNewAnalysis: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectAnalysis,
  onDeleteAnalysis,
  onClearAllHistory,
  onNewAnalysis,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter((item) =>
    item.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#E5C378] text-xs font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Local Storage Cache</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Analysis History
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Previously analyzed contracts stored privately in your browser session
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={onClearAllHistory}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-300 hover:border-red-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Clear All History
            </button>
          )}
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-slate-950 text-xs font-bold hover:brightness-110 transition-all shadow-sm shadow-[#C5A880]/20"
          >
            + Analyze New Document
          </button>
        </div>
      </div>

      {/* Search Input */}
      {history.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved analyses by document name..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#C5A880]"
          />
        </div>
      )}

      {/* History Grid / List */}
      {history.length === 0 ? (
        <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
            <History className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              No Document Analyses Yet
            </h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              When you upload and analyze legal agreements, their summaries and clause breakdowns will appear here for fast retrieval.
            </p>
          </div>
          <button
            onClick={onNewAnalysis}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-slate-950 text-xs font-bold hover:brightness-110 transition-all"
          >
            Start First Analysis
          </button>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 text-center text-xs text-slate-400">
          No analyses matched your search &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-[#C5A880]/60 hover:bg-slate-900 transition-all flex flex-col justify-between group space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-blue-300 font-mono-code px-2 py-0.5 rounded bg-blue-950/80 border border-blue-900/40">
                    {item.documentType}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.analysisDate).toLocaleDateString()}</span>
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-[#E5C378] transition-colors line-clamp-1">
                  {item.documentName}
                </h4>

                <p className="mt-2 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {item.analysis.executiveSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono-code">
                  <span>{item.pageCount} Pages</span>
                  <span>{item.analysis.clauses?.length || 0} Clauses</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => onSelectAnalysis(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-[#E5C378] transition-colors"
                  >
                    <span>Open Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => downloadPdfReport(item.analysis, item.documentName)}
                    title="Download PDF"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteAnalysis(item.id)}
                    title="Delete record"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/80 hover:text-red-400 text-slate-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
