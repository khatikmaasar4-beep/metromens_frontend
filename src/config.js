
// Central API URL configuration.
// For local dev: set VITE_API_URL=http://localhost:5001 in .env
// For production: set VITE_API_URL=https://your-backend.onrender.com in Render/Vercel env vars
export const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";
