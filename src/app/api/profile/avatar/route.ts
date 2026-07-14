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
    const formData = await request.formData();

    const response = await backendFetch("/api/users/me/updateAvatar", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
    });
  } catch {
    return Response.json(
      {
        message: "Avatar update failed",
      },
      {
        status: 500,
      },
    );
  }
}
