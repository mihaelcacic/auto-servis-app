// src/api.js

// Use backend URL from environment
import { BACKEND_URL } from '../config/env'

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

// --- Admin endpoints (require ADMIN role) ---
export async function postAdmin(payload) {
    const res = await fetch(`${BACKEND_URL}/api/admin/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export async function postServiserAdmin(payload) {
    const res = await fetch(`${BACKEND_URL}/api/admin/serviser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export async function putServiserAdmin(id, payload) {
    const res = await fetch(`${BACKEND_URL}/api/admin/serviser/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export async function getServiseriAdmin() {
    const res = await fetch(`${BACKEND_URL}/api/admin/serviser/svi`, { credentials: 'include' });
    return handleRes(res);
}

export async function putKlijentAdmin(id, payload) {
    const res = await fetch(`${BACKEND_URL}/api/admin/klijent/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

export async function getKlijentiAdmin() {
    const res = await fetch(`${BACKEND_URL}/api/admin/klijent/svi`, { credentials: 'include' });
    return handleRes(res);
}

export async function getNaloziAdmin() {
    const res = await fetch(`${BACKEND_URL}/api/admin/nalozi`, { credentials: 'include' });
    return handleRes(res);
}

export async function deleteNalogAdmin(id) {
    const res = await fetch(`${BACKEND_URL}/api/admin/nalog/delete/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return handleRes(res);
}

// --- Serviser endpoints (authenticated serviser) ---
export async function getMyNalozi() {
    const res = await fetch(`${BACKEND_URL}/api/serviser/nalozi`, { credentials: 'include' });
    return handleRes(res);
}

export async function putNalogStatusServiser(id, status) {
    const url = `${BACKEND_URL}/api/serviser/nalog/${encodeURIComponent(id)}/status?status=${encodeURIComponent(status)}`;
    const res = await fetch(url, { method: 'PUT', credentials: 'include' });
    return handleRes(res);
}

export async function putNalogNapomenaServiser(id, text) {
    const res = await fetch(`${BACKEND_URL}/api/serviser/nalog/${encodeURIComponent(id)}/napomena`, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        credentials: 'include',
        body: text,
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