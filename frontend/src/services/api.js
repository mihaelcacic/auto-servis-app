// src/api.js

// Use backend URL from environment
import { BACKEND_URL } from '../config/env'

// Allow using an empty `VITE_BACKEND_URL` so the app can call relative
// `/api` paths (useful for Vite dev proxy or when served behind a reverse proxy).
const API_BASE = (BACKEND_URL || '').replace(/\/$/, '');

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
    const res = await fetch(`${API_BASE || ''}/api/health`, { credentials: 'include' });
    return handleRes(res);
}

export async function getMarke() {
    const res = await fetch(`${API_BASE || ''}/api/marke`, { credentials: 'include' });
    return handleRes(res);
}

export async function getModelsByMarka(marka) {
    const res = await fetch(`${API_BASE || ''}/api/model/${encodeURIComponent(marka)}`, {
        credentials: 'include',
    });
    return handleRes(res);
}

export async function getUsluge() {
    const res = await fetch(`${API_BASE || ''}/api/usluge`, { credentials: 'include' });
    return handleRes(res);
}

export async function getServiseri() {
    const res = await fetch(`${API_BASE || ''}/api/serviseri`, { credentials: 'include' });
    return handleRes(res);
}

export async function getZamjenskaSlobodna() {
    const res = await fetch(`${API_BASE || ''}/api/zamjenska-vozila/slobodna`, {
        credentials: 'include',
    });
    return handleRes(res);
}

export async function postNalog(payload) {
    // backend expects client nalog under /api/klijent/nalog
    const res = await fetch(`${API_BASE || ''}/api/klijent/nalog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export async function getNaloziByKlijent(klijentId) {
    // backend endpoint for client nalogs is /api/klijent/nalog/{klijentId}
    const res = await fetch(`${API_BASE || ''}/api/klijent/nalog/${encodeURIComponent(klijentId)}`, {
        credentials: 'include',
    });
    return handleRes(res);
}

// --- Admin endpoints (require ADMIN role) ---
export async function postAdmin(payload) {
    const res = await fetch(`${API_BASE || ''}/api/admin/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export async function postServiserAdmin(payload) {
    const res = await fetch(`${API_BASE || ''}/api/admin/serviser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export async function putServiserAdmin(id, payload) {
    const res = await fetch(`${API_BASE || ''}/api/admin/serviser/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export async function getServiseriAdmin() {
    const res = await fetch(`${API_BASE || ''}/api/admin/serviser/svi`, { credentials: 'include' });
    return handleRes(res);
}

export async function putKlijentAdmin(id, payload) {
    const res = await fetch(`${API_BASE || ''}/api/admin/klijent/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export async function getKlijentiAdmin() {
    const res = await fetch(`${API_BASE || ''}/api/admin/klijent/svi`, { credentials: 'include' });
    return handleRes(res);
}

export async function getNaloziAdmin() {
    const res = await fetch(`${API_BASE || ''}/api/admin/nalozi`, { credentials: 'include' });
    return handleRes(res);
}

export async function deleteNalogAdmin(id) {
    const res = await fetch(`${API_BASE || ''}/api/admin/nalog/delete/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return handleRes(res);
}

// --- Serviser endpoints (authenticated serviser) ---
export async function getMyNalozi() {
    const res = await fetch(`${API_BASE || ''}/api/serviser/nalozi`, { credentials: 'include' });
    return handleRes(res);
}

export async function putNalogStatusServiser(id, status) {
    const url = `${API_BASE || ''}/api/serviser/nalog/${encodeURIComponent(id)}/status?status=${encodeURIComponent(status)}`;
    const res = await fetch(url, { method: 'PUT', credentials: 'include' });
    return handleRes(res);
}

export async function putNalogNapomenaServiser(id, text) {
    const res = await fetch(`${API_BASE || ''}/api/serviser/nalog/${encodeURIComponent(id)}/napomena`, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        credentials: 'include',
        body: text,
    });
    return handleRes(res);
}

// TODO: dodaj uredivanje termina

export default {
    getHealth,
    getMarke,
    getModelsByMarka,
    getUsluge,
    getServiseri,
    getZamjenskaSlobodna,
    postNalog,
    getNaloziByKlijent,
    // admin
    postAdmin,
    postServiserAdmin,
    putServiserAdmin,
    getServiseriAdmin,
    putKlijentAdmin,
    getKlijentiAdmin,
    getNaloziAdmin,
    deleteNalogAdmin,
    // serviser
    getMyNalozi,
    putNalogStatusServiser,
    putNalogNapomenaServiser,
};