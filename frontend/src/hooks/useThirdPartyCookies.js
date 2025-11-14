import { useEffect, useState } from "react";

export default function useThirdPartyCookies() {
    const [enabled, setEnabled] = useState(true); // pretpostavka

    useEffect(() => {
        async function check() {
            try {
                // probamo dobaviti cookie check endpoint
                const response = await fetch(
                    "https://auto-servis-app-valec-backend.onrender.com/cookie-check-status",
                    { credentials: "include" }
                );
                const data = await response.json();
                setEnabled(data.cookieSet === true);
            } catch (err) {
                setEnabled(false);
            }
        }

        // prvo triggeramo postavljanje cookieja
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = "https://auto-servis-app-valec-backend.onrender.com/cookie-check";
        document.body.appendChild(iframe);

        iframe.onload = () => {
            setTimeout(check, 300);
        };
    }, []);

    return enabled;
}