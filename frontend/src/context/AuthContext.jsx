// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchAttempted, setFetchAttempted] = useState(false);

    useEffect(() => {
        if (fetchAttempted) return; // prevent double fetches
        setFetchAttempted(true);

        fetch("http://localhost:8080/api/user", {
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 401) throw new Error("Not logged in");
                return res.json();
            })
            .then((data) => setUser(data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, [fetchAttempted]);

    const login = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    const logout = () => {
        fetch("http://localhost:8080/logout", {
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
