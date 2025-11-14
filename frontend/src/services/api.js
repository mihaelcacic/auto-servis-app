// src/api.js

// Always use the backend defined in the environment
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

async function handleRes(res) {
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = new Error(text || res.statusText);
        err.status = res.status;
        throw err;
    }

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) return res.json();
    return res.text();
}

// --- API calls ---
// Always use absolute URLs with BACKEND_URL and include credentials for cookies/session handling

export async function getHealth() {
    const res = await fetch(`${BACKEND_URL}/api/health`, { credentials: 'include' });
    return handleRes(res);
}

export async function getMarke() {
    const res = await fetch(`${BACKEND_URL}/api/marke`, { credentials: 'include' });
    return handleRes(res);
}

export async function getModelsByMarka(marka) {
    const res = await fetch(`${BACKEND_URL}/api/model/${encodeURIComponent(marka)}`, {
        credentials: 'include',
    });
    return handleRes(res);
}

export async function getUsluge() {
    const res = await fetch(`${BACKEND_URL}/api/usluge`, { credentials: 'include' });
    return handleRes(res);
}

export async function getServiseri() {
    const res = await fetch(`${BACKEND_URL}/api/serviseri`, { credentials: 'include' });
    return handleRes(res);
}

export async function getZamjenskaSlobodna() {
    const res = await fetch(`${BACKEND_URL}/api/zamjenska-vozila/slobodna`, {
        credentials: 'include',
    });
    return handleRes(res);
}

export async function postNalog(payload) {
    const res = await fetch(`${BACKEND_URL}/api/nalog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export async function getNaloziByKlijent(klijentId) {
    const res = await fetch(`${BACKEND_URL}/api/nalog/${encodeURIComponent(klijentId)}`, {
        credentials: 'include',
    });
    return handleRes(res);
}

export default {
    getHealth,
    getMarke,
    getModelsByMarka,
    getUsluge,
    getServiseri,
    getZamjenskaSlobodna,
    postNalog,
    getNaloziByKlijent,
};