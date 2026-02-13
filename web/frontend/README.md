# ASTRA Frontend

Next.js-based frontend for **ASTRA - Advanced Sustainable Technology & Resource Analytics**, a carbon-aware compute intelligence platform.

## 🌱 Mission

Embed energy and carbon awareness directly into the software development lifecycle, enabling developers to build sustainable systems before deployment.

## Features

- 🌍 **Carbon-Aware Analytics**: Real-time sustainability insights for your code
- 💡 **AI-Powered Recommendations**: Optimize for energy efficiency and carbon reduction
- 📊 **Impact Visualization**: See energy and carbon metrics before deployment
- ⚡ **Compute Hotspot Detection**: Identify inefficient code patterns
- 🎯 **ML Workload Estimation**: Calculate carbon footprint of training & inference
- 🔒 **CI/CD Guardrails**: Enforce carbon budgets as policy-as-code

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Canvas**: React Flow 11 (for architecture visualization)
- **Styling**: TailwindCSS 3.4
- **Icons**: Heroicons
- **HTTP Client**: Axios
- **Language**: TypeScript 5

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- ASTRA backend running on `http://localhost:8000`

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # .env.local is already configured
   # Backend URL: http://localhost:8000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx                 # Landing page (sustainability-focused)
│   ├── builder/page.tsx         # Carbon analysis workspace
│   ├── sandboxes/page.tsx       # Example projects gallery
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── ChatPanel.tsx            # AI sustainability assistant
│   ├── ScopePanel.tsx           # Workload configuration
│   ├── CostDisplay.tsx          # Cost & carbon breakdown
│   └── CustomNode.tsx           # Architecture node renderer
├── lib/
│   ├── api.ts                   # API client
│   └── types.ts                 # TypeScript types
├── package.json
└── next.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Guide

### Carbon Analyzer (`/builder`)

- **Left Panel**: Configure workload scope (users, traffic, data, compute intensity)
- **Center Canvas**: Visualize system architecture and compute flows
- **Right Panel**: Chat with AI for sustainability recommendations

### AI Assistant Prompts

Try asking:
- "How can I reduce the carbon footprint of this ML pipeline?"
- "What's the most energy-efficient region to deploy this workload?"
- "Suggest optimizations to reduce unnecessary API calls"
- "Calculate carbon emissions for training this model"

### Projects Gallery (`/sandboxes`)

- Browse example sustainable architectures
- See carbon and cost comparisons
- Learn from optimization patterns

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Sustainability Features

- ♻️ Optimized bundle size
- 🌿 Efficient rendering patterns
- ⚡ Lazy loading and code splitting
- 🎯 Minimal API calls

---

**Building a greener future, one line of code at a time.**

© 2026 ASTRA - Advanced Sustainable Technology & Resource Analytics
