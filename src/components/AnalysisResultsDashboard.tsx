import React, { useState } from "react";
import {
  FileText,
  Download,
  ShieldAlert,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCode,
  Scale,
  Sparkles,
  Layers,
} from "lucide-react";
import { LegalAnalysisResult } from "../server/api.js";
import { ClauseCategory } from "../types.js";
import { ClauseDetailModal } from "./ClauseDetailModal.js";
import { DocumentChat } from "./DocumentChat.js";
import {
  downloadPdfReport,
  downloadTextReport,
  downloadJsonReport,
} from "../utils/reportGenerator.js";

interface AnalysisResultsDashboardProps {
  analysis: LegalAnalysisResult;
  extractedText: string;
  pageCount: number;
  onClearAnalysis: () => void;
  onReanalyze: () => void;
}

export const AnalysisResultsDashboard: React.FC<AnalysisResultsDashboardProps> = ({
  analysis,
  extractedText,
  pageCount,
  onClearAnalysis,
  onReanalyze,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "clauses" | "risks" | "chat" | "rawText">("overview");
  const [selectedCategory, setSelectedCategory] = useState<ClauseCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectingClause, setInspectingClause] = useState<any | null>(null);
  const [showRawText, setShowRawText] = useState(false);

  const categories: ClauseCategory[] = [
    "All",
    "Payment and Fees",
    "Termination",
    "Confidentiality",
    "Liability and Indemnity",
    "Renewal",
    "Penalties",
    "Dispute Resolution",
    "Governing Law",
    "Rights and Obligations",
    "Intellectual Property",
    "Non-Compete and Restrictive",
    "Force Majeure",
    "General Provisions",
  ];

  // Filter clauses by category and search term
  const filteredClauses = (analysis.clauses || []).filter((clause) => {
    const matchesCategory =
      selectedCategory === "All" || clause.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      clause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.plainEnglishExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.originalSupportingText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const criticalIssuesCount =
    (analysis.areasNeedingCloserReview?.length || 0) +
    (analysis.missingOrUnclearInformation?.length || 0);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#C5A880]/20 text-[#E5C378] border border-[#C5A880]/30 font-serif-legal">
              {analysis.documentType || "Contract"}
            </span>
            <span className="text-xs text-slate-400 font-mono-code">
              {pageCount} Page{pageCount > 1 ? "s" : ""}
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">
              Analyzed {new Date(analysis.analysisDate).toLocaleDateString()}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{analysis.documentName}</span>
          </h2>
        </div>

        {/* Action Buttons: Export & Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => downloadPdfReport(analysis)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-slate-950 font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shadow-sm shadow-[#C5A880]/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={() => downloadTextReport(analysis)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Text Report</span>
          </button>

          <button
            onClick={() => downloadJsonReport(analysis)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={onClearAnalysis}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-red-950/60 hover:text-red-300 hover:border-red-800/80 text-slate-400 text-xs font-semibold border border-slate-800 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Contract Vitals Quick Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Scale className="w-3.5 h-3.5 text-[#E5C378]" />
            <span className="uppercase tracking-wider font-semibold">Jurisdiction</span>
          </div>
          <p className="text-sm font-bold text-slate-100 truncate">
            {analysis.governingJurisdiction || "Not Specified"}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Calendar className="w-3.5 h-3.5 text-[#E5C378]" />
            <span className="uppercase tracking-wider font-semibold">Effective Date</span>
          </div>
          <p className="text-sm font-bold text-slate-100 truncate">
            {analysis.effectiveDate || "Not Stated"}
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <RefreshCw className="w-3.5 h-3.5 text-[#E5C378]" />
            <span className="uppercase tracking-wider font-semibold">Auto-Renewal</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                analysis.terminationAndRenewalTerms?.automaticRenewal
                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                  : "bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              {analysis.terminationAndRenewalTerms?.automaticRenewal ? "Active (Auto-renews)" : "No"}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="uppercase tracking-wider font-semibold">Review Alerts</span>
          </div>
          <p className="text-sm font-bold text-slate-100">
            {criticalIssuesCount > 0 ? (
              <span className="text-amber-400">{criticalIssuesCount} Items to Review</span>
            ) : (
              <span className="text-emerald-400">Standard Baseline</span>
            )}
          </p>
        </div>
      </div>

      {/* Main Results Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-[#C5A880]/20 text-[#E5C378] border border-[#C5A880]/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Executive Summary & Vitals</span>
        </button>

        <button
          onClick={() => setActiveTab("clauses")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === "clauses"
              ? "bg-[#C5A880]/20 text-[#E5C378] border border-[#C5A880]/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Clause Detection ({analysis.clauses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("risks")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === "risks"
              ? "bg-[#C5A880]/20 text-[#E5C378] border border-[#C5A880]/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Review Areas & Missing Terms ({criticalIssuesCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === "chat"
              ? "bg-[#C5A880]/20 text-[#E5C378] border border-[#C5A880]/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask Questions (Q&A)</span>
        </button>

        <button
          onClick={() => setActiveTab("rawText")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap ${
            activeTab === "rawText"
              ? "bg-[#C5A880]/20 text-[#E5C378] border border-[#C5A880]/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Extracted Text</span>
        </button>
      </div>

      {/* TAB 1: EXECUTIVE SUMMARY & VITALS */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-[#E5C378]">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold uppercase tracking-wider">
                Plain-English Executive Summary
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {analysis.executiveSummary}
            </p>

            {analysis.purposeOfAgreement && (
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Primary Purpose:
                </span>
                <p className="mt-1 text-sm text-slate-300">
                  {analysis.purposeOfAgreement}
                </p>
              </div>
            )}
          </div>

          {/* Identified Parties & Obligations */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold">
                Identified Parties & Responsibilities
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.parties?.map((party, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {party.name}
                      </h4>
                      <span className="text-xs text-blue-300 font-medium">
                        Role: {party.role}
                      </span>
                    </div>
                    <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      Party {idx + 1}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400">
                      Key Obligations:
                    </span>
                    <ul className="mt-1.5 space-y-1">
                      {party.keyObligations?.map((obl, oIdx) => (
                        <li
                          key={oIdx}
                          className="text-xs text-slate-300 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{obl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial & Termination Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Financial Terms Card */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <DollarSign className="w-4 h-4 text-[#E5C378]" />
                <span>Financial & Payment Terms</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.financialAndPaymentTerms?.summary || "No monetary terms specified."}
              </p>
              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Payment Schedule:</span>
                  <span className="text-slate-200 font-medium">
                    {analysis.financialAndPaymentTerms?.paymentSchedule || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Late Payment Penalties:</span>
                  <span className="text-slate-200 font-medium">
                    {analysis.financialAndPaymentTerms?.latePaymentPenalties || "None specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Termination & Renewal Card */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Termination & Renewal Rules</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <p>
                  <strong className="text-slate-400 font-normal">Notice Period: </strong>
                  {analysis.terminationAndRenewalTerms?.terminationNoticePeriod || "Not stated"}
                </p>
                <p>
                  <strong className="text-slate-400 font-normal">Renewal Terms: </strong>
                  {analysis.terminationAndRenewalTerms?.renewalConditions || "Not specified"}
                </p>
                {analysis.terminationAndRenewalTerms?.groundsForTermination && (
                  <div className="pt-1">
                    <span className="text-slate-400">Grounds for Termination:</span>
                    <ul className="mt-1 list-disc pl-4 space-y-0.5 text-slate-300">
                      {analysis.terminationAndRenewalTerms.groundsForTermination.map((g, gIdx) => (
                        <li key={gIdx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLAUSE DETECTION & AUDIT */}
      {activeTab === "clauses" && (
        <div className="space-y-4 animate-fade-in">
          {/* Filter Bar & Search */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clauses by keyword, title, or excerpt..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <span className="text-xs text-slate-400">
              Showing {filteredClauses.length} of {analysis.clauses?.length || 0} clauses
            </span>
          </div>

          {/* Category Filter Pills (Functional Buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-[#C5A880] text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Clauses List */}
          <div className="space-y-3">
            {filteredClauses.length === 0 ? (
              <div className="p-10 rounded-2xl border border-slate-800 bg-slate-900/40 text-center space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">
                  No clauses match your filter criteria
                </p>
                <p className="text-xs text-slate-500">
                  Try clearing your search query or selecting &quot;All&quot; categories.
                </p>
              </div>
            ) : (
              filteredClauses.map((clause, idx) => {
                const isHighRisk = clause.riskLevel === "Critical Review";
                const isMediumRisk = clause.riskLevel === "Moderate Attention";

                return (
                  <div
                    key={idx}
                    onClick={() => setInspectingClause(clause)}
                    className="group p-5 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-[#C5A880]/60 hover:bg-slate-900 transition-all cursor-pointer space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          {clause.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono-code">
                          {clause.pageOrSection}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                            isHighRisk
                              ? "bg-red-950 text-red-300 border border-red-800"
                              : isMediumRisk
                              ? "bg-amber-950 text-amber-300 border border-amber-800"
                              : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          }`}
                        >
                          {isHighRisk && <ShieldAlert className="w-3 h-3 text-red-400" />}
                          {isMediumRisk && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                          {!isHighRisk && !isMediumRisk && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          <span>{clause.riskLevel}</span>
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-[#E5C378] transition-colors">
                          Inspect &rarr;
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-[#E5C378] transition-colors">
                      {clause.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {clause.plainEnglishExplanation}
                    </p>

                    {clause.originalSupportingText && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-400 italic font-mono-code truncate">
                        &quot;{clause.originalSupportingText}&quot;
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: REVIEW AREAS & MISSING TERMS */}
      {activeTab === "risks" && (
        <div className="space-y-6 animate-fade-in">
          {/* Areas Needing Closer Review */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-bold text-base">
              <ShieldAlert className="w-5 h-5" />
              <h3>Areas Requiring Closer Legal Review</h3>
            </div>
            <p className="text-xs text-slate-400">
              The following provisions contain non-standard obligations, ambiguous terms, or unbalanced risk allocations.
            </p>

            <div className="space-y-3">
              {(!analysis.areasNeedingCloserReview || analysis.areasNeedingCloserReview.length === 0) ? (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                  No critical red flags or high-risk contractual terms identified.
                </div>
              ) : (
                analysis.areasNeedingCloserReview.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-red-900/40 bg-red-950/20 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-900/60 text-red-200">
                        Attention #{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-red-200">
                        {item.issue}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-red-300 font-semibold">Practical Risk: </strong>
                      {item.whyItMatters}
                    </p>

                    <p className="text-xs text-emerald-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                      <strong className="text-emerald-400 font-semibold">Suggested Negotiation Action: </strong>
                      {item.recommendedAction}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Missing or Unclear Information */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <h3>Missing or Undefined Legal Terms</h3>
            </div>
            <p className="text-xs text-slate-400">
              Standard commercial contracts usually specify these terms. Their omission can cause ambiguity in legal disputes.
            </p>

            <div className="space-y-3">
              {(!analysis.missingOrUnclearInformation || analysis.missingOrUnclearInformation.length === 0) ? (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                  No critical missing terms detected.
                </div>
              ) : (
                analysis.missingOrUnclearInformation.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-amber-900/40 bg-amber-950/20 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-200">
                        Missing Item #{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-amber-200">
                        {item.item}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-amber-300 font-semibold">Impact of Omission: </strong>
                      {item.impact}
                    </p>

                    <p className="text-xs text-blue-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                      <strong className="text-blue-400 font-semibold">Recommendation: </strong>
                      {item.recommendation}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASK DOCUMENT QUESTIONS (Q&A) */}
      {activeTab === "chat" && (
        <div className="animate-fade-in">
          <DocumentChat
            documentName={analysis.documentName}
            documentText={extractedText}
          />
        </div>
      )}

      {/* TAB 5: RAW EXTRACTED TEXT */}
      {activeTab === "rawText" && (
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Extracted Document Text
              </h3>
              <p className="text-xs text-slate-400">
                {extractedText.length.toLocaleString()} characters extracted across {pageCount} page(s)
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(extractedText);
                alert("Extracted text copied to clipboard!");
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium border border-slate-700 transition-colors"
            >
              Copy All Text
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-h-[550px] overflow-y-auto text-xs font-mono-code text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
            {extractedText}
          </div>
        </div>
      )}

      {/* Legal Educational Disclaimer Banner */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 text-center space-y-1">
        <p className="text-xs font-semibold text-slate-400">
          Educational & Informational Notice
        </p>
        <p className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed">
          {analysis.educationalDisclaimer}
        </p>
      </div>

      {/* Modal for Single Clause Inspection */}
      <ClauseDetailModal
        clause={inspectingClause}
        onClose={() => setInspectingClause(null)}
      />
    </div>
  );
};
