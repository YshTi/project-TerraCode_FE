const baseUrl = process.env.BACKEND_API_URL;

export async function backendFetch(
  path: string,
  options?: RequestInit,
): Promise<Response> {
  if (!baseUrl) {
    throw new Error("BACKEND_API_URL is not defined");
  }

  return fetch(`${baseUrl}${path}`, {
    ...options,
    cache: "no-store",
  });
}
