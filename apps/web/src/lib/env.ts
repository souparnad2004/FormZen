const viteApiUrl = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD && !viteApiUrl) {
  throw new Error("VITE_API_URL is required for production web builds.");
}

export const apiUrl = (viteApiUrl ?? "http://localhost:3000").replace(/\/$/, "");
