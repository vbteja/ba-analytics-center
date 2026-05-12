import Anthropic from '@anthropic-ai/sdk'
import { db } from '@/lib/db'
import { customers, campaigns, suppliers, financials } from '@/lib/schema'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request) {
  try {
    const { question, module } = await request.json()

    const [churnData, marketingData, supplyData, financialData] = await Promise.all([
      db.select().from(customers),
      db.select().from(campaigns),
      db.select().from(suppliers),
      db.select().from(financials),
    ])

    const churnRate = ((churnData.filter(c => c.churned === 'true').length / churnData.length) * 100).toFixed(1)
    const totalRevenue = marketingData.reduce((a, c) => a + Number(c.revenue), 0)
    const totalSpend = marketingData.reduce((a, c) => a + Number(c.spend), 0)
    const avgDelivery = (supplyData.reduce((a, s) => a + Number(s.on_time_delivery), 0) / supplyData.length).toFixed(1)

    const context = `
You are an expert Business Analyst AI. Here is the current business data:

CUSTOMER CHURN:
- Total customers: ${churnData.length}
- Churned: ${churnData.filter(c => c.churned === 'true').length}
- Churn rate: ${churnRate}%
- High risk: ${churnData.filter(c => c.churn_risk === 'High' || c.churn_risk === 'Critical').length}
- By segment: ${JSON.stringify(segments(churnData))}

MARKETING ROI:
- Total campaigns: ${marketingData.length}
- Total spend: $${totalSpend.toLocaleString()}
- Total revenue: $${totalRevenue.toLocaleString()}
- Overall ROI: ${(((totalRevenue - totalSpend) / totalSpend) * 100).toFixed(1)}%
- By channel: ${JSON.stringify(byChannel(marketingData))}

SUPPLY CHAIN:
- Total suppliers: ${supplyData.length}
- Avg on-time delivery: ${avgDelivery}%
- Critical suppliers: ${supplyData.filter(s => s.status === 'Critical').length}
- At risk suppliers: ${supplyData.filter(s => s.status === 'At risk').length}

FINANCIAL FORECAST:
- Latest month revenue: $${Number(financialData.filter(f => f.revenue_actual).slice(-1)[0]?.revenue_actual || 0).toLocaleString()}
- YTD 2025 revenue: $${financialData.filter(f => f.year === 2025 && f.revenue_actual).reduce((a, f) => a + Number(f.revenue_actual), 0).toLocaleString()}

Answer this question concisely with specific data-driven insights and recommendations:
`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: context + question }]
    })

    return NextResponse.json({ answer: message.content[0].text })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

function segments(data) {
  const s = {}
  data.forEach(c => { s[c.segment] = (s[c.segment] || 0) + 1 })
  return s
}

function byChannel(data) {
  const c = {}
  data.forEach(d => {
    if (!c[d.channel]) c[d.channel] = { spend: 0, revenue: 0 }
    c[d.channel].spend += Number(d.spend)
    c[d.channel].revenue += Number(d.revenue)
  })
  return c
}