import React from 'react'

export default function AlertTable({ users }) {
  const rows = users.map(u => ({ uid: u.uid, alerts: u.summary?.alerts || [] }))
  return (
    <div>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th style={{textAlign:'left', borderBottom:'1px solid #e5e7eb', padding:'8px'}}>User</th>
            <th style={{textAlign:'left', borderBottom:'1px solid #e5e7eb', padding:'8px'}}>Alerts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.uid}>
              <td style={{padding:'8px'}}><code>{r.uid}</code></td>
              <td style={{padding:'8px'}}>
                {r.alerts.length ? r.alerts.map(a => <span key={a} className="badge alert">{a}</span>) : <span className="muted">None</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
