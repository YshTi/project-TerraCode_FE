import { cookies } from "next/headers";
import { backendFetch } from "@/lib/api/backend";

export async function POST() {
  const cookieStore = await cookies();

  const response = await backendFetch("/api/auth/logout", {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${cookieStore.get("refreshToken")?.value ?? ""}`,
    },
  });

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return Response.json({}, { status: response.status });
}