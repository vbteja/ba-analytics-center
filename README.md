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