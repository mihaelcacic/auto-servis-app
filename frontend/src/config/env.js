// Safe env accessor: prefer VITE_ variables, but tolerate missing values.
function getEnv(name) {
    const value = import.meta.env[name];
    return value === undefined ? '' : value;
}

// `VITE_BACKEND_URL` should be set for production builds. For local development
// it's useful to leave it empty so the app uses relative `/api` paths and Vite's
// dev-server proxy (configured in `vite.config.js`).
export const BACKEND_URL = getEnv('VITE_BACKEND_URL');
export const FRONTEND_URL = getEnv('VITE_FRONTEND_URL');