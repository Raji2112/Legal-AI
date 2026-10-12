import { LegalAnalysisResult } from "./server/api.js";
import { ExtractedDocument } from "./utils/documentExtractor.js";

export type NavTab = "dashboard" | "analyze" | "history" | "architecture" | "about";

export interface SavedAnalysis {
  id: string;
  documentName: string;
  documentType: string;
  analysisDate: string;
  pageCount: number;
  extractedText: string;
  analysis: LegalAnalysisResult;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  supportingQuote?: string;
  pageReference?: string;
}

export type ClauseCategory =
  | "All"
  | "Payment and Fees"
  | "Termination"
  | "Confidentiality"
  | "Liability and Indemnity"
  | "Renewal"
  | "Penalties"
  | "Dispute Resolution"
  | "Governing Law"
  | "Rights and Obligations"
  | "Intellectual Property"
  | "Non-Compete and Restrictive"
  | "Force Majeure"
  | "General Provisions";
