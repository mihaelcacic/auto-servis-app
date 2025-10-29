const API_BASE = '/api'

export async function getHealth(){
  const res = await fetch(`${API_BASE}/health`)
  if(!res.ok) throw new Error('Network error')
  return res.text()
}

export default { getHealth }
