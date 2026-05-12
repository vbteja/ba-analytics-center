import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema.js'

const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql, { schema })

const segments = ['Enterprise', 'SMB', 'Startup', 'Mid-Market']
const churnReasons = ['Price', 'Competition', 'Product gaps', 'Poor support', 'No longer needed', null]
const churnRisks = ['Low', 'Medium', 'High', 'Critical']

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randFloat(min, max) { return (Math.random() * (max - min) + min).toFixed(2) }
function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)] }

async function seed() {
  console.log('Seeding customers...')
  const customers = Array.from({ length: 100 }, (_, i) => ({
    name: `Customer ${i + 1}`,
    segment: randItem(segments),
    tenure_months: rand(1, 60),
    monthly_spend: randFloat(100, 5000),
    support_tickets: rand(0, 20),
    last_login_days: rand(0, 90),
    churn_risk: randItem(churnRisks),
    churned: rand(0, 4) === 0 ? 'true' : 'false',
    churn_reason: rand(0, 2) === 0 ? randItem(churnReasons.filter(r => r)) : null,
  }))
  await db.insert(schema.customers).values(customers)

  console.log('Seeding campaigns...')
  const channels = ['Google Ads', 'Meta', 'LinkedIn', 'Email', 'SEO', 'Events']
  const campaigns = [
    { name: 'Q1 Brand Awareness', channel: 'Google Ads', budget: '50000', spend: '48200', impressions: 850000, clicks: 12400, conversions: 380, revenue: '95000', start_date: '2025-01-01', end_date: '2025-03-31', status: 'Completed' },
    { name: 'Q1 Lead Gen', channel: 'LinkedIn', budget: '30000', spend: '29800', impressions: 420000, clicks: 8200, conversions: 210, revenue: '63000', start_date: '2025-01-15', end_date: '2025-03-31', status: 'Completed' },
    { name: 'Q2 Product Launch', channel: 'Meta', budget: '75000', spend: '71500', impressions: 1200000, clicks: 18600, conversions: 520, revenue: '156000', start_date: '2025-04-01', end_date: '2025-06-30', status: 'Completed' },
    { name: 'Q2 Retargeting', channel: 'Google Ads', budget: '25000', spend: '24100', impressions: 380000, clicks: 9800, conversions: 290, revenue: '72500', start_date: '2025-04-15', end_date: '2025-06-30', status: 'Completed' },
    { name: 'Q2 Email Nurture', channel: 'Email', budget: '8000', spend: '7200', impressions: 95000, clicks: 14200, conversions: 180, revenue: '54000', start_date: '2025-04-01', end_date: '2025-06-30', status: 'Completed' },
    { name: 'Q3 SEO Push', channel: 'SEO', budget: '20000', spend: '18500', impressions: 650000, clicks: 22000, conversions: 310, revenue: '93000', start_date: '2025-07-01', end_date: '2025-09-30', status: 'Completed' },
    { name: 'Q3 Enterprise Campaign', channel: 'LinkedIn', budget: '45000', spend: '43200', impressions: 280000, clicks: 6400, conversions: 85, revenue: '127500', start_date: '2025-07-15', end_date: '2025-09-30', status: 'Completed' },
    { name: 'Q3 Events', channel: 'Events', budget: '60000', spend: '58000', impressions: 12000, clicks: 12000, conversions: 145, revenue: '217500', start_date: '2025-08-01', end_date: '2025-09-30', status: 'Completed' },
    { name: 'Q4 Holiday Push', channel: 'Meta', budget: '80000', spend: '62000', impressions: 980000, clicks: 15200, conversions: 420, revenue: '126000', start_date: '2025-10-01', end_date: '2025-12-31', status: 'Active' },
    { name: 'Q4 Email Campaign', channel: 'Email', budget: '12000', spend: '8400', impressions: 120000, clicks: 18600, conversions: 240, revenue: '72000', start_date: '2025-10-15', end_date: '2025-12-31', status: 'Active' },
    { name: 'Q4 Google Search', channel: 'Google Ads', budget: '55000', spend: '38500', impressions: 720000, clicks: 16800, conversions: 380, revenue: '114000', start_date: '2025-11-01', end_date: '2025-12-31', status: 'Active' },
    { name: 'Q4 LinkedIn ABM', channel: 'LinkedIn', budget: '35000', spend: '21000', impressions: 180000, clicks: 4200, conversions: 62, revenue: '93000', start_date: '2025-11-15', end_date: '2025-12-31', status: 'Active' },
  ]
  await db.insert(schema.campaigns).values(campaigns)

  console.log('Seeding suppliers...')
  const supplierData = [
    { name: 'TechParts Inc', category: 'Electronics', country: 'USA', on_time_delivery: '94.5', quality_score: '92.0', avg_lead_days: 7, cost_variance: '2.1', defect_rate: '0.8', status: 'Active' },
    { name: 'Global Logistics Co', category: 'Logistics', country: 'Germany', on_time_delivery: '88.2', quality_score: '89.5', avg_lead_days: 14, cost_variance: '5.3', defect_rate: '1.2', status: 'Active' },
    { name: 'Pacific Materials', category: 'Raw Materials', country: 'China', on_time_delivery: '78.6', quality_score: '82.0', avg_lead_days: 21, cost_variance: '8.7', defect_rate: '2.4', status: 'At risk' },
    { name: 'EuroTech Supply', category: 'Electronics', country: 'Netherlands', on_time_delivery: '96.8', quality_score: '95.5', avg_lead_days: 10, cost_variance: '1.2', defect_rate: '0.3', status: 'Active' },
    { name: 'FastShip LLC', category: 'Logistics', country: 'USA', on_time_delivery: '91.3', quality_score: '88.0', avg_lead_days: 5, cost_variance: '3.4', defect_rate: '0.9', status: 'Active' },
    { name: 'Asian Textiles Ltd', category: 'Textiles', country: 'Vietnam', on_time_delivery: '82.4', quality_score: '85.5', avg_lead_days: 28, cost_variance: '6.2', defect_rate: '1.8', status: 'Active' },
    { name: 'Nordic Components', category: 'Electronics', country: 'Sweden', on_time_delivery: '97.2', quality_score: '96.8', avg_lead_days: 12, cost_variance: '0.8', defect_rate: '0.2', status: 'Active' },
    { name: 'South American Raw', category: 'Raw Materials', country: 'Brazil', on_time_delivery: '71.5', quality_score: '78.0', avg_lead_days: 35, cost_variance: '12.4', defect_rate: '3.6', status: 'Critical' },
    { name: 'MidEast Trading', category: 'Raw Materials', country: 'UAE', on_time_delivery: '85.9', quality_score: '83.5', avg_lead_days: 18, cost_variance: '4.8', defect_rate: '1.5', status: 'Active' },
    { name: 'UK Precision Parts', category: 'Electronics', country: 'UK', on_time_delivery: '93.7', quality_score: '94.2', avg_lead_days: 9, cost_variance: '2.6', defect_rate: '0.5', status: 'Active' },
    { name: 'Rapid Fulfillment', category: 'Logistics', country: 'USA', on_time_delivery: '89.4', quality_score: '87.0', avg_lead_days: 3, cost_variance: '4.1', defect_rate: '1.1', status: 'Active' },
    { name: 'India Textiles Co', category: 'Textiles', country: 'India', on_time_delivery: '80.1', quality_score: '81.5', avg_lead_days: 30, cost_variance: '7.8', defect_rate: '2.1', status: 'At risk' },
    { name: 'Japan Precision', category: 'Electronics', country: 'Japan', on_time_delivery: '98.5', quality_score: '98.2', avg_lead_days: 15, cost_variance: '0.5', defect_rate: '0.1', status: 'Active' },
    { name: 'Canada Forestry', category: 'Raw Materials', country: 'Canada', on_time_delivery: '92.1', quality_score: '90.8', avg_lead_days: 8, cost_variance: '2.9', defect_rate: '0.7', status: 'Active' },
    { name: 'Mexico Assembly', category: 'Manufacturing', country: 'Mexico', on_time_delivery: '86.3', quality_score: '84.5', avg_lead_days: 6, cost_variance: '5.6', defect_rate: '1.4', status: 'Active' },
  ]
  await db.insert(schema.suppliers).values(supplierData)

  console.log('Seeding financials...')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const financialData = [
    ...months.map((month, i) => ({
      month, year: 2024,
      revenue_actual: (800000 + i * 25000 + rand(-30000, 30000)).toFixed(2),
      revenue_forecast: (800000 + i * 25000).toFixed(2),
      expenses_actual: (550000 + i * 15000 + rand(-20000, 20000)).toFixed(2),
      expenses_forecast: (550000 + i * 15000).toFixed(2),
      profit_actual: (250000 + i * 10000 + rand(-15000, 15000)).toFixed(2),
      profit_forecast: (250000 + i * 10000).toFixed(2),
    })),
    ...months.map((month, i) => ({
      month, year: 2025,
      revenue_actual: i < 9 ? (1100000 + i * 30000 + rand(-40000, 40000)).toFixed(2) : null,
      revenue_forecast: (1100000 + i * 30000).toFixed(2),
      expenses_actual: i < 9 ? (720000 + i * 18000 + rand(-25000, 25000)).toFixed(2) : null,
      expenses_forecast: (720000 + i * 18000).toFixed(2),
      profit_actual: i < 9 ? (380000 + i * 12000 + rand(-20000, 20000)).toFixed(2) : null,
      profit_forecast: (380000 + i * 12000).toFixed(2),
    })),
  ]
  await db.insert(schema.financials).values(financialData)

  console.log('✅ All data seeded successfully!')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed error:', err)
  process.exit(1)
})