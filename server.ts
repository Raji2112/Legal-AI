import "dotenv/config";
import path from "path";
import fs from "fs";
import express from "express";
import { fileURLToPath } from "url";
import { createExpressApp } from "./src/server/expressApp.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = createExpressApp();

// Render and cloud platforms dynamically inject process.env.PORT (e.g. 10000)
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = "0.0.0.0"; // Explicitly bind to 0.0.0.0 for Render proxy routing

// Resolve static assets: handles both root execution and bundled dist execution
const distPath = fs.existsSync(path.resolve(__dirname, "dist"))
  ? path.resolve(__dirname, "dist")
  : __dirname;

// Serve static assets from build output
app.use(express.static(distPath));

// Fallback to index.html for Single-Page Application (SPA) client-side routing
app.get("*", (req, res, next) => {
  if (req.url.startsWith("/api/")) {
    return next();
  }

  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath, (err) => {
      if (err && !res.headersSent) {
        res.status(500).send("Error serving application index.");
      }
    });
  }

  // Graceful fallback if frontend has not been compiled yet
  res.status(503).json({
    error: "Frontend assets not compiled",
    message: "The application frontend build was not found in 'dist/'. Please run 'npm run build' before starting the server.",
    environment: process.env.NODE_ENV || "production",
  });
});

const server = app.listen(PORT, HOST, () => {
  console.log("==================================================");
  console.log("       LexiScan AI — Legal Document Analyzer     ");
  console.log(` Server active on: http://${HOST}:${PORT}`);
  console.log(` Environment:     ${process.env.NODE_ENV || "production"}`);
  console.log(` Health check:    http://${HOST}:${PORT}/api/health`);
  console.log("==================================================");
});

// Graceful shutdown handling for Render rolling deploys
const handleShutdown = (signal: string) => {
  console.log(`Received ${signal}. Gracefully stopping HTTP server...`);
  server.close(() => {
    console.log("LexiScan AI server terminated cleanly.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forceful shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

