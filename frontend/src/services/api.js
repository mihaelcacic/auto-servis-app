// API_BASE selection:
// - In production behind a proxy (nginx), keep relative '/api' so requests are proxied.
// - For dev or direct-backend calls, set VITE_BACKEND_URL or VITE_API_BASE in env (e.g. .env or .env.local)
//   Vite exposes variables prefixed with VITE_ to the client via import.meta.env.
const API_BASE = (() => {
  // prefer an explicit API base if provided
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE
    if (import.meta.env.VITE_BACKEND_URL) return new URL('/api', import.meta.env.VITE_BACKEND_URL).toString()
  }
  // fallback to relative path which works when frontend is proxied to backend
  return '/api'
})()

async function handleRes(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    const err = new Error(text || res.statusText)
    err.status = res.status
    throw err
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()

  // If the server returned HTML (usually the frontend index) for an API path,
  // retry the request directly against the backend dev port. This handles the
  // common case where the frontend server/container is serving index.html for
  // unknown paths instead of proxying to the backend.
  if (ct.includes('text/html')) {
    try {
      const originalUrl = new URL(res.url)
      const apiPath = originalUrl.pathname + originalUrl.search
      const fallback = 'http://localhost:8080' + apiPath
      const retry = await fetch(fallback, { method: res.request ? res.request.method : 'GET' })
      if (!retry.ok) {
        const txt = await retry.text().catch(() => '')
        const err = new Error(txt || retry.statusText)
        err.status = retry.status
        throw err
      }
      const rct = retry.headers.get('content-type') || ''
      if (rct.includes('application/json')) return retry.json()
      return retry.text()
    } catch (e) {
      // If fallback fails, return the original text (likely index.html)
      return res.text()
    }
  }

  return res.text()
}

export async function getHealth(){
  const res = await fetch(`${API_BASE}/health`)
  return handleRes(res)
}

export async function getMarke(){
  const res = await fetch(`${API_BASE}/marke`)
  return handleRes(res)
}

export async function getModelsByMarka(marka){
  const res = await fetch(`${API_BASE}/model/${encodeURIComponent(marka)}`)
  return handleRes(res)
}

export async function getUsluge(){
  const res = await fetch(`${API_BASE}/usluge`)
  return handleRes(res)
}

export async function getServiseri(){
  const res = await fetch(`${API_BASE}/serviseri`)
  return handleRes(res)
}

export async function getZamjenskaSlobodna(){
  const res = await fetch(`${API_BASE}/zamjenska-vozila/slobodna`)
  return handleRes(res)
}

export async function postNalog(payload){
  const res = await fetch(`${API_BASE}/nalog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  return handleRes(res)
}

export async function getNaloziByKlijent(klijentId){
  const res = await fetch(`${API_BASE}/nalog/${encodeURIComponent(klijentId)}`, { credentials: 'include' })
  return handleRes(res)
}

export default { getHealth, getMarke, getModelsByMarka, getUsluge, getServiseri, getZamjenskaSlobodna, postNalog }
