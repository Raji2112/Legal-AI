import React, { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2, Lock, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import { SAMPLE_DOCUMENTS, SampleDocument } from "../data/sampleDocuments.js";
import { extractDocumentText, ExtractedDocument } from "../utils/documentExtractor.js";

interface DocumentUploadCardProps {
  onDocumentExtracted: (doc: ExtractedDocument) => void;
  isProcessing: boolean;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  onDocumentExtracted,
  isProcessing,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScannedWarning, setIsScannedWarning] = useState(false);
  const [isEncryptedWarning, setIsEncryptedWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setIsScannedWarning(false);
    setIsEncryptedWarning(false);
    setExtractionStatus(`Reading file: ${file.name}...`);

    try {
      const result = await extractDocumentText(file);

      if (!result.success) {
        setExtractionStatus(null);
        setErrorMessage(result.error || "Failed to process the document.");
        if (result.isScannedPdf) setIsScannedWarning(true);
        if (result.isEncrypted) setIsEncryptedWarning(true);
        return;
      }

      if (result.document) {
        setExtractionStatus("Document text extracted successfully! Ready for AI analysis.");
        setTimeout(() => {
          onDocumentExtracted(result.document!);
          setExtractionStatus(null);
        }, 500);
      }
    } catch (err: any) {
      setExtractionStatus(null);
      setErrorMessage(err?.message || "An unexpected error occurred during extraction.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleLoadSample = (sample: SampleDocument) => {
    setErrorMessage(null);
    setIsScannedWarning(false);
    setIsEncryptedWarning(false);
    setExtractionStatus(`Loading sample: ${sample.name}...`);

    setTimeout(() => {
      onDocumentExtracted({
        name: sample.name,
        size: sample.text.length,
        type: sample.type,
        text: sample.text,
        pageCount: sample.pageCount,
        pages: [
          { pageNumber: 1, text: sample.text.slice(0, Math.floor(sample.text.length / 2)) },
          { pageNumber: 2, text: sample.text.slice(Math.floor(sample.text.length / 2)) },
        ],
      });
      setExtractionStatus(null);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Upload Drop Zone Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-200 ${
          isDragging
            ? "border-[#D4AF37] bg-slate-800/80 shadow-lg shadow-[#C5A880]/10 scale-[1.005]"
            : "border-slate-700/80 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900/90"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.text"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#1E3A8A]/60 to-[#0A1931] border border-[#C5A880]/40 flex items-center justify-center text-[#E5C378] shadow-inner">
            <Upload className="w-8 h-8 text-[#E5C378]" />
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
              Upload Legal Contract or Document
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Drag and drop your PDF or TXT file here, or browse from your device
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 font-mono-code">
              PDF (Searchable text)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 font-mono-code">
              TXT / Plain Text
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">
              Max file size: 15MB
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-slate-950 font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#C5A880]/20 disabled:opacity-50 cursor-pointer"
            >
              Browse Local Files
            </button>
          </div>
        </div>

        {/* Live Extraction Status Progress Indicator */}
        {extractionStatus && (
          <div className="mt-6 max-w-md mx-auto p-3.5 rounded-xl bg-blue-950/70 border border-blue-500/40 text-blue-200 text-xs sm:text-sm flex items-center justify-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-[#E5C378]" />
            <span>{extractionStatus}</span>
          </div>
        )}
      </div>

      {/* Error / Warning Alert Banner */}
      {errorMessage && (
        <div className="rounded-xl bg-red-950/60 border border-red-500/50 p-4 text-red-200 text-sm shadow-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-red-300">Document Processing Issue</p>
              <p className="text-red-200/90 leading-relaxed">{errorMessage}</p>

              {isScannedWarning && (
                <div className="mt-2.5 pt-2.5 border-t border-red-900/60 text-xs text-red-300 space-y-1">
                  <p className="font-semibold text-red-200">Recommended Steps for Scanned Documents:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-red-300/80">
                    <li>Open the PDF in Google Drive and select &quot;Open with Google Docs&quot; to perform free OCR.</li>
                    <li>Or export searchable PDF using Adobe Acrobat, Apple Preview, or an OCR app.</li>
                    <li>Re-upload the resulting text-enabled PDF or copy the text into a .txt file.</li>
                  </ul>
                </div>
              )}

              {isEncryptedWarning && (
                <div className="mt-2 text-xs text-red-300">
                  <p>Open the file in your PDF viewer, choose &quot;Print to PDF&quot; or save a copy without password protection, then re-upload.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick-Test Sample Legal Documents Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#E5C378]" />
            <h4 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
              Or Test Immediately with Standard Sample Contracts
            </h4>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Curated realistic contracts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              className="group p-4 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-[#C5A880]/50 hover:bg-slate-800/80 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50">
                    {sample.type}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono-code">
                    {sample.pageCount} Pages
                  </span>
                </div>
                <h5 className="mt-2 text-sm font-bold text-white group-hover:text-[#E5C378] transition-colors truncate">
                  {sample.name}
                </h5>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {sample.description}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-[#E5C378] font-medium group-hover:translate-x-0.5 transition-transform">
                <span>Load & Analyze Sample</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
