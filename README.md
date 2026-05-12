# BA Analytics Center

A production-grade Business Analytics platform built to demonstrate 
enterprise-level data analysis across four core business domains.

## Live demo
👉 https://ba-analytics-center-iodvco5ja-teja-pm-command-center.vercel.app

> Sign up with your email to access the dashboard

---

## What this is

Most BA portfolios are PDFs and slide decks. This is a fully deployed, 
interactive analytics platform powered by a real database, real calculations, 
and AI-driven insights — the kind of tool a Senior BA would actually build 
and use at work.

---

## Four analytics modules

### 1. Customer Churn Analysis
Identifies at-risk customers before they leave using behavioral signals.

**Key metrics:**
- Churn rate by customer segment (Enterprise, SMB, Startup, Mid-Market)
- Risk distribution across Low / Medium / High / Critical tiers
- Tenure vs monthly spend scatter plot — colored by churn risk
- High risk customer table with support tickets and last login data

**BA skills demonstrated:**
- Customer segmentation and cohort analysis
- Predictive risk scoring
- Retention strategy recommendations via AI

---

### 2. Marketing ROI Optimization
Tracks campaign performance across 6 channels to maximize return on ad spend.

**Key metrics:**
- Overall ROI across all campaigns
- ROI by channel — Google Ads, Meta, LinkedIn, Email, SEO, Events
- Conversion funnel — Impressions → Clicks → Conversions
- Campaign spend vs revenue comparison
- Cost per acquisition (CPA) per campaign

**BA skills demonstrated:**
- Multi-channel attribution analysis
- Budget optimization recommendations
- Funnel analysis and conversion tracking

---

### 3. Supply Chain Efficiency
Monitors supplier performance to reduce delivery risk and cost variance.

**Key metrics:**
- Average on-time delivery across 15 global suppliers
- Supplier radar chart — On-Time, Quality, Cost, Lead Time, Reliability
- Supplier scorecard with defect rate and cost variance
- Critical and at-risk supplier flagging

**BA skills demonstrated:**
- Supplier performance benchmarking
- Risk identification and escalation
- Multi-dimensional supplier comparison

---

### 4. Financial Forecasting
Tracks actual revenue vs forecast with variance analysis and year-over-year comparison.

**Key metrics:**
- YTD revenue vs forecast with variance %
- Monthly actual vs forecast line chart
- Year over year comparison — 2024 vs 2025
- Expense tracking and profit analysis

**BA skills demonstrated:**
- Variance analysis and financial modeling
- Revenue forecasting
- P&L interpretation

---

## Enterprise features

| Feature | Details |
|---|---|
| Authentication | Clerk — secure login with email and Google OAuth |
| Live database | Neon DB — serverless Postgres with real data |
| Interactive charts | Apache ECharts — bar, line, scatter, donut, funnel, radar |
| AI insights | Claude Sonnet — reads all live data, answers any question |
| Filters | Per-module filters — segment, risk, channel, status, date range |
| Export | CSV, JSON, PDF export on every module |
| Sidebar navigation | Collapsible sidebar with active state indicators |
| Responsive | Works on desktop and laptop |

---

## Tech stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 15 | React framework with App Router |
| Styling | Tailwind CSS + custom CSS | Dark theme UI |
| Charts | Apache ECharts | Enterprise-grade visualizations |
| Database | Neon DB (Postgres) | Serverless analytics database |
| ORM | Drizzle ORM | Type-safe database queries |
| Auth | Clerk | Production-grade authentication |
| AI | Anthropic Claude Sonnet | AI-powered data analysis |
| Caching | Upstash Redis | Fast data caching |
| Deployment | Vercel | Auto-deploy from GitHub |

---

## Database schema
customers     → churn analysis (100 records)
campaigns     → marketing ROI (12 campaigns)
suppliers     → supply chain (15 suppliers)
orders        → supply chain orders
financials    → revenue forecast (24 months)
---

## AI capabilities

Each module has a dedicated AI analyst powered by Claude. The AI:

- Reads all live data from the database in real time
- Calculates key metrics before sending to Claude
- Answers specific questions with data-driven recommendations
- Provides actionable insights not just observations

Example questions you can ask:
- "Which customer segment has highest churn risk and why?"
- "Which marketing channel should I increase budget for?"
- "Which suppliers pose the biggest delivery risk?"
- "Will we hit our annual revenue target?"

---

## Running locally

**Prerequisites:**
- Node.js 18+
- Accounts on Neon, Clerk, Upstash, Anthropic

**Setup:**

```bash
# Clone the repo
git clone https://github.com/vbteja/ba-analytics-center.git
cd ba-analytics-center

# Install dependencies
npm install

# Add environment variables
touch .env.local
# Add all keys — see .env.example
```

**Environment variables needed:**
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
```bash
# Push database schema
npx drizzle-kit push

# Seed the database
node --env-file=.env.local lib/seed.js

# Run the dev server
npm run dev
```

---

## Project structure
ba-analytics-center/
├── app/
│   ├── api/
│   │   ├── churn/route.js
│   │   ├── marketing/route.js
│   │   ├── supply-chain/route.js
│   │   ├── financials/route.js
│   │   └── ai/route.js
│   ├── sign-in/
│   ├── sign-up/
│   ├── page.js
│   ├── layout.js
│   └── globals.css
├── components/
│   ├── Sidebar.js
│   ├── Filters.js
│   └── ExportButton.js
├── lib/
│   ├── db.js
│   ├── schema.js
│   └── seed.js
└── drizzle.config.js
---

## BA skills showcased

This project demonstrates the full BA skill set:

- **Requirements analysis** — structured data models reflecting real business needs
- **Data analysis** — churn rates, ROI calculations, variance analysis, supplier scoring
- **Process thinking** — supply chain efficiency, marketing funnel analysis
- **Stakeholder communication** — clean dashboards designed for executive review
- **Technical fluency** — full stack deployment, SQL schema design, API integration
- **AI literacy** — Claude API integration for augmented analysis

---

## About

Built by **Brahma Teja** — Product & Project Manager / Business Analyst with 4+ years 
of experience in Tech and FinTech environments.

- 🌐 [PM Command Center](https://your-pm-vercel-url.vercel.app)
- 💼 [LinkedIn](https://linkedin.com/in/brahma-teja-69b91a185)
- 🐙 [GitHub](https://github.com/vbteja)
- 📧 brahma.tej19@gmail.com