'use client'

export default function Filters({ filters, setFilters, activeTab }) {

  const churnSegments = ['All', 'Enterprise', 'SMB', 'Startup', 'Mid-Market']
  const churnRisks = ['All', 'Low', 'Medium', 'High', 'Critical']
  const channels = ['All', 'Google Ads', 'Meta', 'LinkedIn', 'Email', 'SEO', 'Events']
  const supplierStatus = ['All', 'Active', 'At risk', 'Critical']
  const years = ['All', '2024', '2025']

  const Select = ({ label, value, options, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        background: '#111', border: '1px solid #222', borderRadius: 8,
        color: '#e5e7eb', fontSize: 11, padding: '6px 10px', outline: 'none',
        cursor: 'pointer'
      }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )

  const DateRange = ({ label, value, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>{label}</span>
      <input type="date" value={value} onChange={e => onChange(e.target.value)} style={{
        background: '#111', border: '1px solid #222', borderRadius: 8,
        color: '#e5e7eb', fontSize: 11, padding: '6px 10px', outline: 'none',
        colorScheme: 'dark'
      }} />
    </div>
  )

  const resetFilters = () => setFilters({
    segment: 'All', risk: 'All', churned: 'All',
    channel: 'All', campaignStatus: 'All',
    supplierStatus: 'All', supplierCategory: 'All',
    year: 'All', dateFrom: '', dateTo: ''
  })

  return (
    <div style={{
      background: '#0a0a0a', border: '1px solid #161616',
      borderRadius: 12, padding: '12px 20px',
      display: 'flex', alignItems: 'center',
      gap: 16, flexWrap: 'wrap', marginBottom: 20
    }}>
      <span style={{ fontSize: 10, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Filters</span>

      {activeTab === 'churn' && <>
        <Select label="Segment" value={filters.segment} options={churnSegments} onChange={v => setFilters({...filters, segment: v})} />
        <Select label="Risk" value={filters.risk} options={churnRisks} onChange={v => setFilters({...filters, risk: v})} />
        <Select label="Status" value={filters.churned} options={['All', 'Active', 'Churned']} onChange={v => setFilters({...filters, churned: v})} />
      </>}

      {activeTab === 'marketing' && <>
        <Select label="Channel" value={filters.channel} options={channels} onChange={v => setFilters({...filters, channel: v})} />
        <Select label="Status" value={filters.campaignStatus} options={['All', 'Active', 'Completed']} onChange={v => setFilters({...filters, campaignStatus: v})} />
      </>}

      {activeTab === 'supply' && <>
        <Select label="Status" value={filters.supplierStatus} options={supplierStatus} onChange={v => setFilters({...filters, supplierStatus: v})} />
        <Select label="Category" value={filters.supplierCategory} options={['All', 'Electronics', 'Logistics', 'Raw Materials', 'Textiles', 'Manufacturing']} onChange={v => setFilters({...filters, supplierCategory: v})} />
      </>}

      {activeTab === 'financial' && <>
        <Select label="Year" value={filters.year} options={years} onChange={v => setFilters({...filters, year: v})} />
        <DateRange label="From" value={filters.dateFrom} onChange={v => setFilters({...filters, dateFrom: v})} />
        <DateRange label="To" value={filters.dateTo} onChange={v => setFilters({...filters, dateTo: v})} />
      </>}

      <button onClick={resetFilters} style={{
        marginLeft: 'auto', fontSize: 11, padding: '6px 14px',
        borderRadius: 8, border: '1px solid #222',
        background: 'transparent', color: '#6b7280',
        cursor: 'pointer', transition: 'all 0.15s'
      }}>Reset</button>
    </div>
  )
}