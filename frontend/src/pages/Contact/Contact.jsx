import { useState } from "react";

export default function Contact() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // For now just show a confirmation. Hook to backend if needed.
        alert("Hvala! Poruka je poslana.");
        setName("");
        setEmail("");
        setMessage("");
    };

    // Inventirana lokacija u Hrvatskoj: Ulica Primjera 1, Zagreb
    const lat = 45.8150;
    const lng = 15.9819;
    const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

    return (
        <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
            <div style={{ maxWidth: 1100, width: "100%" }}>
                <h1 style={{ textAlign: "center", marginBottom: 8 }}>Kontakt</h1>
                <p style={{ textAlign: "center", marginTop: 0, color: "#555" }}>
                    Imate pitanje ili trebate termin? Pošaljite poruku ili nas posjetite.
                </p>

                <div style={{ display: "flex", gap: 24, marginTop: 18, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 300 }}>
                        <div style={{ borderRadius: 8, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", background: "#fff" }}>
                            <h2 style={{ marginTop: 0 }}>Pošaljite poruku</h2>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <input
                                        placeholder="Vaše ime"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                                    />
                                    <input
                                        placeholder="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}
                                    />
                                    <textarea
                                        placeholder="Poruka"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={6}
                                        required
                                        style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd", resize: "vertical" }}
                                    />
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <button type="submit" style={{ padding: "8px 14px", borderRadius: 6, background: "#1976d2", color: "#fff", border: "none" }}>
                                            Pošalji
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div style={{ marginTop: 16, padding: 16, borderRadius: 8, background: "#fafafa", border: "1px solid #eee" }}>
                            <h3 style={{ marginTop: 0 }}>Kontakt informacije</h3>
                            <p style={{ margin: 4 }}>Ulica Primjera 1</p>
                            <p style={{ margin: 4 }}>10000 Zagreb, Hrvatska</p>
                            <p style={{ margin: 4 }}>Telefon: +385 1 234 5678</p>
                            <p style={{ margin: 4 }}>Email: info@primjer.hr</p>
                        </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 300, height: 420 }}>
                        <div style={{ height: "100%", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
                            <iframe
                                title="Lokacija"
                                src={mapSrc}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}