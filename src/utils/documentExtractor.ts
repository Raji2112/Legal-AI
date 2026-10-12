import * as pdfjsLib from "pdfjs-dist";

// Configure worker using CDN matching installed version, with graceful fallback
if (typeof window !== "undefined") {
  try {
    const version = (pdfjsLib as any).version || "4.10.38";
    (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;
  } catch (err) {
    console.warn("Could not set PDF.js workerSrc automatically:", err);
  }
}

export interface ExtractedDocument {
  name: string;
  size: number;
  type: string;
  text: string;
  pageCount: number;
  pages: Array<{ pageNumber: number; text: string }>;
  isScannedPdf?: boolean;
}

export interface ExtractionResult {
  success: boolean;
  document?: ExtractedDocument;
  error?: string;
  isScannedPdf?: boolean;
  isEncrypted?: boolean;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit

export async function extractDocumentText(file: File): Promise<ExtractionResult> {
  // 1. Validate file size
  if (file.size === 0) {
    return {
      success: false,
      error: "The uploaded file is empty (0 bytes). Please upload a valid document.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size exceeds the 15MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a smaller legal document.`,
    };
  }

  const fileName = file.name.toLowerCase();

  // 2. Plain Text File (.txt, .md, .rtf)
  if (fileName.endsWith(".txt") || fileName.endsWith(".text") || fileName.endsWith(".md") || file.type.includes("text/plain")) {
    try {
      const text = await file.text();
      const trimmed = text.trim();

      if (trimmed.length < 20) {
        return {
          success: false,
          error: "The text file contains insufficient or blank content. Please provide a contract or document with readable text.",
        };
      }

      // Estimate pages (~3000 chars per standard legal page)
      const estimatedPages = Math.max(1, Math.ceil(trimmed.length / 3000));
      const pages = [];
      const chunkSize = 3000;
      for (let i = 0; i < trimmed.length; i += chunkSize) {
        pages.push({
          pageNumber: pages.length + 1,
          text: trimmed.slice(i, i + chunkSize),
        });
      }

      return {
        success: true,
        document: {
          name: file.name,
          size: file.size,
          type: "Plain Text Document (.txt)",
          text: trimmed,
          pageCount: estimatedPages,
          pages,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        error: `Failed to read text file: ${err?.message || "Unknown error reading file"}`,
      };
    }
  }

  // 3. PDF File (.pdf)
  if (fileName.endsWith(".pdf") || file.type.includes("pdf")) {
    try {
      const arrayBuffer = await file.arrayBuffer();

      let pdfDoc;
      try {
        const loadingTask = (pdfjsLib as any).getDocument({
          data: arrayBuffer,
          useSystemFonts: true,
        });
        pdfDoc = await loadingTask.promise;
      } catch (pdfErr: any) {
        if (
          pdfErr?.name === "PasswordException" ||
          pdfErr?.message?.toLowerCase().includes("password") ||
          pdfErr?.message?.toLowerCase().includes("encrypted")
        ) {
          return {
            success: false,
            isEncrypted: true,
            error: "This PDF is password-protected or encrypted. Please remove password encryption before uploading for analysis.",
          };
        }
        throw pdfErr;
      }

      const numPages = pdfDoc.numPages;
      if (numPages === 0) {
        return {
          success: false,
          error: "The PDF contains 0 pages.",
        };
      }

      let fullText = "";
      const pagesList: Array<{ pageNumber: number; text: string }> = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageStrings = textContent.items
          .map((item: any) => item.str || "")
          .filter((str: string) => str.trim().length > 0);

        const pageText = pageStrings.join(" ").replace(/\s+/g, " ").trim();
        pagesList.push({
          pageNumber: pageNum,
          text: pageText,
        });

        if (pageText) {
          fullText += `--- [Page ${pageNum}] ---\n${pageText}\n\n`;
        }
      }

      const totalExtractedCharacters = fullText.replace(/---\s*\[Page \d+\]\s*---/g, "").trim().length;

      // 4. Scanned PDF Detection
      // If the document has pages, but extracted text is tiny (e.g. less than 60 characters for multi-page, or less than 25 for 1-page),
      // it is an image-based scanned PDF without an embedded text layer.
      if (totalExtractedCharacters < 35) {
        return {
          success: false,
          isScannedPdf: true,
          error:
            "Scanned PDF detected without an embedded text layer. This file contains non-selectable graphical page scans. " +
            "LexiScan AI requires readable text. Please convert the scanned PDF using an OCR utility " +
            "(such as Adobe Acrobat OCR, Apple Preview text selection, or Google Docs OCR) and upload the searchable document.",
        };
      }

      return {
        success: true,
        document: {
          name: file.name,
          size: file.size,
          type: "Portable Document Format (.pdf)",
          text: fullText.trim(),
          pageCount: numPages,
          pages: pagesList,
          isScannedPdf: false,
        },
      };
    } catch (err: any) {
      console.error("PDF extraction error:", err);
      return {
        success: false,
        error: `Could not parse PDF file: ${err?.message || "File might be corrupted or malformed"}. Please verify the file opens in a standard PDF viewer.`,
      };
    }
  }

  // 4. Unsupported File Extension
  return {
    success: false,
    error: `Unsupported file format (${file.type || "unknown"}). LexiScan AI supports .pdf and .txt files. Please save or export your document as PDF or plain text.`,
  };
}
