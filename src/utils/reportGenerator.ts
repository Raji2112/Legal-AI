import { jsPDF } from "jspdf";
import { LegalAnalysisResult } from "../server/api.js";

export function generateMarkdownReport(analysis: LegalAnalysisResult): string {
  const dateStr = new Date(analysis.analysisDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `# LexiScan AI — Legal Document Analysis Report
Document Name: ${analysis.documentName}
Document Type: ${analysis.documentType || "Legal Agreement"}
Analysis Date: ${dateStr}

================================================================================
EXECUTIVE SUMMARY
================================================================================
${analysis.executiveSummary}

Core Purpose:
${analysis.purposeOfAgreement}

Governing Jurisdiction: ${analysis.governingJurisdiction || "Not explicitly specified"}
Effective Date: ${analysis.effectiveDate || "Not specified"}
Expiration / Term: ${analysis.expirationOrTerm || "Not specified"}

================================================================================
IDENTIFIED PARTIES & ROLES
================================================================================
${analysis.parties
  ?.map(
    (p, idx) =>
      `[Party ${idx + 1}] ${p.name} (${p.role})
Key Obligations:
${p.keyObligations?.map((o) => `  - ${o}`).join("\n") || "  - Standard covenants"}`
  )
  .join("\n\n") || "No distinct parties identified."}

================================================================================
FINANCIAL & PAYMENT TERMS
================================================================================
Summary: ${analysis.financialAndPaymentTerms?.summary || "N/A"}
Payment Schedule: ${analysis.financialAndPaymentTerms?.paymentSchedule || "N/A"}
Late Penalties: ${analysis.financialAndPaymentTerms?.latePaymentPenalties || "None specified"}
Currency: ${analysis.financialAndPaymentTerms?.currency || "N/A"}

================================================================================
TERMINATION & RENEWAL CONDITIONS
================================================================================
Notice Period: ${analysis.terminationAndRenewalTerms?.terminationNoticePeriod || "N/A"}
Automatic Renewal: ${analysis.terminationAndRenewalTerms?.automaticRenewal ? "YES" : "NO"}
Renewal Conditions: ${analysis.terminationAndRenewalTerms?.renewalConditions || "N/A"}
Grounds for Termination:
${analysis.terminationAndRenewalTerms?.groundsForTermination?.map((g) => `  - ${g}`).join("\n") || "  - N/A"}

================================================================================
EXTRACTED LEGAL CLAUSES & RISK AUDIT (${analysis.clauses?.length || 0} CLAUSES)
================================================================================
${analysis.clauses
  ?.map(
    (c, idx) =>
      `Clause ${idx + 1}: ${c.title} [${c.category}]
Location: ${c.pageOrSection} | Risk Rating: ${c.riskLevel}
Plain-English Explanation:
${c.plainEnglishExplanation}

Supporting Verbatim Excerpt:
"${c.originalSupportingText}"

Assessment / Risk Note:
${c.riskExplanation}
--------------------------------------------------------------------------------`
  )
  .join("\n\n")}

================================================================================
AREAS NEEDING CLOSER REVIEW & POTENTIAL RED FLAGS
================================================================================
${analysis.areasNeedingCloserReview
  ?.map(
    (issue, idx) =>
      `${idx + 1}. ${issue.issue}
Why it matters: ${issue.whyItMatters}
Recommended action: ${issue.recommendedAction}`
  )
  .join("\n\n") || "No critical high-risk items detected."}

================================================================================
MISSING OR UNCLEAR TERMS
================================================================================
${analysis.missingOrUnclearInformation
  ?.map(
    (m, idx) =>
      `${idx + 1}. ${m.item}
Impact: ${m.impact}
Advice: ${m.recommendation}`
  )
  .join("\n\n") || "No material gaps identified."}

================================================================================
LEGAL DISCLAIMER & NOTICE
================================================================================
${analysis.educationalDisclaimer}
`;
}

export function downloadTextReport(analysis: LegalAnalysisResult, filename?: string) {
  const content = generateMarkdownReport(analysis);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const cleanName = (filename || analysis.documentName).replace(/\.[^/.]+$/, "");
  a.href = url;
  a.download = `LexiScan_Report_${cleanName}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJsonReport(analysis: LegalAnalysisResult, filename?: string) {
  const content = JSON.stringify(analysis, null, 2);
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const cleanName = (filename || analysis.documentName).replace(/\.[^/.]+$/, "");
  a.href = url;
  a.download = `LexiScan_Analysis_${cleanName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPdfReport(analysis: LegalAnalysisResult, filename?: string) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageHeight - margin - 30) {
      doc.addPage();
      y = margin;
      drawHeaderWatermark();
    }
  }

  function drawHeaderWatermark() {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 165);
    doc.text("LexiScan AI — Legal Intelligence Report", margin, 25);
    doc.text(new Date().toLocaleDateString(), pageWidth - margin, 25, { align: "right" });
    doc.setDrawColor(220, 225, 235);
    doc.line(margin, 30, pageWidth - margin, 30);
  }

  // Cover / Header Banner
  doc.setFillColor(11, 25, 44); // Deep Navy
  doc.rect(margin, y, contentWidth, 70, "F");

  // Gold accent line
  doc.setFillColor(197, 168, 128); // Elegant Gold
  doc.rect(margin, y + 66, contentWidth, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("LEXISCAN AI — LEGAL DOCUMENT REPORT", margin + 16, y + 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(212, 175, 55); // Gold text
  doc.text(
    `Document: ${analysis.documentName}  |  Type: ${analysis.documentType || "Contract"}  |  Date: ${new Date(
      analysis.analysisDate
    ).toLocaleDateString()}`,
    margin + 16,
    y + 50
  );

  y += 88;

  // Executive Summary Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(11, 25, 44);
  doc.text("1. Executive Summary & Core Purpose", margin, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(50, 60, 75);
  const summaryLines = doc.splitTextToSize(analysis.executiveSummary || "N/A", contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 13 + 12;

  // Key Contract Vital Stats Box
  checkPageBreak(75);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 65, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("JURISDICTION", margin + 12, y + 18);
  doc.text("EFFECTIVE DATE", margin + 140, y + 18);
  doc.text("TERM / EXPIRATION", margin + 270, y + 18);
  doc.text("AUTO-RENEWAL", margin + 400, y + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.governingJurisdiction || "Not Specified", margin + 12, y + 36);
  doc.text(analysis.effectiveDate || "Not Stated", margin + 140, y + 36);
  doc.text(analysis.expirationOrTerm || "Not Stated", margin + 270, y + 36);
  doc.text(analysis.terminationAndRenewalTerms?.automaticRenewal ? "Yes (Active)" : "No", margin + 400, y + 36);

  y += 80;

  // Identified Parties
  if (analysis.parties && analysis.parties.length > 0) {
    checkPageBreak(60);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(11, 25, 44);
    doc.text("2. Parties & Primary Obligations", margin, y);
    y += 16;

    analysis.parties.forEach((party, idx) => {
      checkPageBreak(50);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(30, 58, 138); // Navy accent
      doc.text(`Party ${idx + 1}: ${party.name} (${party.role})`, margin, y);
      y += 13;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      party.keyObligations?.forEach((obl) => {
        const oblLines = doc.splitTextToSize(`• ${obl}`, contentWidth - 15);
        checkPageBreak(oblLines.length * 12);
        doc.text(oblLines, margin + 10, y);
        y += oblLines.length * 12;
      });
      y += 6;
    });
    y += 10;
  }

  // Key Clauses Section
  checkPageBreak(60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(11, 25, 44);
  doc.text(`3. Clause Detection & Legal Breakdown (${analysis.clauses?.length || 0} Clauses)`, margin, y);
  y += 18;

  analysis.clauses?.forEach((clause, index) => {
    checkPageBreak(90);

    // Clause card background
    doc.setFillColor(252, 253, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 22, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(11, 25, 44);
    doc.text(`${index + 1}. ${clause.title}`, margin + 8, y + 15);

    // Badge
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(180, 83, 9); // Amber
    doc.text(`[${clause.category}]  ·  ${clause.pageOrSection}  ·  Risk: ${clause.riskLevel}`, margin + 260, y + 15);

    y += 28;

    // Plain English explanation
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    const expLines = doc.splitTextToSize(`Meaning: ${clause.plainEnglishExplanation}`, contentWidth - 16);
    checkPageBreak(expLines.length * 12);
    doc.text(expLines, margin + 8, y);
    y += expLines.length * 12 + 6;

    // Quoted text
    if (clause.originalSupportingText) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      const quoteLines = doc.splitTextToSize(`"${clause.originalSupportingText}"`, contentWidth - 24);
      checkPageBreak(quoteLines.length * 11 + 4);
      doc.text(quoteLines, margin + 16, y);
      y += quoteLines.length * 11 + 8;
    }

    y += 8;
  });

  // Areas Needing Closer Review
  if (analysis.areasNeedingCloserReview && analysis.areasNeedingCloserReview.length > 0) {
    checkPageBreak(80);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(185, 28, 28); // Red-700
    doc.text("4. High-Priority Items & Areas for Closer Review", margin, y);
    y += 18;

    analysis.areasNeedingCloserReview.forEach((item, idx) => {
      checkPageBreak(50);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(153, 27, 27);
      doc.text(`${idx + 1}. ${item.issue}`, margin, y);
      y += 13;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const whyLines = doc.splitTextToSize(`Risk: ${item.whyItMatters}`, contentWidth - 10);
      doc.text(whyLines, margin + 10, y);
      y += whyLines.length * 11;

      const recLines = doc.splitTextToSize(`Recommendation: ${item.recommendedAction}`, contentWidth - 10);
      doc.text(recLines, margin + 10, y);
      y += recLines.length * 11 + 8;
    });
  }

  // Legal Disclaimer Footer
  checkPageBreak(45);
  y += 10;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const discLines = doc.splitTextToSize(analysis.educationalDisclaimer, contentWidth);
  doc.text(discLines, margin, y);

  // Save the PDF
  const cleanName = (filename || analysis.documentName).replace(/\.[^/.]+$/, "");
  doc.save(`LexiScan_Report_${cleanName}.pdf`);
}
