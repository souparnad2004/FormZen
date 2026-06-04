const viteApiUrl = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD && !viteApiUrl) {
  throw new Error("VITE_API_URL is required for production web builds.");
}

function getApiUrl() {
  const value = viteApiUrl ?? "http://localhost:3000";

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "VITE_API_URL must be a full URL, for example https://api-production-29fe.up.railway.app",
    );
  }

  if (import.meta.env.PROD && url.pathname !== "/") {
    throw new Error(
      "VITE_API_URL must be only the API origin. Do not include a path or /trpc.",
    );
  }

  return url.origin;
}

export const apiUrl = getApiUrl();
