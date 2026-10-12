import express, { Request, Response, NextFunction } from "express";
import { handleAnalyzeDocument, handleAskQuestion, handleHealthCheck } from "./api.js";

export function createExpressApp() {
  const app = express();

  // CORS headers to ensure API availability across origins and Render previews
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API Routes
  app.get("/api/health", handleHealthCheck);
  app.post("/api/analyze-document", handleAnalyzeDocument);
  app.post("/api/ask-document-question", handleAskQuestion);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled server exception:", err);
    res.status(err.status || 500).json({
      error: err.message || "An unexpected internal server error occurred.",
    });
  });

  return app;
}

