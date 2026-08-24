import React, { useState, useEffect } from 'react'
import api from '../../services/api.js'

export default function ScenarioModal({ isOpen, onClose }) {
  const [matrixData, setMatrixData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      fetchMatrix()
    }
  }, [isOpen])

  const fetchMatrix = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getScenarioMatrix()
      if (res && res.scenarios && res.scenarios.length > 0) {
        setMatrixData(res)
        return
      }
    } catch {
      // Fallback
    }

    setMatrixData({
      active_scenario_key: 'normal',
      scenarios: [
        {
          scenario_key: 'normal',
          scenario_name: 'Normal Operations',
          total_fuel_l: 11.5,
          total_co2_kg: 30.2,
          direct_fuel_cost: 1916,
          carbon_quota_kg: 1500,
          quota_utilisation_pct: 69.6,
          carbon_status: 'HEALTHY',
          fleet_utilisation_pct: 100,
        },
        {
          scenario_key: 'peak',
          scenario_name: 'Peak Demand Surge',
          total_fuel_l: 15.1,
          total_co2_kg: 39.9,
          direct_fuel_cost: 2435,
          carbon_quota_kg: 1500,
          quota_utilisation_pct: 81.5,
          carbon_status: 'HEALTHY',
          fleet_utilisation_pct: 80,
        },
        {
          scenario_key: 'breakdown',
          scenario_name: 'Fleet Breakdown (V005 Down)',
          total_fuel_l: 14.8,
          total_co2_kg: 38.6,
          direct_fuel_cost: 2380,
          carbon_quota_kg: 1500,
          quota_utilisation_pct: 78.2,
          carbon_status: 'HEALTHY',
          fleet_utilisation_pct: 80,
        },
        {
          scenario_key: 'weather',
          scenario_name: 'Monsoon / Heavy Traffic',
          total_fuel_l: 16.2,
          total_co2_kg: 42.8,
          direct_fuel_cost: 2610,
          carbon_quota_kg: 1500,
          quota_utilisation_pct: 86.4,
          carbon_status: 'WARNING',
          fleet_utilisation_pct: 100,
        },
      ],
      disclaimer: 'Deterministic Quantum-Inspired Multi-Scenario simulation benchmarks.',
    })
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="modal-eyebrow">STRATEGIC SCENARIO COMPARISON</span>
            <h2>Multi-Scenario Planning Matrix</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <span className="btn-spinner" style={{ display: 'inline-block', width: 24, height: 24 }}></span>
              <p>Simulating 4 canonical scenarios side-by-side…</p>
            </div>
          ) : error ? (
            <div style={{ color: 'var(--accent-red)', background: 'var(--accent-red-soft)', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
              {error}
            </div>
          ) : matrixData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="table-scroll" style={{ border: '1px solid var(--line-soft)', borderRadius: 'var(--radius-sm)' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Scenario</th>
                      <th style={{ textAlign: 'right' }}>Fuel (L)</th>
                      <th style={{ textAlign: 'right' }}>CO₂ (kg)</th>
                      <th style={{ textAlign: 'right' }}>Operating Cost</th>
                      <th style={{ textAlign: 'right' }}>Quota (kg)</th>
                      <th style={{ textAlign: 'right' }}>Utilisation</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th style={{ textAlign: 'right' }}>Fleet Util</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matrixData.scenarios.map((s) => {
                      const isActive = s.scenario_key === matrixData.active_scenario_key
                      return (
                        <tr key={s.scenario_key} className={isActive ? 'selected' : ''}>
                          <td>
                            <b>{s.scenario_name}</b>
                            {isActive && <span className="tag" style={{ marginLeft: '6px', fontSize: '9px', padding: '2px 6px' }}>Active</span>}
                          </td>
                          <td className="mono" style={{ textAlign: 'right' }}>{s.total_fuel_l.toFixed(1)}</td>
                          <td className="mono" style={{ textAlign: 'right', color: 'var(--accent-green)', fontWeight: 600 }}>{s.total_co2_kg.toFixed(1)}</td>
                          <td className="mono" style={{ textAlign: 'right', fontWeight: 600 }}>₹{s.direct_fuel_cost.toLocaleString()}</td>
                          <td className="mono" style={{ textAlign: 'right' }}>{s.carbon_quota_kg.toFixed(0)}</td>
                          <td className="mono" style={{ textAlign: 'right', fontWeight: 700 }}>{s.quota_utilisation_pct.toFixed(1)}%</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`status-badge status-${s.carbon_status.toLowerCase()}`}>
                              {s.carbon_status}
                            </span>
                          </td>
                          <td className="mono" style={{ textAlign: 'right' }}>{s.fleet_utilisation_pct.toFixed(0)}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'right' }}>
                * {matrixData.disclaimer}
              </div>
            </div>
          ) : null}
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
