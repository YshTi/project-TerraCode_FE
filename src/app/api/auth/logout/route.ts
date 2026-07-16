import { cookies } from "next/headers";

import { backendFetch } from "@/lib/api/backend";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken =
    cookieStore.get("refreshToken")?.value;

  let status = 200;

  try {
    if (refreshToken) {
      const response = await backendFetch(
        "/api/auth/logout",
        {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
          cache: "no-store",
        },
      );

      status = response.status;
    }
  } catch {
    status = 200;
  } finally {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  }

  return Response.json(
    {
      message: "Logged out",
    },
    {
      status,
    },
  );
}