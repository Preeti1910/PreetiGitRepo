export async function sendAgentQuery(query, sessionId) {
  const response = await fetch('/api/agents/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, session_id: sessionId })
  })

  if (!response.ok) {
    throw new Error('Failed to call backend')
  }

  return response.json()
}

export async function getSessionHistory(sessionId, limit = 20) {
  const response = await fetch(`/api/sessions/${sessionId}/history?limit=${limit}`)
  if (!response.ok) {
    throw new Error('Failed to load session history')
  }
  return response.json()
}

export async function getVendors() {
  const response = await fetch('/api/vendors')
  if (!response.ok) {
    throw new Error('Failed to load vendors')
  }
  return response.json()
}
