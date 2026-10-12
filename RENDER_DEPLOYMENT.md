# Deploying LexiScan AI to Render

This guide outlines step-by-step how to deploy **LexiScan AI** to **[Render](https://render.com/)** in minutes.

---

## Prerequisites

1. A **GitHub** or **GitLab** account.
2. A free **[Render](https://render.com/)** account.
3. A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).

---

## Method 1: Instant Blueprint Deploy (Recommended)

LexiScan AI includes a preconfigured `render.yaml` Blueprint file.

1. **Push your code to GitHub or GitLab**:
   ```bash
   git add .
   git commit -m "Configure LexiScan AI for Render deployment"
   git push origin main
   ```

2. **Open Render Dashboard**:
   - Go to [dashboard.render.com](https://dashboard.render.com/).
   - Click **New +** in the top navigation bar.
   - Select **Blueprint**.

3. **Connect Repository**:
   - Select your `lexiscan-ai` repository.
   - Render reads `render.yaml` automatically.

4. **Provide Environment Variables**:
   - When prompted for `GEMINI_API_KEY`, paste your Gemini API key from Google AI Studio.
   - Click **Apply**.

5. Render will automatically install dependencies, build the Vite production bundle, start the Express server, and assign a free HTTPS URL (e.g. `https://lexiscan-ai.onrender.com`).

---

## Method 2: Manual Web Service Setup on Render

If you prefer setting up the Web Service manually via Render UI:

1. **Push your code to a Git repository** (GitHub or GitLab).
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your repository.
4. Configure the service settings:

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Name** | `lexiscan-ai` | Any name of your choice |
| **Region** | Oregon (US West) / Frankfurt / Singapore | Choose closest to your users |
| **Branch** | `main` | Your production branch |
| **Root Directory** | *(leave empty)* | Runs from project root |
| **Runtime** | `Node` | Native Node runtime |
| **Build Command** | `npm install --legacy-peer-deps && npm run build` | Builds frontend assets to `dist/` |
| **Start Command** | `npm start` | Runs Express server (`tsx server.ts`) |
| **Instance Type** | `Free` | Fits within the free tier |

5. **Configure Environment Variables** (under **Environment** tab):
   - Add Key: `GEMINI_API_KEY` -> Value: `your-actual-gemini-api-key`
   - Add Key: `NODE_ENV` -> Value: `production`
   - *(Optional)* Add Key: `GEMINI_MODEL` -> Value: `gemini-3.8-flash`
   *(Note: Do NOT set `PORT` manually; Render automatically provides and maps its own port).*

6. **Configure Health Check** (under **Advanced**):
   - **Health Check Path**: `/api/health`

7. Click **Create Web Service**.

---

## Method 3: Docker Deployment on Render (Optional)

LexiScan AI also includes a multi-stage `Dockerfile`.

1. Go to **New +** -> **Web Service** on Render.
2. Connect your Git repository.
3. Select **Docker** as the Runtime (Render will automatically detect `Dockerfile`).
4. Add the `GEMINI_API_KEY` environment variable in the dashboard.
5. Click **Create Web Service**.

---

## Verifying Your Deployment

Once Render finishes deploying:

1. **Check the logs**: You should see:
   ```text
   ==================================================
          LexiScan AI — Legal Document Analyzer     
    Server active on: http://0.0.0.0:10000
    Environment:     production
    Health check:    http://0.0.0.0:10000/api/health
   ==================================================
   ```

2. **Test the Health Endpoint**:
   Visit `https://your-app-name.onrender.com/api/health` in your browser.
   You should receive a JSON response:
   ```json
   {
     "status": "ok",
     "hasApiKey": true,
     "model": "gemini-3.8-flash",
     "service": "LexiScan AI Legal Document Analyzer",
     "environment": "production"
   }
   ```

3. **Test Document Analysis**:
   Open the root URL (`https://your-app-name.onrender.com`), click any of the 4 sample contracts (e.g. Mutual NDA), and verify that the AI executive summary, clause analysis, and document Q&A work seamlessly.

---

## Common Issues & Troubleshooting

### 1. `sh: 1: tsx: not found`
- **Cause**: `tsx` was placed under `devDependencies` and omitted during production installs.
- **Solution**: In `package.json`, `tsx` is now moved to `dependencies` so it is always present at runtime.

### 2. `Frontend assets not compiled` (503 error)
- **Cause**: The build command did not run `npm run build`.
- **Solution**: Ensure your Render Build Command is `npm install && npm run build`.

### 3. `GEMINI_API_KEY is not configured` (500 error)
- **Cause**: Missing API key in Render environment settings.
- **Solution**: Go to Render Dashboard -> Web Service -> **Environment** tab -> Add `GEMINI_API_KEY` with your Google AI Studio key.

### 4. Cold Start Latency on Free Tier
- On Render's Free tier, services spin down after 15 minutes of inactivity. The first request after sleep may take ~30-50 seconds to boot up. This is expected behavior for Render's free tier.
