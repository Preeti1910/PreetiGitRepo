import React, { useEffect, useRef, useState } from 'react'
import { getVendors, sendAgentQuery } from './services/api'

const sampleQueries = [
  'Recommend a vendor for laptops under 100000',
  'Summarize the vendor contract',
  'Assess supplier risk for Vendor C'
]

function getOrCreateSessionId() {
  const key = 'procurement_session_id'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

export default function App() {
  const sessionId = useRef(getOrCreateSessionId())
  const [query, setQuery] = useState(sampleQueries[0])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [vendors, setVendors] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getVendors()
      .then((data) => setVendors(data.items || []))
      .catch((err) => setError(err.message))
  }, [])

  const onNewSession = () => {
    const key = 'procurement_session_id'
    const id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
    sessionId.current = id
    setMessages([])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await sendAgentQuery(query, sessionId.current)
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: query },
        { role: 'agent', text: result.answer, agent: result.agent, mode: result.mode }
      ])
    } catch (err) {
      setError(err.message)
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Ask the Agent</h2>
            <button type="button" onClick={onNewSession} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer' }}>
              New Session
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <textarea
              rows={3}
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

          <div style={{ marginTop: 16, maxHeight: 400, overflowY: 'auto', background: '#f6f8fa', padding: 16, borderRadius: 8 }}>
            {messages.length === 0 && <span style={{ color: '#888' }}>Conversation will appear here.</span>}
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: 12, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                <div style={{
                  display: 'inline-block',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: msg.role === 'user' ? '#0078d4' : '#e8e8e8',
                  color: msg.role === 'user' ? '#fff' : '#222',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                  {msg.agent && <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7 }}>{msg.agent} | {msg.mode}</div>}
                </div>
              </div>
            ))}
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
