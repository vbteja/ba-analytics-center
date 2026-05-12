'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/Sidebar'
import Filters from '@/components/Filters'
import ExportButton from '@/components/ExportButton'

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const defaultFilters = {
  segment: 'All', risk: 'All', churned: 'All',
  channel: 'All', campaignStatus: 'All',
  supplierStatus: 'All', supplierCategory: 'All',
  year: 'All', dateFrom: '', dateTo: ''
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('churn')
  const [churnData, setChurnData] = useState([])
  const [marketingData, setMarketingData] = useState([])
  const [supplyData, setSupplyData] = useState([])
  const [financialData, setFinancialData] = useState([])
  const [filters, setFilters] = useState(defaultFilters)
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [c, m, s, f] = await Promise.all([
      fetch('/api/churn').then(r => r.json()),
      fetch('/api/marketing').then(r => r.json()),
      fetch('/api/supply-chain').then(r => r.json()),
      fetch('/api/financials').then(r => r.json()),
    ])
    setChurnData(Array.isArray(c) ? c : [])
    setMarketingData(Array.isArray(m) ? m : [])
    setSupplyData(Array.isArray(s) ? s : [])
    setFinancialData(Array.isArray(f) ? f : [])
    setLoading(false)
  }

  async function askAi(q) {
    if (!q) return
    setAiLoading(true)
    setAiAnswer('')
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q })
    })
    const data = await res.json()
    setAiAnswer(data.answer)
    setAiLoading(false)
  }

  // Filtered data
  const filteredChurn = churnData.filter(c => {
    if (filters.segment !== 'All' && c.segment !== filters.segment) return false
    if (filters.risk !== 'All' && c.churn_risk !== filters.risk) return false
    if (filters.churned === 'Active' && c.churned !== 'false') return false
    if (filters.churned === 'Churned' && c.churned !== 'true') return false
    return true
  })

  const filteredMarketing = marketingData.filter(c => {
    if (filters.channel !== 'All' && c.channel !== filters.channel) return false
    if (filters.campaignStatus !== 'All' && c.status !== filters.campaignStatus) return false
    return true
  })

  const filteredSupply = supplyData.filter(s => {
    if (filters.supplierStatus !== 'All' && s.status !== filters.supplierStatus) return false
    if (filters.supplierCategory !== 'All' && s.category !== filters.supplierCategory) return false
    return true
  })

  const filteredFinancial = financialData.filter(f => {
    if (filters.year !== 'All' && String(f.year) !== filters.year) return false
    return true
  })

  // Churn metrics
  const churned = filteredChurn.filter(c => c.churned === 'true')
  const churnRate = filteredChurn.length ? ((churned.length / filteredChurn.length) * 100).toFixed(1) : 0
  const highRisk = filteredChurn.filter(c => c.churn_risk === 'High' || c.churn_risk === 'Critical')
  const avgSpend = filteredChurn.length ? (filteredChurn.reduce((a, c) => a + Number(c.monthly_spend), 0) / filteredChurn.length).toFixed(0) : 0

  // Marketing metrics
  const totalSpend = filteredMarketing.reduce((a, c) => a + Number(c.spend), 0)
  const totalRevenue = filteredMarketing.reduce((a, c) => a + Number(c.revenue), 0)
  const totalROI = totalSpend ? (((totalRevenue - totalSpend) / totalSpend) * 100).toFixed(1) : 0
  const totalConversions = filteredMarketing.reduce((a, c) => a + Number(c.conversions), 0)

  // Supply metrics
  const avgDelivery = filteredSupply.length ? (filteredSupply.reduce((a, s) => a + Number(s.on_time_delivery), 0) / filteredSupply.length).toFixed(1) : 0
  const criticalSuppliers = filteredSupply.filter(s => s.status === 'Critical')
  const atRiskSuppliers = filteredSupply.filter(s => s.status === 'At risk')

  // Financial metrics
  const fin2025 = filteredFinancial.filter(f => f.year === 2025)
  const ytd = fin2025.filter(f => f.revenue_actual)
  const ytdRevenue = ytd.reduce((a, f) => a + Number(f.revenue_actual), 0)
  const ytdForecast = ytd.reduce((a, f) => a + Number(f.revenue_forecast), 0)
  const variance = ytdForecast ? (((ytdRevenue - ytdForecast) / ytdForecast) * 100).toFixed(1) : 0
  const latestActual = filteredFinancial.filter(f => f.revenue_actual).slice(-1)[0]

  const COLORS = {
    green: '#10b981', red: '#ef4444', amber: '#f59e0b',
    blue: '#3b82f6', purple: '#8b5cf6', teal: '#14b8a6',
    orange: '#f97316', pink: '#ec4899'
  }

  const chartBase = {
    backgroundColor: 'transparent',
    textStyle: { color: '#94a3b8', fontSize: 11 },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
  }

  const tooltipStyle = { backgroundColor: '#111', borderColor: '#222', textStyle: { color: '#e5e7eb' } }

  // Churn charts
  const segmentData = Object.entries(
    filteredChurn.reduce((acc, c) => {
      acc[c.segment] = acc[c.segment] || { total: 0, churned: 0 }
      acc[c.segment].total++
      if (c.churned === 'true') acc[c.segment].churned++
      return acc
    }, {})
  ).map(([name, d]) => ({ name, rate: ((d.churned / d.total) * 100).toFixed(1) }))

  const churnSegmentChart = {
    ...chartBase,
    xAxis: { type: 'category', data: segmentData.map(s => s.name), axisLine: { lineStyle: { color: '#1f1f1f' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', formatter: '{value}%' }, splitLine: { lineStyle: { color: '#1a1a1a' } } },
    series: [{ type: 'bar', data: segmentData.map(s => ({ value: s.rate, itemStyle: { color: Number(s.rate) > 25 ? COLORS.red : Number(s.rate) > 15 ? COLORS.amber : COLORS.green, borderRadius: [4, 4, 0, 0] } })), barMaxWidth: 60 }],
    tooltip: { ...tooltipStyle, trigger: 'axis', formatter: '{b}: {c}%' }
  }

  const riskDist = ['Low', 'Medium', 'High', 'Critical'].map(r => ({
    name: r, value: filteredChurn.filter(c => c.churn_risk === r).length
  }))

  const churnRiskChart = {
    ...chartBase,
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['50%', '50%'],
      data: riskDist.map(r => ({ ...r, itemStyle: { color: r.name === 'Critical' ? COLORS.red : r.name === 'High' ? COLORS.amber : r.name === 'Medium' ? COLORS.blue : COLORS.green } })),
      label: { color: '#94a3b8', fontSize: 11 },
    }],
    tooltip: { ...tooltipStyle, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { color: '#94a3b8' } }
  }

  // Churn scatter plot — tenure vs spend colored by risk
  const churnScatterChart = {
    ...chartBase,
    xAxis: { type: 'value', name: 'Tenure (months)', nameTextStyle: { color: '#94a3b8' }, axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#1a1a1a' } } },
    yAxis: { type: 'value', name: 'Monthly Spend ($)', nameTextStyle: { color: '#94a3b8' }, axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#1a1a1a' } } },
    series: ['Low','Medium','High','Critical'].map(risk => ({
      name: risk, type: 'scatter',
      data: filteredChurn.filter(c => c.churn_risk === risk).map(c => [c.tenure_months, Number(c.monthly_spend)]),
      itemStyle: { color: risk === 'Critical' ? COLORS.red : risk === 'High' ? COLORS.amber : risk === 'Medium' ? COLORS.blue : COLORS.green, opacity: 0.7 },
      symbolSize: 8,
    })),
    tooltip: { ...tooltipStyle, formatter: p => `${p.seriesName}<br/>Tenure: ${p.data[0]}mo<br/>Spend: $${p.data[1]}` },
    legend: { top: 0, textStyle: { color: '#94a3b8' } }
  }

  // Marketing charts
  const channelData = Object.entries(
    filteredMarketing.reduce((acc, c) => {
      acc[c.channel] = acc[c.channel] || { spend: 0, revenue: 0, conversions: 0 }
      acc[c.channel].spend += Number(c.spend)
      acc[c.channel].revenue += Number(c.revenue)
      acc[c.channel].conversions += Number(c.conversions)
      return acc
    }, {})
  ).map(([channel, d]) => ({ channel, roi: (((d.revenue - d.spend) / d.spend) * 100).toFixed(1), revenue: d.revenue, spend: d.spend, conversions: d.conversions }))

  const roiChart = {
    ...chartBase,
    xAxis: { type: 'category', data: channelData.map(c => c.channel), axisLine: { lineStyle: { color: '#1f1f1f' } }, axisLabel: { color: '#94a3b8', rotate: 15 } },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', formatter: '{value}%' }, splitLine: { lineStyle: { color: '#1a1a1a' } } },
    series: [{ type: 'bar', data: channelData.map(c => ({ value: c.roi, itemStyle: { color: Number(c.roi) > 200 ? COLORS.green : Number(c.roi) > 100 ? COLORS.blue : COLORS.amber, borderRadius: [4, 4, 0, 0] } })), barMaxWidth: 60 }],
    tooltip: { ...tooltipStyle, trigger: 'axis', formatter: '{b} ROI: {c}%' }
  }

  const spendRevenueChart = {
    ...chartBase,
    xAxis: { type: 'category', data: filteredMarketing.map(c => c.name.split(' ').slice(0,2).join(' ')), axisLabel: { color: '#94a3b8', rotate: 20, fontSize: 10 }, axisLine: { lineStyle: { color: '#1f1f1f' } } },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', formatter: v => `$${(v/1000).toFixed(0)}K` }, splitLine: { lineStyle: { color: '#1a1a1a' } } },
    legend: { top: 0, textStyle: { color: '#94a3b8' } },
    series: [
      { name: 'Spend', type: 'bar', data: filteredMarketing.map(c => Number(c.spend)), itemStyle: { color: COLORS.blue, borderRadius: [3,3,0,0] }, barMaxWidth: 30 },
      { name: 'Revenue', type: 'bar', data: filteredMarketing.map(c => Number(c.revenue)), itemStyle: { color: COLORS.green, borderRadius: [3,3,0,0] }, barMaxWidth: 30 },
    ],
    tooltip: { ...tooltipStyle, trigger: 'axis' }
  }

  // Marketing funnel chart
  const funnelChart = {
    ...chartBase,
    series: [{
      type: 'funnel',
      left: '10%', width: '80%',
      data: [
        { value: filteredMarketing.reduce((a,c) => a + Number(c.impressions), 0), name: 'Impressions' },
        { value: filteredMarketing.reduce((a,c) => a + Number(c.clicks), 0), name: 'Clicks' },
        { value: totalConversions, name: 'Conversions' },
      ].sort((a,b) => b.value - a.value),
      label: { color: '#e5e7eb', formatter: '{b}: {c}' },
      itemStyle: { borderWidth: 0 },
      color: [COLORS.blue, COLORS.purple, COLORS.green],
    }],
    tooltip: { ...tooltipStyle, trigger: 'item', formatter: '{b}: {c}' }
  }

  // Supply charts
  const deliveryChart = {
    ...chartBase,
    grid: { left: '25%', right: '4%', bottom: '5%', top: '5%', containLabel: false },
    xAxis: { type: 'value', min: 60, max: 100, axisLabel: { color: '#94a3b8', formatter: '{value}%' }, splitLine: { lineStyle: { color: '#1a1a1a' } } },
    yAxis: { type: 'category', data: filteredSupply.map(s => s.name), axisLabel: { color: '#94a3b8', fontSize: 10, width: 120, overflow: 'truncate' } },
    series: [{
      type: 'bar',
      data: filteredSupply.map(s => ({ value: Number(s.on_time_delivery), itemStyle: { color: Number(s.on_time_delivery) >= 95 ? COLORS.green : Number(s.on_time_delivery) >= 85 ? COLORS.amber : COLORS.red, borderRadius: [0, 4, 4, 0] } })),
      barMaxWidth: 18
    }],
    tooltip: { ...tooltipStyle, trigger: 'axis', formatter: '{b}: {c}%' }
  }

  // Supply radar chart
  const radarChart = {
    ...chartBase,
    radar: {
      indicator: [
        { name: 'On-Time', max: 100 },
        { name: 'Quality', max: 100 },
        { name: 'Cost', max: 100 },
        { name: 'Lead Time', max: 100 },
        { name: 'Reliability', max: 100 },
      ],
      splitLine: { lineStyle: { color: '#1a1a1a' } },
      axisLine: { lineStyle: { color: '#222' } },
      name: { textStyle: { color: '#94a3b8' } }
    },
    series: [{
      type: 'radar',
      data: filteredSupply.slice(0, 3).map((s, i) => ({
        name: s.name,
        value: [
          Number(s.on_time_delivery),
          Number(s.quality_score),
          Math.max(0, 100 - Number(s.cost_variance) * 5),
          Math.max(0, 100 - s.avg_lead_days * 2),
          Math.max(0, 100 - Number(s.defect_rate) * 20),
        ],
        areaStyle: { opacity: 0.15 },
        lineStyle: { color: [COLORS.green, COLORS.blue, COLORS.amber][i] },
        itemStyle: { color: [COLORS.green, COLORS.blue, COLORS.amber][i] }
      }))
    }],
    legend: { bottom: 0, textStyle: { color: '#94a3b8' }, data: filteredSupply.slice(0,3).map(s => s.name) },
    tooltip: { ...tooltipStyle }
  }

  // Financial charts
  const financialChart = {
    ...chartBase,
    xAxis: { type: 'category', data: filteredFinancial.filter(f => f.year === 2025).map(f => f.month), axisLabel: { color: '#94a3b8' }, axisLine: { lineStyle: { color: '#1f1f1f' } } },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', formatter: v => `$${(v/1000).toFixed(0)}K` }, splitLine: { lineStyle: { color: '#1a1a1a' } } },
    legend: { top: 0, textStyle: { color: '#94a3b8' } },
    series: [
      { name: 'Actual Revenue', type: 'line', data: filteredFinancial.filter(f => f.year === 2025).map(f => f.revenue_actual ? Number(f.revenue_actual) : null), smooth: true, itemStyle: { color: COLORS.green }, lineStyle: { color: COLORS.green, width: 2 }, areaStyle: { color: 'rgba(16,185,129,0.05)' } },
      { name: 'Forecast Revenue', type: 'line', data: filteredFinancial.filter(f => f.year === 2025).map(f => Number(f.revenue_forecast)), smooth: true, itemStyle: { color: COLORS.blue }, lineStyle: { color: COLORS.blue, width: 2, type: 'dashed' } },
      { name: 'Actual Expenses', type: 'line', data: filteredFinancial.filter(f => f.year === 2025).map(f => f.expenses_actual ? Number(f.expenses_actual) : null), smooth: true, itemStyle: { color: COLORS.red }, lineStyle: { color: COLORS.red, width: 2 } },
    ],
    tooltip: { ...tooltipStyle, trigger: 'axis', valueFormatter: v => v ? `$${(v/1000).toFixed(0)}K` : 'N/A' }
  }

  // Year over year comparison
  const yoyChart = {
    ...chartBase,
    xAxis: { type: 'category', data: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], axisLabel: { color: '#94a3b8' }, axisLine: { lineStyle: { color: '#1f1f1f' } } },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', formatter: v => `$${(v/1000).toFixed(0)}K` }, splitLine: { lineStyle: { color: '#1a1a1a' } } },
    legend: { top: 0, textStyle: { color: '#94a3b8' } },
    series: [
      { name: '2024', type: 'bar', data: financialData.filter(f => f.year === 2024).map(f => Number(f.revenue_actual)), itemStyle: { color: COLORS.purple, borderRadius: [3,3,0,0] }, barMaxWidth: 20 },
      { name: '2025 Actual', type: 'bar', data: financialData.filter(f => f.year === 2025).map(f => f.revenue_actual ? Number(f.revenue_actual) : null), itemStyle: { color: COLORS.green, borderRadius: [3,3,0,0] }, barMaxWidth: 20 },
      { name: '2025 Forecast', type: 'line', data: financialData.filter(f => f.year === 2025).map(f => Number(f.revenue_forecast)), smooth: true, lineStyle: { color: COLORS.blue, type: 'dashed' }, itemStyle: { color: COLORS.blue } },
    ],
    tooltip: { ...tooltipStyle, trigger: 'axis', valueFormatter: v => v ? `$${(v/1000).toFixed(0)}K` : '—' }
  }

  const sBadge = (s) => {
    const map = {
      'Active': 'ba-badge ba-badge-green', 'Completed': 'ba-badge ba-badge-blue',
      'At risk': 'ba-badge ba-badge-amber', 'Critical': 'ba-badge ba-badge-red',
      'Low': 'ba-badge ba-badge-green', 'Medium': 'ba-badge ba-badge-amber',
      'High': 'ba-badge ba-badge-red',
    }
    return map[s] || 'ba-badge ba-badge-gray'
  }

  const AIPanel = ({ questions, placeholder }) => (
    <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#818cf8' }}>AI</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>AI analyst</div>
          <div style={{ fontSize: 11, color: '#4b5563' }}>Powered by Claude · Reads your live filtered data</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {questions.map((q, i) => (
          <button key={i} onClick={() => { setAiQuestion(q); askAi(q) }}
            style={{ fontSize: 11, padding: '7px 14px', borderRadius: 8, background: '#141414', border: '1px solid #1f1f1f', color: '#cbd5e1', cursor: 'pointer' }}>
            {q}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input value={aiQuestion} onChange={e => setAiQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && askAi(aiQuestion)}
          placeholder={placeholder} className="ba-input" style={{ flex: 1 }} />
        <button onClick={() => askAi(aiQuestion)} disabled={aiLoading || !aiQuestion} className="ba-btn">
          {aiLoading ? '...' : 'Analyze'}
        </button>
      </div>
      {aiLoading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#4b5563', fontSize: 13, padding: '12px 0' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 6, height: 6, background: '#6366f1', borderRadius: '50%', animation: `bounce 1s infinite ${i*150}ms` }}></div>
            ))}
          </div>
          Claude is analyzing your data...
        </div>
      )}
      {aiAnswer && (
        <div style={{ background: '#111', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: 16, fontSize: 13, color: '#e2e8f0', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginTop: 12 }}>
          {aiAnswer}
        </div>
      )}
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#060606', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
        <p style={{ color: '#4b5563', fontSize: 13 }}>Loading analytics...</p>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#060606', color: '#e5e7eb', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
              {activeTab === 'churn' && 'Customer Churn Analysis'}
              {activeTab === 'marketing' && 'Marketing ROI Optimization'}
              {activeTab === 'supply' && 'Supply Chain Efficiency'}
              {activeTab === 'financial' && 'Financial Forecasting'}
            </h2>
            <p style={{ fontSize: 12, color: '#4b5563' }}>
              {activeTab === 'churn' && `${filteredChurn.length} customers · Last updated now`}
              {activeTab === 'marketing' && `${filteredMarketing.length} campaigns · Q4 2025`}
              {activeTab === 'supply' && `${filteredSupply.length} suppliers · Live data`}
              {activeTab === 'financial' && `${filteredFinancial.length} months · 2024–2025`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {activeTab === 'churn' && <ExportButton data={filteredChurn} filename="churn-analysis" columns={[{label:'Name',key:'name'},{label:'Segment',key:'segment'},{label:'Tenure',key:'tenure_months'},{label:'Spend',key:'monthly_spend'},{label:'Risk',key:'churn_risk'},{label:'Churned',key:'churned'}]} />}
            {activeTab === 'marketing' && <ExportButton data={filteredMarketing} filename="marketing-roi" columns={[{label:'Campaign',key:'name'},{label:'Channel',key:'channel'},{label:'Spend',key:'spend'},{label:'Revenue',key:'revenue'},{label:'Conversions',key:'conversions'},{label:'Status',key:'status'}]} />}
            {activeTab === 'supply' && <ExportButton data={filteredSupply} filename="supply-chain" columns={[{label:'Supplier',key:'name'},{label:'Category',key:'category'},{label:'Country',key:'country'},{label:'On-Time',key:'on_time_delivery'},{label:'Quality',key:'quality_score'},{label:'Status',key:'status'}]} />}
            {activeTab === 'financial' && <ExportButton data={filteredFinancial} filename="financial-forecast" columns={[{label:'Month',key:'month'},{label:'Year',key:'year'},{label:'Revenue Actual',key:'revenue_actual'},{label:'Revenue Forecast',key:'revenue_forecast'},{label:'Profit Actual',key:'profit_actual'}]} />}
          </div>
        </div>

        <Filters filters={filters} setFilters={setFilters} activeTab={activeTab} />

        {/* CUSTOMER CHURN */}
        {activeTab === 'churn' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {[
                { label: 'Churn rate', value: `${churnRate}%`, sub: `${churned.length} customers lost`, color: '#ef4444', glow: 'glow-red' },
                { label: 'High risk', value: highRisk.length, sub: 'Need immediate action', color: '#f59e0b', glow: 'glow-amber' },
                { label: 'Avg monthly spend', value: `$${avgSpend}`, sub: 'Per customer', color: '#10b981', glow: 'glow-green' },
                { label: 'Filtered customers', value: filteredChurn.length, sub: 'Matching filters', color: '#3b82f6', glow: 'glow-blue' },
              ].map((m, i) => (
                <div key={i} className={`ba-metric ${m.glow}`}>
                  <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{m.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: m.color, marginBottom: 4, lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{m.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="ba-card">
                <div className="ba-section-title">Churn rate by segment</div>
                <ReactECharts option={churnSegmentChart} style={{ height: 220 }} />
              </div>
              <div className="ba-card">
                <div className="ba-section-title">Risk distribution</div>
                <ReactECharts option={churnRiskChart} style={{ height: 220 }} />
              </div>
            </div>
            <div className="ba-card">
              <div className="ba-section-title">Tenure vs spend scatter — colored by risk</div>
              <ReactECharts option={churnScatterChart} style={{ height: 260 }} />
            </div>
            <div className="ba-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="ba-section-title" style={{ marginBottom: 0 }}>High risk customers</div>
                <span style={{ fontSize: 11, color: '#4b5563' }}>{highRisk.length} customers</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                      {['Customer','Segment','Tenure','Monthly Spend','Support Tickets','Last Login','Risk','Status'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChurn.filter(c => c.churn_risk === 'Critical' || c.churn_risk === 'High').slice(0, 10).map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #111' }}>
                        <td style={{ padding: '10px 12px', color: '#f1f5f9', fontWeight: 500 }}>{c.name}</td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{c.segment}</td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{c.tenure_months}mo</td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>${Number(c.monthly_spend).toFixed(0)}</td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{c.support_tickets}</td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{c.last_login_days}d ago</td>
                        <td style={{ padding: '10px 12px' }}><span className={sBadge(c.churn_risk)}>{c.churn_risk}</span></td>
                        <td style={{ padding: '10px 12px' }}><span className={c.churned === 'true' ? 'ba-badge ba-badge-red' : 'ba-badge ba-badge-green'}>{c.churned === 'true' ? 'Churned' : 'Active'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <AIPanel
              questions={['Why is churn high?','Which segment needs attention?','Retention strategy recommendations','Predict next quarter churn']}
              placeholder="Ask anything about customer churn..."
            />
          </div>
        )}

        {/* MARKETING ROI */}
        {activeTab === 'marketing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {[
                { label: 'Overall ROI', value: `${totalROI}%`, sub: 'Across filtered campaigns', color: '#10b981', glow: 'glow-green' },
                { label: 'Total revenue', value: `$${(totalRevenue/1000).toFixed(0)}K`, sub: 'From filtered campaigns', color: '#3b82f6', glow: 'glow-blue' },
                { label: 'Total spend', value: `$${(totalSpend/1000).toFixed(0)}K`, sub: 'Budget used', color: '#f59e0b', glow: 'glow-amber' },
                { label: 'Conversions', value: totalConversions.toLocaleString(), sub: 'Total leads generated', color: '#8b5cf6', glow: 'glow-blue' },
              ].map((m, i) => (
                <div key={i} className={`ba-metric ${m.glow}`}>
                  <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{m.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: m.color, marginBottom: 4, lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{m.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="ba-card">
                <div className="ba-section-title">ROI by channel</div>
                <ReactECharts option={roiChart} style={{ height: 220 }} />
              </div>
              <div className="ba-card">
                <div className="ba-section-title">Conversion funnel</div>
                <ReactECharts option={funnelChart} style={{ height: 220 }} />
              </div>
            </div>
            <div className="ba-card">
              <div className="ba-section-title">Spend vs revenue by campaign</div>
              <ReactECharts option={spendRevenueChart} style={{ height: 240 }} />
            </div>
            <div className="ba-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div className="ba-section-title" style={{ marginBottom: 0 }}>Campaign performance table</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                      {['Campaign','Channel','Spend','Revenue','ROI','Conversions','CPA','Status'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMarketing.map(c => {
                      const roi = (((Number(c.revenue) - Number(c.spend)) / Number(c.spend)) * 100).toFixed(0)
                      const cpa = (Number(c.spend) / Number(c.conversions)).toFixed(0)
                      return (
                        <tr key={c.id} style={{ borderBottom: '1px solid #111' }}>
                          <td style={{ padding: '10px 12px', color: '#f1f5f9', fontWeight: 500 }}>{c.name}</td>
                          <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{c.channel}</td>
                          <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>${(Number(c.spend)/1000).toFixed(1)}K</td>
                          <td style={{ padding: '10px 12px', color: '#10b981', fontWeight: 500 }}>${(Number(c.revenue)/1000).toFixed(1)}K</td>
                          <td style={{ padding: '10px 12px', color: Number(roi) > 150 ? '#10b981' : Number(roi) > 80 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>{roi}%</td>
                          <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{Number(c.conversions).toLocaleString()}</td>
                          <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>${cpa}</td>
                          <td style={{ padding: '10px 12px' }}><span className={sBadge(c.status)}>{c.status}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <AIPanel
              questions={['Which channel has best ROI?','Where should I increase budget?','Which campaigns to cut?','Optimize Q4 spend allocation']}
              placeholder="Ask anything about marketing ROI..."
            />
          </div>
        )}

        {/* SUPPLY CHAIN */}
        {activeTab === 'supply' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {[
                { label: 'Avg on-time delivery', value: `${avgDelivery}%`, sub: 'Across filtered suppliers', color: '#10b981', glow: 'glow-green' },
                { label: 'Total suppliers', value: filteredSupply.length, sub: 'Active relationships', color: '#3b82f6', glow: 'glow-blue' },
                { label: 'At risk', value: atRiskSuppliers.length, sub: 'Need monitoring', color: '#f59e0b', glow: 'glow-amber' },
                { label: 'Critical', value: criticalSuppliers.length, sub: 'Immediate action needed', color: '#ef4444', glow: 'glow-red' },
              ].map((m, i) => (
                <div key={i} className={`ba-metric ${m.glow}`}>
                  <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{m.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: m.color, marginBottom: 4, lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{m.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="ba-card">
                <div className="ba-section-title">On-time delivery performance</div>
                <ReactECharts option={deliveryChart} style={{ height: 320 }} />
              </div>
              <div className="ba-card">
                <div className="ba-section-title">Top 3 supplier radar comparison</div>
                <ReactECharts option={radarChart} style={{ height: 320 }} />
              </div>
            </div>
            <div className="ba-card">
              <div className="ba-section-title">Supplier scorecard</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                      {['Supplier','Category','Country','On-Time %','Quality','Lead Days','Cost Var %','Defect %','Status'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSupply.sort((a,b) => Number(b.on_time_delivery) - Number(a.on_time_delivery)).map(s => (
                      <tr key={s.id} style={{ borderBottom: '1px solid #111' }}>
                        <td style={{ padding: '10px 12px', color: '#f1f5f9', fontWeight: 500 }}>{s.name}</td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{s.category}</td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{s.country}</td>
                        <td style={{ padding: '10px 12px', color: Number(s.on_time_delivery) >= 95 ? '#10b981' : Number(s.on_time_delivery) >= 85 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>{s.on_time_delivery}%</td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{s.quality_score}</td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{s.avg_lead_days}d</td>
                        <td style={{ padding: '10px 12px', color: Number(s.cost_variance) > 8 ? '#ef4444' : '#cbd5e1' }}>{s.cost_variance}%</td>
                        <td style={{ padding: '10px 12px', color: Number(s.defect_rate) > 2 ? '#ef4444' : '#cbd5e1' }}>{s.defect_rate}%</td>
                        <td style={{ padding: '10px 12px' }}><span className={sBadge(s.status)}>{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <AIPanel
              questions={['Which suppliers are highest risk?','How to improve delivery performance?','Should I diversify suppliers?','Cost reduction opportunities']}
              placeholder="Ask anything about supply chain..."
            />
          </div>
        )}

        {/* FINANCIAL FORECAST */}
        {activeTab === 'financial' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {[
                { label: 'YTD Revenue 2025', value: `$${(ytdRevenue/1e6).toFixed(2)}M`, sub: 'Actual to date', color: '#10b981', glow: 'glow-green' },
                { label: 'YTD Forecast', value: `$${(ytdForecast/1e6).toFixed(2)}M`, sub: 'Expected to date', color: '#3b82f6', glow: 'glow-blue' },
                { label: 'Variance', value: `${variance}%`, sub: Number(variance) >= 0 ? 'Above forecast ↑' : 'Below forecast ↓', color: Number(variance) >= 0 ? '#10b981' : '#ef4444', glow: Number(variance) >= 0 ? 'glow-green' : 'glow-red' },
                { label: 'Latest month', value: `$${(Number(latestActual?.revenue_actual || 0)/1000).toFixed(0)}K`, sub: `${latestActual?.month || ''} ${latestActual?.year || ''}`, color: '#8b5cf6', glow: 'glow-blue' },
              ].map((m, i) => (
                <div key={i} className={`ba-metric ${m.glow}`}>
                  <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{m.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: m.color, marginBottom: 4, lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{m.sub}</div>
                </div>
              ))}
            </div>
            <div className="ba-card">
              <div className="ba-section-title">Revenue actual vs forecast 2025</div>
              <ReactECharts option={financialChart} style={{ height: 280 }} />
            </div>
            <div className="ba-card">
              <div className="ba-section-title">Year over year comparison 2024 vs 2025</div>
              <ReactECharts option={yoyChart} style={{ height: 260 }} />
            </div>
            <div className="ba-card">
              <div className="ba-section-title">Monthly financial summary</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                      {['Month','Revenue Actual','Revenue Forecast','Variance','Expenses','Profit','Status'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#64748b', fontWeight: 500, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFinancial.filter(f => f.year === 2025).map(f => {
                      const v = f.revenue_actual ? (((Number(f.revenue_actual) - Number(f.revenue_forecast)) / Number(f.revenue_forecast)) * 100).toFixed(1) : null
                      return (
                        <tr key={f.id} style={{ borderBottom: '1px solid #111' }}>
                          <td style={{ padding: '10px 12px', color: '#f1f5f9', fontWeight: 500 }}>{f.month} {f.year}</td>
                          <td style={{ padding: '10px 12px', color: '#10b981', fontWeight: 500 }}>{f.revenue_actual ? `$${(Number(f.revenue_actual)/1000).toFixed(0)}K` : '—'}</td>
                          <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>${(Number(f.revenue_forecast)/1000).toFixed(0)}K</td>
                          <td style={{ padding: '10px 12px', color: v ? (Number(v) >= 0 ? '#10b981' : '#ef4444') : '#4b5563', fontWeight: v ? 600 : 400 }}>{v ? `${Number(v) > 0 ? '+' : ''}${v}%` : '—'}</td>
                          <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{f.expenses_actual ? `$${(Number(f.expenses_actual)/1000).toFixed(0)}K` : '—'}</td>
                          <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{f.profit_actual ? `$${(Number(f.profit_actual)/1000).toFixed(0)}K` : '—'}</td>
                          <td style={{ padding: '10px 12px' }}><span className={f.revenue_actual ? 'ba-badge ba-badge-green' : 'ba-badge ba-badge-gray'}>{f.revenue_actual ? 'Actual' : 'Forecast'}</span></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <AIPanel
              questions={['Will we hit annual target?','What is driving variance?','Forecast Q4 revenue','Where to cut expenses?']}
              placeholder="Ask anything about financial forecasting..."
            />
          </div>
        )}

      </div>
    </div>
  )
}