import React, { useState } from 'react'

export default function AddOrderModal({ isOpen, onClose, onSaveOrder, availableRoutes = [] }) {
  const [orderId, setOrderId] = useState(`ORD-${Math.floor(1000 + Math.random() * 9000)}`)
  const [location, setLocation] = useState('')
  const [boxes, setBoxes] = useState(3)
  const [duration, setDuration] = useState(8)
  const [priority, setPriority] = useState('Standard')
  const [route, setRoute] = useState('R01')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!location.trim()) return

    onSaveOrder({
      id: orderId.trim(),
      loc: location.trim(),
      boxes: Number(boxes) || 1,
      dur: Number(duration) || 5,
      priority,
      route,
    })

    // Reset for next order
    setOrderId(`ORD-${Math.floor(1000 + Math.random() * 9000)}`)
    setLocation('')
    setBoxes(3)
    setDuration(8)
    setPriority('Standard')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="modal-eyebrow">DISPATCH MANAGEMENT</span>
            <h2>Create New Dispatch Order</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Order ID
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Priority Level
                </label>
                <select
                  className="search-input"
                  style={{ width: '100%' }}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="High">High Priority</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Delivery Location / Area
              </label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="e.g. Velachery Hub, Perungudi, Porur"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Cargo Boxes (Count)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="search-input"
                  style={{ width: '100%' }}
                  value={boxes}
                  onChange={(e) => setBoxes(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Stop Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  className="search-input"
                  style={{ width: '100%' }}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Assign to Route
              </label>
              <select
                className="search-input"
                style={{ width: '100%' }}
                value={route}
                onChange={(e) => setRoute(e.target.value)}
              >
                {availableRoutes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} · {r.area} ({r.distanceKm} km, {r.priority} Priority)
                  </option>
                ))}
                <option value="Unassigned">Unassigned (Draft Pool)</option>
              </select>
            </div>
          </div>

          <div className="modal-foot" style={{ marginTop: '16px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create &amp; Add Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
