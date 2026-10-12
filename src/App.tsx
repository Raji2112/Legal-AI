import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar.js";
import { DashboardView } from "./components/DashboardView.js";
import { AnalyzeDocumentView } from "./components/AnalyzeDocumentView.js";
import { HistoryView } from "./components/HistoryView.js";
import { ArchitectureView } from "./components/ArchitectureView.js";
import { AboutView } from "./components/AboutView.js";
import { ExtractedDocument } from "./utils/documentExtractor.js";
import { LegalAnalysisResult } from "./server/api.js";
import { NavTab, SavedAnalysis } from "./types.js";
import { Scale, Shield } from "lucide-react";

const HISTORY_STORAGE_KEY = "lexiscan_analysis_history_v1";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [currentDocument, setCurrentDocument] = useState<ExtractedDocument | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<LegalAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [history, setHistory] = useState<SavedAnalysis[]>([]);

  // Load analysis history from localStorage on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Could not load history from localStorage:", err);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (doc: ExtractedDocument, analysis: LegalAnalysisResult) => {
    const newEntry: SavedAnalysis = {
      id: `analysis-${Date.now()}`,
      documentName: doc.name,
      documentType: analysis.documentType || "Contract",
      analysisDate: new Date().toISOString(),
      pageCount: doc.pageCount,
      extractedText: doc.text,
      analysis,
    };

    setHistory((prev) => {
      // Keep up to 25 latest analyses, avoiding duplicate identical names
      const filtered = prev.filter((item) => item.documentName !== doc.name);
      const updated = [newEntry, ...filtered].slice(0, 25);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("LocalStorage full, trimming history:", e);
      }
      return updated;
    });
  };

  const handleDocumentExtracted = (doc: ExtractedDocument) => {
    setCurrentDocument(doc);
    setCurrentAnalysis(null);
    setAnalysisError(null);
    setCurrentTab("analyze");
  };

  const handlePerformAnalysis = async (doc: ExtractedDocument) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentText: doc.text,
          documentName: doc.name,
          pageCount: doc.pageCount,
          fileType: doc.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Server responded with status ${response.status}: Failed to generate analysis.`
        );
      }

      const data = await response.json();
      if (!data.success || !data.analysis) {
        throw new Error(data.error || "Analysis response format was invalid.");
      }

      const analysisResult: LegalAnalysisResult = data.analysis;
      setCurrentAnalysis(analysisResult);
      saveToHistory(doc, analysisResult);
    } catch (err: any) {
      console.error("Error analyzing contract:", err);
      setAnalysisError(err?.message || "An unexpected error occurred while analyzing the document.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSavedAnalysis = (saved: SavedAnalysis) => {
    setCurrentDocument({
      name: saved.documentName,
      size: saved.extractedText.length,
      type: saved.documentType,
      text: saved.extractedText,
      pageCount: saved.pageCount,
      pages: [{ pageNumber: 1, text: saved.extractedText }],
    });
    setCurrentAnalysis(saved.analysis);
    setCurrentTab("analyze");
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearAllHistory = () => {
    if (confirm("Are you sure you want to clear all saved contract analysis history?")) {
      setHistory([]);
      try {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
      } catch (e) {}
    }
  };

  const handleClearCurrentDocument = () => {
    setCurrentDocument(null);
    setCurrentAnalysis(null);
    setAnalysisError(null);
    setCurrentTab("analyze");
  };

  return (
    <div className="min-h-screen bg-[#0B192C] text-slate-100 flex flex-col selection:bg-[#C5A880]/30 selection:text-white">
      {/* Navigation Top Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onQuickUpload={() => {
          setCurrentDocument(null);
          setCurrentAnalysis(null);
          setCurrentTab("analyze");
        }}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === "dashboard" && (
          <DashboardView
            onDocumentExtracted={handleDocumentExtracted}
            isProcessing={isAnalyzing}
            history={history}
            onSelectSaved={handleSelectSavedAnalysis}
            onNavigateToAnalyze={() => setCurrentTab("analyze")}
          />
        )}

        {currentTab === "analyze" && (
          <AnalyzeDocumentView
            currentDocument={currentDocument}
            currentAnalysis={currentAnalysis}
            isAnalyzing={isAnalyzing}
            onDocumentExtracted={handleDocumentExtracted}
            onPerformAnalysis={handlePerformAnalysis}
            onClearDocument={handleClearCurrentDocument}
            errorMessage={analysisError}
          />
        )}

        {currentTab === "history" && (
          <HistoryView
            history={history}
            onSelectAnalysis={handleSelectSavedAnalysis}
            onDeleteAnalysis={handleDeleteHistoryItem}
            onClearAllHistory={handleClearAllHistory}
            onNewAnalysis={() => {
              setCurrentDocument(null);
              setCurrentAnalysis(null);
              setCurrentTab("analyze");
            }}
          />
        )}

        {currentTab === "architecture" && <ArchitectureView />}

        {currentTab === "about" && <AboutView />}
      </main>

      {/* Quiet, Compliant Legal Footer */}
      <footer className="border-t border-slate-800 bg-[#07111E] text-slate-400 py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#C5A880]" />
            <span className="font-serif-legal font-bold text-slate-200">
              LexiScan AI
            </span>
            <span className="text-slate-600">·</span>
            <span>Legal Document Analyzer</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentTab("about")}
              className="hover:text-slate-200 transition-colors"
            >
              Legal Disclaimer
            </button>
            <button
              onClick={() => setCurrentTab("architecture")}
              className="hover:text-slate-200 transition-colors"
            >
              Academic Architecture
            </button>
            <button
              onClick={() => setCurrentTab("history")}
              className="hover:text-slate-200 transition-colors"
            >
              Local History
            </button>
          </div>

          <p className="text-slate-400">
            Educational legal intelligence tool. Not legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
