
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

// --- API funkcije ---

// health check
export async function getHealth() {
    const res = await fetch('/api/health', { credentials: 'include' });
    return handleRes(res);
}

// marke
export async function getMarke() {
    const res = await fetch('/api/marke', { credentials: 'include' });
    return handleRes(res);
}

// modeli po marki
export async function getModelsByMarka(marka) {
    const res = await fetch(`/api/model/${encodeURIComponent(marka)}`, {
        credentials: 'include',
    });
    return handleRes(res);
}

// usluge
export async function getUsluge() {
    const res = await fetch('/api/usluge', { credentials: 'include' });
    return handleRes(res);
}

// serviseri
export async function getServiseri() {
    const res = await fetch('/api/serviseri', { credentials: 'include' });
    return handleRes(res);
}

// zamjenska vozila slobodna
export async function getZamjenskaSlobodna() {
    const res = await fetch('/api/zamjenska-vozila/slobodna', {
        credentials: 'include',
    });
    return handleRes(res);
}

// zauzeti termini
export async function getZauzetiTermini() {
    const res = await fetch('/api/zauzeti-termini', {
        credentials: 'include',
    });
    return handleRes(res);
}

// kreiraj nalog
export async function postNalog(payload) {
    // backend ocekuje klijent nalog pod /api/klijent/nalog
    const res = await fetch('/api/klijent/nalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

// nalozi po klijentu
export async function getNaloziByKlijent(klijentId) {
    // backend endpoint za klijent nalog je /api/klijent/nalog/{klijentId}
    const res = await fetch(`/api/klijent/nalog/${encodeURIComponent(klijentId)}`, {
        credentials: 'include',
    });
    return handleRes(res);
}

// --- Admin funkcije (zahtijevaju ADMIN ulogu) ---
// kreiraj admina
export async function postAdmin(payload) {
    const res = await fetch('/api/admin/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

// kreiraj servisera
export async function postServiserAdmin(payload) {
    const res = await fetch('/api/admin/serviser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

// azuriraj servisera
export async function putServiserAdmin(id, payload) {
    const res = await fetch(`/api/admin/serviser/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

// serviseri admin
export async function getServiseriAdmin() {
    const res = await fetch('/api/admin/serviser/svi', { credentials: 'include' });
    return handleRes(res);
}

// azuriraj klijenta
export async function putKlijentAdmin(id, payload) {
    const res = await fetch(`/api/admin/klijent/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

// klijenti admin
export async function getKlijentiAdmin() {
    const res = await fetch('/api/admin/klijent/svi', { credentials: 'include' });
    return handleRes(res);
}

// nalozi admin
export async function getNaloziAdmin() {
    const res = await fetch('/api/admin/nalozi', { credentials: 'include' });
    return handleRes(res);
}

// obrisi nalog
export async function deleteNalogAdmin(id) {
    const res = await fetch(`/api/admin/nalog/delete/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return handleRes(res);
}

// azuriraj nalog
export async function putNalogAdmin(id, payload) {
    const res = await fetch(`/api/admin/nalog/update/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return handleRes(res);
}

// --- Serviser funkcije (autentikacija servisera) ---
// moji nalozi
export async function getMyNalozi() {
    const res = await fetch('/api/serviser/nalozi', { credentials: 'include' });
    return handleRes(res);
}

// azuriraj status naloga
export async function putNalogStatusServiser(id, status) {
    const url = `/api/serviser/nalog/${encodeURIComponent(id)}/status?status=${encodeURIComponent(status)}`;
    const res = await fetch(url, { method: 'PUT', credentials: 'include' });
    return handleRes(res);
}

// azuriraj napomenu naloga
export async function putNalogNapomenaServiser(id, text) {
    const res = await fetch(`/api/serviser/nalog/${encodeURIComponent(id)}/napomena`, {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        credentials: 'include',
        body: text,
    });
    return handleRes(res);
}

// azuriraj termin naloga
export async function putNalogTerminServiser(id, noviTermin) {
    const res = await fetch(`/api/serviser/nalog/${encodeURIComponent(id)}/termin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ noviTermin: noviTermin }),
    });
    return handleRes(res);
}

// blob odgovor za preuzimanje PDF-a
async function handleBlobRes(res) {
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = new Error(text || res.statusText);
        err.status = res.status;
        throw err;
    }
    const blob = await res.blob();
    // try to derive filename from content-disposition
    const cd = res.headers.get('content-disposition') || '';
    let filename = '';
    const m = /filename\*=UTF-8''([^;\n\r]+)/i.exec(cd) || /filename="?([^";\n\r]+)"?/i.exec(cd);
    if (m && m[1]) filename = decodeURIComponent(m[1]);
    return { blob, filename, contentType: res.headers.get('content-type') };
}

// PDF za preuzimanje vozila sa servisa (lokalno-preuzimanje) - ne mijenja status
export async function downloadServiserNalogPdf(id) {
    const url = `/api/serviser/nalog/preuzimanje/lokalno-preuzimanje/${encodeURIComponent(id)}/pdf`;
    const res = await fetch(url, { credentials: 'include' });
    return handleBlobRes(res);
}

// PDF za predaja vozila (lokalno-preuzimanje) - ne mijenja status
export async function downloadServiserPredajaPdf(id) {
    const url = `/api/serviser/nalog/predaja/lokalno-preuzimanje/${encodeURIComponent(id)}/pdf`;
    const res = await fetch(url, { credentials: 'include' });
    return handleBlobRes(res);
}

// PDF sa emailom poslan klijentu - mijenja status na 1 - salje mail i pdf
export async function getPotvrdaOPredajiWithEmail(id) {
    const url = `/api/serviser/nalog/predaja/${encodeURIComponent(id)}/pdf`;
    const res = await fetch(url, { credentials: 'include' });
    return handleBlobRes(res);
}

// pokreni slanje maila klijentu da je servis gotov (ne mijenja statusa)
export async function notifyServisZavrsen(id) {
    const url = `/api/serviser/nalog/${encodeURIComponent(id)}/servis-zavrsen`;
    const res = await fetch(url, { method: 'POST', credentials: 'include' });
    return handleRes(res);
}

// pdf sa mailom poslan klijentu - mijenja status na 2 - salje mail i pdf
export async function getPotvrdaOPreuzimanjuWithEmail(id) {
    const url = `/api/serviser/nalog/preuzimanje/${encodeURIComponent(id)}/pdf`;
    const res = await fetch(url, { credentials: 'include' });
    return handleBlobRes(res);
}

// preuzmi pdf naloga klijenta
export async function downloadKlijentNalogPdf(id) {
    const url = `/api/klijent/nalog/${encodeURIComponent(id)}/pdf`;
    const res = await fetch(url, { credentials: 'include' });
    return handleBlobRes(res);
}

// preuzmi statistiku
export async function downloadStatistika(format) {
    const f = String(format || 'pdf');
    const url = `/api/statistika/${encodeURIComponent(f)}`;
    const res = await fetch(url, { credentials: 'include' });
    return handleBlobRes(res);
}

// export funkcija za jednostavniji import

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
    putNalogAdmin,
    // serviser
    getMyNalozi,
    putNalogStatusServiser,
    putNalogNapomenaServiser,
    putNalogTerminServiser,
    downloadServiserNalogPdf,
    downloadServiserPredajaPdf,
    notifyServisZavrsen,
    downloadKlijentNalogPdf,
    downloadStatistika,
};