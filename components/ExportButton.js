'use client'
import { useState } from 'react'

export default function ExportButton({ data, filename, columns }) {
  const [open, setOpen] = useState(false)

  function exportCSV() {
    const headers = columns.map(c => c.label).join(',')
    const rows = data.map(row =>
      columns.map(c => {
        const val = row[c.key]
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val ?? ''
      }).join(',')
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  function exportJSON() {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    a.click()
    URL.revokeObjectURL(url)
    setOpen(false)
  }

  function exportPDF() {
    window.print()
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        fontSize: 11, padding: '7px 14px', borderRadius: 8,
        border: '1px solid #222', background: '#111',
        color: '#e5e7eb', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'all 0.15s'
      }}>
        <span>↓</span> Export
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4,
          background: '#111', border: '1px solid #222', borderRadius: 10,
          padding: 6, zIndex: 100, minWidth: 140,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          {[
            { label: '📊 Export CSV', action: exportCSV },
            { label: '{ } Export JSON', action: exportJSON },
            { label: '🖨 Print / PDF', action: exportPDF },
          ].map(item => (
            <button key={item.label} onClick={item.action} style={{
              width: '100%', padding: '8px 12px', borderRadius: 6,
              border: 'none', background: 'transparent',
              color: '#e5e7eb', cursor: 'pointer', fontSize: 12,
              textAlign: 'left', transition: 'background 0.15s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#1a1a1a'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}