# KhelAI — AI-Powered Sports Talent Assessment Platform ⚡

> *"Discover Your Sport. Discover Your Potential."*  
> Built for the **Smart India Hackathon (SIH 2024)** — Sports & Fitness Technology.

Democratizing grassroots athletic talent identification across India through in-browser computer vision and biomechanical agility tracking with **zero specialized hardware**.

---

## 🚀 Live Demo & Presentation

- **Local Presentation Mode (Recommended for Laptop Demo)**:
  ```bash
  npm run dev
  # Runs on http://localhost:5173
  ```
- **Vercel HTTPS Link (For Mobile / Remote Judge Testing)**:
  - Camera permissions (`getUserMedia`) require **HTTPS** in production.
  - Ready for 1-click deployment on Vercel or Netlify.

---

## 🌟 Key Features

1. **MoveNet AI Lateral Footwork Test (Hero Live CV)**:
   - Real-time pose estimation tracking ankle & hip displacement.
   - 10-second active agility test with 3-2-1 audio beeps and whistle.
   - Live telemetry: lateral speed (px/s), cadence reversals, and benchmark rating.
2. **"I Don't Know My Sport" Discovery Engine**:
   - Interactive millisecond reflex tap test (3 randomized trials).
   - 4-trait biomechanical preference battery.
   - Multi-factor mapping recommending optimal Olympic disciplines (Badminton, Football, Cricket, Boxing, Archery).
3. **Khelo India & SAI 7-Tier National Pathway**:
   - Official 7-stage national progression ladder with active tier illumination.
4. **AI Coaching & Biomechanical Insights**:
   - Serverless `/api/coach` integration with OpenAI / Gemini API support and rich offline fallback drill bank.
5. **Verified Digital Scout Pass**:
   - Exportable athletic talent card with unique Athlete ID (`KHEL-IND-2024-XXXX`), radar bars, and simulated QR verification for SAI scouts.
6. **Pitch Fail-Safes**:
   - **Synthetic Simulation Mode**: Mathematical animated skeleton model for presentations without a camera.
   - **Instant Pitch Demo Button**: 1-click jump to verified sample benchmark scorecards for stage walkthroughs.

---

## 📦 Deployment to Vercel (Step-by-Step)

### Option A: Via GitHub & Vercel Dashboard (Recommended)

1. **Initialize Git & Push to GitHub**:
   ```bash
   cd sports-talent-ai
   git init
   git add .
   git commit -m "feat: KhelAI sports talent platform MVP"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sports-talent-ai.git
   git push -u origin main
   ```
2. **Import to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your `sports-talent-ai` repository.
   - Framework Preset: **Vite** (auto-detected).
   - Build Command: `npm run build`.
   - Output Directory: `dist`.
3. **Add Environment Variables (Optional)**:
   - In Vercel Project Settings → **Environment Variables**, add:
     - `OPENAI_API_KEY`: `your_api_key_here` (Optional for LLM coaching tips).
4. **Click Deploy**:
   - Vercel will build and assign an HTTPS URL (e.g. `https://sports-talent-ai.vercel.app`).

### Option B: Via Vercel CLI

```bash
npx vercel
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Computer Vision**: TensorFlow.js, `@tensorflow-models/pose-detection` (MoveNet SinglePose Lightning)
- **Audio Engine**: Web Audio API Synthesizer
- **Backend / Serverless**: Vercel Serverless Functions (`/api/coach.js`)
# sports-talent-ai
