import React from "react";
import "../css/CookieWarningPopup.css";

export default function CookieWarningPopup({ onClose }) {
    return (
        <div className="cookie-popup-overlay">
            <div className="cookie-popup">
                <h2>Enable Cookies</h2>
                <p>
                    To log in with Google, please enable third-party cookies in your
                    browser settings.
                </p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
}
