// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/user`, {
            credentials: "include"
        })
            .then(res => {
                if (res.status === 401) throw new Error("Not logged in");
                return res.json();
            })
            .then(data => {
                setUser({
                    id: data.idKlijent,
                    name: `${data.imeKlijent} ${data.prezimeKlijent}`,
                    email: data.email,
                    picture: data.slikaUrl
                });
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = () => {
        window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
    };

    const logout = () => {
        fetch(`${BACKEND_URL}/logout`, {
            method: "POST",
            credentials: "include"
        }).finally(() => {
            setUser(null);
            window.location.href = "/";
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isLoggedIn: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
