const baseUrl = process.env.BACKEND_API_URL;

export async function backendFetch(
  path: string,
  options?: RequestInit,
): Promise<Response> {
  if (!baseUrl) {
    throw new Error("BACKEND_API_URL is not defined");
  }

  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return fetch(`${normalizedBaseUrl}${normalizedPath}`, {
    ...options,
    cache: "no-store",
  });
}
