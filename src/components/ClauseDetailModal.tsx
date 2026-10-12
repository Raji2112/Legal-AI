import React from "react";
import { X, ShieldAlert, CheckCircle, AlertTriangle, Quote, Copy, BookOpen } from "lucide-react";

interface ClauseDetailModalProps {
  clause: {
    category: string;
    title: string;
    plainEnglishExplanation: string;
    originalSupportingText: string;
    pageOrSection: string;
    riskLevel: "Standard" | "Moderate Attention" | "Critical Review";
    riskExplanation: string;
  } | null;
  onClose: () => void;
}

export const ClauseDetailModal: React.FC<ClauseDetailModalProps> = ({
  clause,
  onClose,
}) => {
  if (!clause) return null;

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "Critical Review":
        return {
          bg: "bg-red-950/80 text-red-300 border-red-700/60",
          icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
          label: "Critical Review Needed",
        };
      case "Moderate Attention":
        return {
          bg: "bg-amber-950/80 text-amber-300 border-amber-700/60",
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          label: "Moderate Attention",
        };
      default:
        return {
          bg: "bg-emerald-950/80 text-emerald-300 border-emerald-700/60",
          icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
          label: "Standard Commercial Provision",
        };
    }
  };

  const risk = getRiskBadge(clause.riskLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-[#0F172A] p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                {clause.category}
              </span>
              <span className="text-xs text-slate-400 font-mono-code">
                {clause.pageOrSection}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {clause.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Risk Badge */}
        <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${risk.bg}`}>
          {risk.icon}
          <span>{risk.label}</span>
        </div>

        {/* Plain English Translation */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C378]">
            Plain-English Translation
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {clause.plainEnglishExplanation}
          </p>
        </div>

        {/* Verbatim Excerpt */}
        {clause.originalSupportingText && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Verbatim Contract Excerpt</span>
            </h4>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 italic font-mono-code leading-relaxed relative group">
              &quot;{clause.originalSupportingText}&quot;
            </div>
          </div>
        )}

        {/* Risk Rationale / Advice */}
        {clause.riskExplanation && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Risk Evaluation & Recommendations
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
              {clause.riskExplanation}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
