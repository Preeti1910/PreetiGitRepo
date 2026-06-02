import React, { useEffect, useState } from 'react'
import { getVendors, sendAgentQuery } from './services/api'

const sampleQueries = [
  'Recommend a vendor for laptops under 100000',
  'Summarize the vendor contract',
  'Assess supplier risk for Vendor C'
]

export default function App() {
  const [query, setQuery] = useState(sampleQueries[0])
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [vendors, setVendors] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getVendors()
      .then((data) => setVendors(data.items || []))
      .catch((err) => setError(err.message))
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await sendAgentQuery(query)
      setAnswer(`${result.answer}

Agent: ${result.agent} | Mode: ${result.mode}`)
    } catch (err) {
      setError(err.message)
      setAnswer('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <h1>Procurement Agent App</h1>
      <p>Starter app for vendor recommendation, contract analysis, and supplier risk assessment.</p>

      <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
        <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12 }}>
          <h2>Ask the Agent</h2>
          <form onSubmit={onSubmit}>
            <textarea
              rows={5}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', padding: 12, borderRadius: 8 }}
            />
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {sampleQueries.map((item) => (
                <button key={item} type="button" onClick={() => setQuery(item)} style={{ padding: '8px 12px' }}>
                  Use Sample
                </button>
              ))}
              <button type="submit" disabled={loading} style={{ padding: '8px 12px', background: '#0078d4', color: '#fff', border: 'none', borderRadius: 8 }}>
                {loading ? 'Running...' : 'Run Agent'}
              </button>
            </div>
          </form>

          {error && <p style={{ color: 'crimson' }}>{error}</p>}

          <div style={{ marginTop: 16, background: '#f6f8fa', padding: 16, borderRadius: 8, whiteSpace: 'pre-wrap' }}>
            {answer || 'Response will appear here.'}
          </div>
        </div>

        <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 12 }}>
          <h2>Sample Vendors</h2>
          {vendors.map((v) => (
            <div key={v.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
              <strong>{v.name}</strong>
              <div>Price: ₹{v.price}</div>
              <div>Rating: {v.rating}</div>
              <div>Delivery: {v.delivery_days} days</div>
              <div>Risk: {v.risk_level}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
