import { Request, Response } from "express";
import { getGeminiClient } from "./gemini.js";

export interface LegalAnalysisResult {
  documentName: string;
  analysisDate: string;
  documentType: string;
  executiveSummary: string;
  purposeOfAgreement: string;
  governingJurisdiction: string;
  effectiveDate: string;
  expirationOrTerm: string;
  parties: Array<{
    name: string;
    role: string;
    keyObligations: string[];
  }>;
  financialAndPaymentTerms: {
    summary: string;
    paymentSchedule: string;
    latePaymentPenalties: string;
    currency: string;
  };
  terminationAndRenewalTerms: {
    terminationNoticePeriod: string;
    groundsForTermination: string[];
    renewalConditions: string;
    automaticRenewal: boolean;
  };
  clauses: Array<{
    category:
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
    title: string;
    plainEnglishExplanation: string;
    originalSupportingText: string;
    pageOrSection: string;
    riskLevel: "Standard" | "Moderate Attention" | "Critical Review";
    riskExplanation: string;
  }>;
  areasNeedingCloserReview: Array<{
    issue: string;
    whyItMatters: string;
    recommendedAction: string;
  }>;
  missingOrUnclearInformation: Array<{
    item: string;
    impact: string;
    recommendation: string;
  }>;
  educationalDisclaimer: string;
}

export async function handleAnalyzeDocument(req: Request, res: Response) {
  try {
    const { documentText, documentName = "Document", pageCount = 1, fileType = "txt" } = req.body;

    if (!documentText || typeof documentText !== "string") {
      return res.status(400).json({
        error: "Document text is required. Please provide extracted text to analyze.",
      });
    }

    if (documentText.trim().length < 30) {
      return res.status(400).json({
        error: "Document content is too brief to analyze (less than 30 characters). Please provide a valid legal contract or document.",
      });
    }

    const ai = getGeminiClient();

    // Limit text to avoid overflowing prompt limits (100k chars)
    const processedText = documentText.length > 100000 
      ? documentText.slice(0, 100000) + "\n\n[Document excerpted due to length]" 
      : documentText;

    const systemInstruction = `You are LexiScan AI, a senior legal intelligence analyst and educational contract reviewer.
Your objective is to provide a comprehensive, objective, and plain-English analysis of the legal contract provided below.

Rules:
1. Objectivity: Do not label clauses 'illegal' or 'dangerous' without statutory basis. Use measured language explaining risks, ambiguities, and imbalance.
2. Grounded Truth: Cite exact verbatim excerpts from the text for each clause finding. Do NOT hallucinate clauses or terms not in the document.
3. Clarity: Translate complex legalese into crystal-clear plain English that students and non-lawyers can easily grasp.
4. Completeness: Explicitly detect what is MISSING or UNCLEAR (e.g. missing dispute resolution venue, vague termination notice, undefined renewal costs).
5. Output format: Return STRICTLY valid JSON conforming to the requested structure.`;

    const prompt = `Analyze the following legal document named "${documentName}" (${pageCount} page(s), type: ${fileType}):

--- BEGIN DOCUMENT TEXT ---
${processedText}
--- END DOCUMENT TEXT ---

Output a JSON object with this exact structure:
{
  "documentType": "string (e.g., Non-Disclosure Agreement, Software License, Commercial Lease, Employment Contract, etc.)",
  "executiveSummary": "string (3-5 sentences giving a clear high-level overview in simple English of what this document is and what it accomplishes)",
  "purposeOfAgreement": "string (1-2 sentences on the core commercial or legal purpose)",
  "governingJurisdiction": "string (e.g., State of California, United States; or 'Not explicitly specified')",
  "effectiveDate": "string (e.g., 'June 1, 2026' or 'Upon mutual signature' or 'Not specified')",
  "expirationOrTerm": "string (e.g., '2 years from effective date', 'Indefinite until terminated', or 'Not specified')",
  "parties": [
    {
      "name": "string (Party name or title)",
      "role": "string (e.g., Disclosing Party, Licensor, Employee, Tenant)",
      "keyObligations": ["string", "string"]
    }
  ],
  "financialAndPaymentTerms": {
    "summary": "string (plain English explanation of costs, fees, royalties, or 'No monetary consideration specified')",
    "paymentSchedule": "string (e.g., Net 30, monthly on the 1st, or 'N/A')",
    "latePaymentPenalties": "string (interest rate, penalty terms, or 'None specified')",
    "currency": "string (e.g. USD, EUR, or 'N/A')"
  },
  "terminationAndRenewalTerms": {
    "terminationNoticePeriod": "string (e.g., 30 days written notice, immediate for cause, or 'Not stated')",
    "groundsForTermination": ["string (e.g. Material breach with 15-day cure period)", "string"],
    "renewalConditions": "string (how the contract renews or expires)",
    "automaticRenewal": boolean
  },
  "clauses": [
    {
      "category": "One of: Payment and Fees | Termination | Confidentiality | Liability and Indemnity | Renewal | Penalties | Dispute Resolution | Governing Law | Rights and Obligations | Intellectual Property | Non-Compete and Restrictive | Force Majeure | General Provisions",
      "title": "string (concise descriptive name of clause)",
      "plainEnglishExplanation": "string (2-3 sentences explaining what this means in simple language)",
      "originalSupportingText": "string (direct verbatim quote of 1-3 sentences from the document)",
      "pageOrSection": "string (e.g., Section 4.2, or Page 1, or Paragraph 5)",
      "riskLevel": "One of: Standard | Moderate Attention | Critical Review",
      "riskExplanation": "string (practical risk advice or note on why attention is needed)"
    }
  ],
  "areasNeedingCloserReview": [
    {
      "issue": "string (title of potential concern, e.g. Uncapped Indemnification, Ambiguous Trade Secret Definition)",
      "whyItMatters": "string (practical impact on the signing party)",
      "recommendedAction": "string (specific suggestion for clarification or negotiation)"
    }
  ],
  "missingOrUnclearInformation": [
    {
      "item": "string (e.g. Cure Period for Breach, Data Return Protocols, Governing Venue)",
      "impact": "string (why omission introduces risk)",
      "recommendation": "string (what to request from counterparty)"
    }
  ],
  "educationalDisclaimer": "This analysis is generated by LexiScan AI for educational and preliminary review purposes only and does not constitute formal legal advice. Always consult a qualified attorney for critical legal transactions."
}`;

    const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText = response.text || "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(responseText.trim());
    } catch (e) {
      // Robust JSON extraction fallback for code blocks or wrapped text
      const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        try {
          parsed = JSON.parse(codeBlockMatch[1].trim());
        } catch (_) {}
      }
      if (!parsed) {
        const firstBrace = responseText.indexOf("{");
        const lastBrace = responseText.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          try {
            parsed = JSON.parse(responseText.substring(firstBrace, lastBrace + 1));
          } catch (_) {}
        }
      }
      if (!parsed) {
        throw new Error("Unable to parse structured JSON from Gemini response.");
      }
    }

    const fullResult: LegalAnalysisResult = {
      ...parsed,
      documentName,
      analysisDate: new Date().toISOString(),
      educationalDisclaimer:
        "This tool provides general information and educational assistance, not legal advice. Consult a qualified lawyer before making important legal decisions.",
    };

    return res.json({
      success: true,
      analysis: fullResult,
    });
  } catch (error: any) {
    console.error("Error in handleAnalyzeDocument:", error);
    return res.status(500).json({
      error: error?.message || "An unexpected error occurred while analyzing the document with Gemini.",
    });
  }
}

export async function handleAskQuestion(req: Request, res: Response) {
  try {
    const { documentText, documentName = "Document", question, chatHistory = [] } = req.body;

    if (!documentText || !question) {
      return res.status(400).json({
        error: "Both documentText and question are required.",
      });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are LexiScan AI Assistant, a grounded legal document research assistant.
Your job is to answer questions strictly using the uploaded document "${documentName}".

Mandatory instructions:
1. PRIMARY SOURCE OF TRUTH: Base your answer primarily on the uploaded document text.
2. CITATIONS: Include direct supporting quotations/excerpts from the text whenever available.
3. ABSENCE OF FACT: If the answer is NOT present, mentioned, or discernable in the document, EXPLICITLY state: "This information is not specified in the uploaded document." Do not fabricate or extrapolate unstated clauses.
4. DISTINCTION: Clearly distinguish between what the document explicitly states vs general legal background knowledge.
5. NO LEGAL ADVICE: Do not give definitive legal counsel; provide informational analysis.`;

    const prompt = `DOCUMENT CONTEXT:
---
${documentText.slice(0, 80000)}
---

CHAT HISTORY:
${chatHistory.map((msg: any) => `${msg.role === "user" ? "User" : "LexiScan"}: ${msg.content}`).join("\n")}

USER'S CURRENT QUESTION:
"${question}"

Provide a clear, well-structured answer with:
1. Direct Answer (plain English)
2. Supporting Quotes / Citations (verbatim excerpts from the document)
3. Page/Section Reference (if identifiable)
4. Practical Context or Caveat`;

    const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const answer = response.text || "Unable to formulate a response based on the document text.";

    return res.json({
      success: true,
      answer,
      question,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in handleAskQuestion:", error);
    return res.status(500).json({
      error: error?.message || "Failed to answer document question via Gemini.",
    });
  }
}

export async function handleHealthCheck(_req: Request, res: Response) {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_KEY
  );
  res.json({
    status: "ok",
    hasApiKey: hasKey,
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    service: "LexiScan AI Legal Document Analyzer",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
  });
}

