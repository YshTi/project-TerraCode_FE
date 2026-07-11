import { backendFetch } from "@/lib/api/backend";

export async function GET() {
  const response = await backendFetch("/api/categories", {
    method: "GET",
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
