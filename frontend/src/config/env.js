function requireEnv(name) {
    const value = import.meta.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
}

export const BACKEND_URL = requireEnv('VITE_BACKEND_URL');
export const FRONTEND_URL = requireEnv('VITE_FRONTEND_URL');