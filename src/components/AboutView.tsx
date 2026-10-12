import React from "react";
import { Shield, Lock, Scale, Info, CheckCircle2, AlertTriangle, EyeOff, Server, Heart } from "lucide-react";

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Box */}
      <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#0A1931] border border-[#C5A880]/40 flex items-center justify-center text-[#E5C378] shadow-inner">
          <Scale className="w-7 h-7 text-[#E5C378]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          About LexiScan AI
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          An academic and educational legal technology platform engineered to make complex contracts, agreements, and legal instruments transparent and accessible to students, entrepreneurs, and ordinary users.
        </p>
      </div>

      {/* Mandatory Legal Disclaimer Banner */}
      <div className="p-6 rounded-2xl border-2 border-[#C5A880]/50 bg-gradient-to-r from-slate-950 via-[#0B192C] to-slate-950 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-[#E5C378]">
          <AlertTriangle className="w-5 h-5 text-[#E5C378] shrink-0" />
          <h3 className="text-base font-bold uppercase tracking-wider font-serif-legal">
            Important Legal Disclaimer & Regulatory Notice
          </h3>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          &quot;This tool provides general information and educational assistance, not legal advice. Consult a qualified lawyer before making important legal decisions.&quot;
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          LexiScan AI is designed solely for educational, preliminary review, and informational purposes. The artificial intelligence models utilized cannot replace the tailored judgment, statutory interpretation, and ethical duties of a licensed attorney admitted to the relevant jurisdiction. Never execute binding commercial agreements or waive legal rights without competent legal counsel.
        </p>
      </div>

      {/* Security & Privacy Principles Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <span>Security, Privacy & Data Protection Architecture</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              <span>Zero Permanent Document Storage</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Uploaded document texts are processed ephemerally in server memory strictly for the duration of the analysis generation. No contract text or proprietary clauses are permanently stored in external databases without user consent.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Server-Side Credential Isolation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              All Gemini API calls are executed strictly through secure server-side Express handlers. API credentials are never exposed to browser client bundles or public endpoints.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Shield className="w-4 h-4 text-[#E5C378]" />
              <span>Prompt Injection Guardrails</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Document text is strictly treated as untrusted passive data within delimited context blocks, preventing malicious prompt injection instructions embedded in contracts from hijacking model behavior.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Server className="w-4 h-4 text-purple-400" />
              <span>Free-First Academic Engineering</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              LexiScan AI is crafted using free-tier and standard open runtime features. No paid proprietary subscriptions or hidden dependencies are mandated to run the application.
            </p>
          </div>
        </div>
      </div>

      {/* College Project Credits */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-center space-y-2 text-xs text-slate-400">
        <p className="font-semibold text-slate-300">
          LexiScan AI — College Project Capstone Application
        </p>
        <p>
          Engineered with React 19, TypeScript, Tailwind CSS, Express, and Google Gemini 3.8 Flash, featuring native research prototypes in Modular Mojo, MAX Engine, LangChain, and ChromaDB.
        </p>
      </div>
    </div>
  );
};
