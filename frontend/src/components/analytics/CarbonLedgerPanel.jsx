import React, { useState, useEffect } from 'react'
import api from '../../services/api.js'
import CarbonLedgerDetailModal from './CarbonLedgerDetailModal.jsx'

export default function CarbonLedgerPanel({ isOptimized = false, scenario = 'normal' }) {
  const [ledgerData, setLedgerData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const fetchLedger = async () => {
    setLoading(true)
    try {
      const res = await api.getCarbonLedger()
      if (res && res.records) {
        setLedgerData(res)
      } else {
        setLedgerData({
          summary: {
            total_records: 0,
            total_co2_avoided_kg: 0.0,
            total_potential_credit_equivalent: 0.0,
            total_carbon_shadow_value: 0.0,
            verification_status: 'Not verified',
          },
          records: [],
          disclaimer: 'Potential credit-equivalent values represent quantified emission reductions only. They are not verified or issued carbon credits.',
        })
      }
    } catch {
      setLedgerData({
        summary: {
          total_records: 0,
          total_co2_avoided_kg: 0.0,
          total_potential_credit_equivalent: 0.0,
          total_carbon_shadow_value: 0.0,
          verification_status: 'Not verified',
        },
        records: [],
        disclaimer: 'Potential credit-equivalent values represent quantified emission reductions only. They are not verified or issued carbon credits.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLedger()
  }, [isOptimized, scenario])

  const summary = ledgerData?.summary || {
    total_records: 0,
    total_co2_avoided_kg: 0.0,
    total_potential_credit_equivalent: 0.0,
    total_carbon_shadow_value: 0.0,
    verification_status: 'Not verified',
  }

  const records = ledgerData?.records || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. Header & Title Section */}
      <div className="panel-head" style={{ padding: '0 0 6px 0', borderBottom: 'none' }}>
        <div>
          <span className="modal-eyebrow" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            EMISSIONS QUANTIFICATION &amp; AUDIT LEDGER
          </span>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '2px 0 0 0' }}>
            Carbon Impact &amp; Credit Ledger
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Quantified emissions reductions from GreenFlow optimisation runs.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={fetchLedger}
          title="Refresh ledger records from backend"
          style={{ fontSize: '12px', padding: '6px 12px' }}
        >
          Refresh Ledger
        </button>
      </div>

      {/* 2. Prominent Compliance Note */}
      <div style={{
        background: 'var(--bg-inset, #F8FAFC)',
        border: '1px solid var(--line-soft, #E2E8F0)',
        borderLeft: '4px solid var(--accent-blue, #2563EB)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-sm, 6px)',
        fontSize: '12px',
        color: 'var(--text-secondary, #475569)',
        lineHeight: 1.5,
      }}>
        <strong>Compliance Notice:</strong> Potential credit-equivalent values represent quantified emission reductions only. They are not verified or issued carbon credits.
      </div>

      {/* 3. Top KPI Cards */}
      <div className="analytics-summary-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {/* Total Avoided CO2 */}
        <div className="kpi-card">
          <span className="kpi-label">CO₂ Avoided</span>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: 'var(--accent-green, #16A34A)' }}>
              {records.length > 0 ? summary.total_co2_avoided_kg.toFixed(1) : '—'}
            </span>
            {records.length > 0 && <span className="kpi-unit">kg CO₂e</span>}
          </div>
          <span className="kpi-delta good">
            {records.length > 0 ? `${summary.total_records} run(s) logged` : 'No runs logged yet'}
          </span>
        </div>

        {/* Potential Credit Equivalent */}
        <div className="kpi-card">
          <span className="kpi-label">Potential Credit Equivalent</span>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: 'var(--accent-blue, #2563EB)' }}>
              {records.length > 0 ? summary.total_potential_credit_equivalent.toFixed(4) : '—'}
            </span>
            {records.length > 0 && <span className="kpi-unit">tCO₂e</span>}
          </div>
          <span className="kpi-delta neutral">1 tCO₂e = 1 potential unit</span>
        </div>

        {/* Carbon Shadow Value */}
        <div className="kpi-card">
          <span className="kpi-label">Carbon Shadow Value</span>
          <div className="kpi-value-row">
            <span className="kpi-value">
              {records.length > 0 ? `₹${summary.total_carbon_shadow_value.toFixed(2)}` : '—'}
            </span>
          </div>
          <span className="kpi-delta neutral">@ ₹2,500/tonne internal</span>
        </div>

        {/* Verification Status */}
        <div className="kpi-card">
          <span className="kpi-label">Verification Status</span>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary, #64748B)' }}>
              Not Verified
            </span>
          </div>
          <span className="kpi-delta neutral">Quantification only</span>
        </div>
      </div>

      {/* 4. Ledger Records Table */}
      <div className="panel" style={{ padding: '16px' }}>
        <div className="analytics-title-row" style={{ marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
              Optimization Run Ledger Entries
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Audit-ready log of vehicle-route optimization decarbonization impact
            </span>
          </div>
        </div>

        {loading ? (
          <div className="modal-loading" style={{ padding: '32px 0', textAlign: 'center' }}>
            <span className="btn-spinner" style={{ display: 'inline-block', width: 24, height: 24, verticalAlign: 'middle', marginRight: 8 }}></span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Loading ledger records…</span>
          </div>
        ) : records.length === 0 ? (
          <div style={{
            padding: '36px 16px',
            textAlign: 'center',
            background: 'var(--bg-inset, #F8FAFC)',
            borderRadius: 'var(--radius-sm, 6px)',
            border: '1px dashed var(--line, #CBD5E1)',
          }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary, #64748B)', margin: '0 0 8px 0', fontWeight: 500 }}>
              No optimisation runs have been recorded in the carbon ledger yet.
            </p>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary, #94A3B8)' }}>
              Execute Quantum-Inspired optimization from the Plan &amp; Optimize console to record emission reduction entries.
            </span>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Run ID</th>
                  <th>Date</th>
                  <th>Scenario</th>
                  <th style={{ textAlign: 'right' }}>Baseline CO₂</th>
                  <th style={{ textAlign: 'right' }}>Optimised CO₂</th>
                  <th style={{ textAlign: 'right' }}>CO₂ Avoided</th>
                  <th style={{ textAlign: 'right' }}>Potential Credit Equiv.</th>
                  <th style={{ textAlign: 'right' }}>Shadow Value</th>
                  <th style={{ textAlign: 'center' }}>Verification Status</th>
                  <th style={{ textAlign: 'center' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr
                    key={r.ledger_id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedRecord(r)}
                  >
                    <td className="mono" style={{ fontWeight: 600 }}>{r.run_id}</td>
                    <td className="mono" style={{ fontSize: '12px' }}>
                      {r.timestamp ? new Date(r.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td>{r.scenario}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{r.baseline_co2_kg.toFixed(1)} kg</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{r.optimised_co2_kg.toFixed(1)} kg</td>
                    <td className="mono" style={{ textAlign: 'right', color: 'var(--accent-green, #16A34A)', fontWeight: 700 }}>
                      {r.co2_avoided_kg.toFixed(1)} kg
                    </td>
                    <td className="mono" style={{ textAlign: 'right', color: 'var(--accent-blue, #2563EB)', fontWeight: 600 }}>
                      {r.potential_credit_equivalent.toFixed(4)} tCO₂e
                    </td>
                    <td className="mono" style={{ textAlign: 'right', fontWeight: 600 }}>
                      ₹{r.carbon_shadow_value.toFixed(2)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="pill-inline pill-Standard" style={{ fontSize: '10.5px' }}>
                        {r.verification_status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedRecord(r)
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Detail Modal */}
      <CarbonLedgerDetailModal
        isOpen={Boolean(selectedRecord)}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
      />
    </div>
  )
}
