// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchAttempted, setFetchAttempted] = useState(false);

    const BACKEND_URL = 'https://appbackend-by7p.onrender.com';

    useEffect(() => {
        if (fetchAttempted) return; // prevent double fetches
        setFetchAttempted(true);

        fetch(`${BACKEND_URL}/api/user`, {
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 401) throw new Error("Not logged in");
                return res.json();
            })
            .then((data) => {
                const mappedUser = {
                    id: data.idKlijent,
                    name: `${data.imeKlijent} ${data.prezimeKlijent}`,
                    email: data.email,
                    picture: data.slikaUrl
                };
                setUser(mappedUser);
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, [fetchAttempted]);

    const login = () => {
        window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
    };

    const logout = () => {
        fetch(`${BACKEND_URL}/logout`, {
            method: "POST",
            credentials: "include",
        }).finally(() => {
            setUser(null);
            window.location.href = "/";
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
