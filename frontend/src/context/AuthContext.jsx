// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { BACKEND_URL } from '../config/env';

const API_BASE = (BACKEND_URL || '').replace(/\/$/, '');

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetch(`${API_BASE || ''}/api/user`, {
            credentials: "include"
        })
            .then(res => {
                if (res.status === 401) throw new Error("Not logged in");
                return res.json();
            })
            .then(data => {
                // derive roles array from single `role` field and apply hierarchy:
                // ADMIN implies SERVISER as well
                const derivedRoles = [];
                if (data.role) {
                    derivedRoles.push(data.role);
                } else if (Array.isArray(data.roles)) {
                    // fallback if backend still returns roles array
                    derivedRoles.push(...data.roles);
                }

                setUser({
                    id: data.id,
                    name: `${data.ime} ${data.prezime}`,
                    email: data.email,
                    picture: data.slikaUrl,
                    role: data.role,
                    roles: derivedRoles
                });
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = () => {
        // redirect to OAuth endpoint; prefer absolute BACKEND_URL when provided
        const oauthBase = BACKEND_URL || '';
        window.location.href = `${oauthBase}/oauth2/authorization/google`;
    };

    const logout = () => {
        fetch(`${API_BASE || ''}/logout`, {
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
