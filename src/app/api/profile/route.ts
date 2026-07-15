import { cookies } from "next/headers";

import { backendFetch } from "@/lib/api/backend";

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json(
      {
        message: "Not authorized",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const body = await request.json();

    const response = await backendFetch("/api/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
    });
  } catch {
    return Response.json(
      {
        message: "Profile update failed",
      },
      {
        status: 500,
      },
    );
  }
}
