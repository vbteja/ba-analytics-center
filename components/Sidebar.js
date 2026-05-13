'use client'
import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'

const nav = [
  { id: 'churn', label: 'Customer Churn', icon: '◎', color: '#ef4444' },
  { id: 'marketing', label: 'Marketing ROI', icon: '◈', color: '#10b981' },
  { id: 'supply', label: 'Supply Chain', icon: '⬡', color: '#f59e0b' },
  { id: 'financial', label: 'Financial Forecast', icon: '◇', color: '#3b82f6' },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      width: collapsed ? 64 : 220,
      minHeight: '100vh',
      background: '#080808',
      borderRight: '1px solid #161616',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflow: 'hidden',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #161616', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>BA</div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>Analytics Center</div>
              <div style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' }}>Business Intelligence</div>
            </div>
          )}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: 16, padding: 4, flexShrink: 0 }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav items */}
      <div style={{ padding: '12px 8px', flex: 1 }}>
        {!collapsed && (
          <div style={{ fontSize: 9, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px 10px', fontWeight: 600 }}>Analytics modules</div>
        )}
        {nav.map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px' : '10px 12px',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: activeTab === item.id ? '#141414' : 'transparent',
            color: activeTab === item.id ? '#fff' : '#6b7280',
            marginBottom: 2, transition: 'all 0.15s',
            justifyContent: collapsed ? 'center' : 'flex-start',
            outline: activeTab === item.id ? `1px solid #1f1f1f` : 'none',
          }}
          onMouseOver={e => { if (activeTab !== item.id) e.currentTarget.style.background = '#0f0f0f' }}
          onMouseOut={e => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent' }}>
            <span style={{ fontSize: 14, color: activeTab === item.id ? item.color : '#4b5563', flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && (
              <span style={{ fontSize: 12, fontWeight: activeTab === item.id ? 500 : 400, whiteSpace: 'nowrap' }}>{item.label}</span>
            )}
            {!collapsed && activeTab === item.id && (
              <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: item.color, flexShrink: 0 }}></span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom section */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #161616' }}>
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UserButton afterSignOutUrl="/sign-in" />
            <div>
              <div style={{ fontSize: 11, color: '#e5e7eb', fontWeight: 500 }}>Brahma Teja</div>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>Business Analyst</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        )}
      </div>
    </div>
  )
}