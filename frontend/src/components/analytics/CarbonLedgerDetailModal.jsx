import React from 'react'

export default function CarbonLedgerDetailModal({ isOpen, onClose, record }) {
  if (!isOpen || !record) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="modal-eyebrow">EMISSIONS AUDIT RECORD · {record.ledger_id}</span>
            <h2>Carbon Reduction Record</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Statutory Disclaimer Notice */}
          <div style={{
            background: 'var(--bg-inset, #F8FAFC)',
            borderLeft: '3px solid var(--accent-blue, #2563EB)',
            padding: '10px 14px',
            borderRadius: '4px',
            fontSize: '12px',
            color: 'var(--text-secondary, #475569)',
            lineHeight: 1.5,
          }}>
            <strong>Compliance Notice:</strong> Potential credit-equivalent values represent quantified emission reductions only. They are not verified or issued carbon credits. Eligibility depends on applicable methodology and registry verification.
          </div>

          {/* Record Metadata Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            background: 'var(--bg-surface, #FFFFFF)',
            border: '1px solid var(--line-soft, #E2E8F0)',
            borderRadius: 'var(--radius-sm, 6px)',
            padding: '14px',
          }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary, #94A3B8)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Run ID</span>
              <span className="mono" style={{ fontSize: '13px', fontWeight: 600 }}>{record.run_id}</span>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary, #94A3B8)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Scenario Context</span>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{record.scenario}</span>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary, #94A3B8)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Timestamp</span>
              <span className="mono" style={{ fontSize: '12px', color: 'var(--text-secondary, #64748B)' }}>
                {record.timestamp ? new Date(record.timestamp).toLocaleString() : '—'}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary, #94A3B8)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Verification Status</span>
              <span className="pill-inline pill-Standard" style={{ fontSize: '11px' }}>
                {record.verification_status || 'Not verified'}
              </span>
            </div>
          </div>

          {/* Core Metrics 3-Way Classification */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div className="kpi-card" style={{ padding: '12px' }}>
              <span className="kpi-label">Physical Reduction</span>
              <div className="kpi-value-row">
                <span className="kpi-value" style={{ color: 'var(--accent-green, #16A34A)' }}>
                  {record.co2_avoided_kg?.toFixed(1) || '0.0'}
                </span>
                <span className="kpi-unit">kg CO₂e</span>
              </div>
              <span className="kpi-delta neutral">Physical avoided mass</span>
            </div>

            <div className="kpi-card" style={{ padding: '12px' }}>
              <span className="kpi-label">Potential Credit Equiv.</span>
              <div className="kpi-value-row">
                <span className="kpi-value" style={{ color: 'var(--accent-blue, #2563EB)' }}>
                  {record.potential_credit_equivalent?.toFixed(4) || '0.0000'}
                </span>
                <span className="kpi-unit">tCO₂e</span>
              </div>
              <span className="kpi-delta neutral">Quantification only</span>
            </div>

            <div className="kpi-card" style={{ padding: '12px' }}>
              <span className="kpi-label">Carbon Shadow Value</span>
              <div className="kpi-value-row">
                <span className="kpi-value">
                  ₹{record.carbon_shadow_value?.toFixed(2) || '0.00'}
                </span>
              </div>
              <span className="kpi-delta neutral">@ ₹{record.carbon_shadow_rate_per_tonne || 2500}/t</span>
            </div>
          </div>

          {/* Calculation Step-by-Step Breakdown */}
          <div style={{
            border: '1px solid var(--line-soft, #E2E8F0)',
            borderRadius: 'var(--radius-sm, 6px)',
            padding: '14px',
            background: 'var(--bg-inset, #F8FAFC)',
          }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary, #0F172A)' }}>
              How this was calculated
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary, #334155)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line-soft, #E2E8F0)', paddingBottom: '4px' }}>
                <span>1. Baseline CO₂ Emissions</span>
                <span className="mono font-bold">{record.baseline_co2_kg?.toFixed(1)} kg</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line-soft, #E2E8F0)', paddingBottom: '4px' }}>
                <span>2. Optimised GreenFlow CO₂</span>
                <span className="mono font-bold">− {record.optimised_co2_kg?.toFixed(1)} kg</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line, #CBD5E1)', paddingBottom: '4px', color: 'var(--accent-green, #16A34A)', fontWeight: 700 }}>
                <span>= Avoided Physical CO₂</span>
                <span className="mono">{record.co2_avoided_kg?.toFixed(1)} kg CO₂e</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line-soft, #E2E8F0)', paddingBottom: '4px', paddingTop: '4px' }}>
                <span>3. Metric Tonnes Conversion (Avoided CO₂ / 1,000)</span>
                <span className="mono font-bold">{record.co2_avoided_tonnes?.toFixed(4)} tonnes</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line-soft, #E2E8F0)', paddingBottom: '4px', color: 'var(--accent-blue, #2563EB)', fontWeight: 700 }}>
                <span>= Potential Credit Equivalent (1 tonne = 1 potential unit)</span>
                <span className="mono">{record.potential_credit_equivalent?.toFixed(4)} tCO₂e</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4px', fontWeight: 700 }}>
                <span>4. Carbon Shadow Value (tonnes × ₹{record.carbon_shadow_rate_per_tonne || 2500}/t)</span>
                <span className="mono">₹{record.carbon_shadow_value?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-foot" style={{ marginTop: '12px' }}>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
