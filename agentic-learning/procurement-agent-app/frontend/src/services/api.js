export async function sendAgentQuery(query) {
  const response = await fetch('/api/agents/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })

  if (!response.ok) {
    throw new Error('Failed to call backend')
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
