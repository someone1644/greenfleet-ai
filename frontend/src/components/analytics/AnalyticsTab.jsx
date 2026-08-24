import React from 'react'
import CarbonLedgerPanel from './CarbonLedgerPanel.jsx'

export default function AnalyticsTab({
  activeCategory = 'planned_vs_actual',
  vehicles = [],
  routes = [],
  assignment = {},
  isOptimized = false,
  scenario = 'normal',
}) {
  const driverLabels = vehicles.map((v) => v.driver.replace('Driver ', 'D'))

  const renderContent = () => {
    switch (activeCategory) {
      case 'carbon_ledger':
        return <CarbonLedgerPanel isOptimized={isOptimized} scenario={scenario} />

      case 'planned_vs_actual':
        return (
          <div className="panel analytics-chart-card">
            <div className="analytics-title-row">
              <h2>Planned vs. Actual Duration</h2>
              <span>Per driver, most recent completed plan</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '16px' }}>
              {[
                { driver: 'D001', planned: 244, actual: 261 },
                { driver: 'D002', planned: 256, actual: 249 },
                { driver: 'D003', planned: 171, actual: 178 },
                { driver: 'D004', planned: 247, actual: 268 },
                { driver: 'D005', planned: 220, actual: 231 },
              ].map((item) => (
                <div key={item.driver} className="gauge-card">
                  <div className="gauge-label">{item.driver}</div>
                  <div className="gauge-value" style={{ fontSize: '13px' }}>{item.actual}m / {item.planned}m</div>
                  <div className="gauge-track">
                    <div
                      className="gauge-fill"
                      style={{
                        width: `${Math.min(100, (item.actual / item.planned) * 100)}%`,
                        background: item.actual > item.planned ? '#E58A00' : '#1E8E3E',
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'order_status':
        return (
          <>
            <div className="analytics-summary-row">
              <div className="kpi-card"><span className="kpi-label">Completed</span><div className="kpi-value-row"><span className="kpi-value">142</span></div></div>
              <div className="kpi-card"><span className="kpi-label">Pending</span><div className="kpi-value-row"><span className="kpi-value">9</span></div></div>
              <div className="kpi-card"><span className="kpi-label">Rescheduled</span><div className="kpi-value-row"><span className="kpi-value">5</span></div></div>
              <div className="kpi-card"><span className="kpi-label">Cancelled</span><div className="kpi-value-row"><span className="kpi-value">2</span></div></div>
            </div>
            <div className="panel analytics-chart-card">
              <div className="analytics-title-row">
                <h2>Order Status Distribution</h2>
                <span>Last 7 days performance metrics</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <div style={{ flex: 1, background: 'var(--bg-inset)', padding: '16px', borderRadius: '4px' }}>
                  <div style={{ color: '#1E8E3E', fontWeight: 'bold' }}>90.0% Completed on schedule</div>
                  <div style={{ color: 'var(--text-tertiary)', fontSize: '11px', marginTop: '4px' }}>142 of 158 dispatches reached consignee within window</div>
                </div>
              </div>
            </div>
          </>
        )

      case 'rescheduled':
        return (
          <div className="panel analytics-chart-card">
            <div className="analytics-title-row">
              <h2>Rescheduled Orders</h2>
              <span>Logged exceptions in the last 7 days</span>
            </div>
            <table className="data-table" style={{ marginTop: '12px' }}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Original Route</th>
                  <th>Rescheduled To</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="mono">ORD-2002</td><td className="mono">R02 · 22-08</td><td className="mono">R02 · 23-08</td><td>Recipient unavailable at address</td></tr>
                <tr><td className="mono">ORD-4001</td><td className="mono">R04 · 22-08</td><td className="mono">R04 · 22-08 (PM)</td><td>Facility access restricted until 14:00</td></tr>
                <tr><td className="mono">ORD-5002</td><td className="mono">R05 · 21-08</td><td className="mono">R05 · 22-08</td><td>Vehicle maintenance breakdown</td></tr>
              </tbody>
            </table>
          </div>
        )

      case 'arrival_accuracy':
        return (
          <>
            <div className="analytics-summary-row">
              <div className="kpi-card"><span className="kpi-label">On-time rate</span><div className="kpi-value-row"><span className="kpi-value">91.4%</span></div></div>
              <div className="kpi-card"><span className="kpi-label">Avg. delay</span><div className="kpi-value-row"><span className="kpi-value">6.2 min</span></div></div>
              <div className="kpi-card"><span className="kpi-label">Missed windows</span><div className="kpi-value-row"><span className="kpi-value">4</span></div></div>
              <div className="kpi-card"><span className="kpi-label">Top performer</span><div className="kpi-value-row"><span className="kpi-value">D003</span></div></div>
            </div>
            <div className="panel analytics-chart-card">
              <div className="analytics-title-row">
                <h2>On-Time Arrival Accuracy by Driver</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginTop: '16px' }}>
                {[
                  { driver: 'D001', pct: 88 },
                  { driver: 'D002', pct: 93 },
                  { driver: 'D003', pct: 96 },
                  { driver: 'D004', pct: 84 },
                  { driver: 'D005', pct: 90 },
                ].map((item) => (
                  <div key={item.driver} className="gauge-card">
                    <div className="gauge-label">{item.driver}</div>
                    <div className="gauge-value">{item.pct}%</div>
                    <div className="gauge-track">
                      <div className="gauge-fill" style={{ width: `${item.pct}%`, background: item.pct >= 90 ? '#1E8E3E' : '#E58A00' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )

      case 'plan_history':
        return (
          <div className="panel analytics-chart-card">
            <div className="analytics-title-row">
              <h2>Plan History &amp; Optimisation Impact</h2>
              <span>Solver runs &amp; dispatch audits</span>
            </div>
            <table className="data-table" style={{ marginTop: '12px' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Routes</th>
                  <th>Total Distance</th>
                  <th>Solver</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="mono">22-08-2026</td><td className="mono">{routes.length}</td><td className="mono">102.7 km</td><td>Simulated Annealing (QUBO)</td><td><span className="pill-inline pill-Standard">Active</span></td></tr>
                <tr><td className="mono">21-08-2026</td><td className="mono">12</td><td className="mono">98.4 km</td><td>Simulated Annealing (QUBO)</td><td><span className="pill-inline pill-Standard">Completed</span></td></tr>
                <tr><td className="mono">20-08-2026</td><td className="mono">12</td><td className="mono">104.2 km</td><td>Simulated Annealing (QUBO)</td><td><span className="pill-inline pill-Standard">Completed</span></td></tr>
              </tbody>
            </table>
          </div>
        )

      default:
        return (
          <div className="panel analytics-chart-card">
            <div className="analytics-title-row">
              <h2>Plan History &amp; Optimisation Impact</h2>
              <span>Solver runs &amp; dispatch audits</span>
            </div>
            <p className="detail-empty" style={{ marginTop: '12px' }}>Select an analytics category from the sidebar.</p>
          </div>
        )
    }
  }

  return (
    <main className="tab-panel active">
      <div className="analytics-grid">
        <div className="analytics-content">
          {renderContent()}
        </div>

        {/* Aside Filter */}
        <aside className="analytics-filters-aside">
          <h3>Filters</h3>
          <div className="filter-field">
            <label>Date range</label>
            <select><option>Last 7 days</option><option>Last 30 days</option><option>This quarter</option></select>
          </div>
          <div className="filter-field">
            <label>Driver</label>
            <select>
              <option>All drivers</option>
              {vehicles.map((v) => (
                <option key={v.id}>{v.driver}</option>
              ))}
            </select>
          </div>
        </aside>
      </div>
    </main>
  )
}
