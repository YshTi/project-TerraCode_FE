import { cookies } from "next/headers";

import { backendFetch } from "@/lib/api/backend";

const ACCESS_TOKEN_MAX_AGE = 24 * 60 * 60;

async function getSession(accessToken: string) {
  const response = await backendFetch("/api/auth/session", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  return {
    response,
    data,
  };
}

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken) {
    const { response, data } = await getSession(accessToken);

    if (response.ok) {
      return Response.json(data);
    }

    cookieStore.delete("accessToken");
  }

  if (!refreshToken) {
    return Response.json({
      message: "No active session",
      user: null,
    });
  }

  try {
    const refreshResponse = await backendFetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const refreshData = await refreshResponse.json();

    if (!refreshResponse.ok || !refreshData.accessToken) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");

      return Response.json({
        message: "No active session",
        user: null,
      });
    }

    cookieStore.set("accessToken", refreshData.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    const { response, data } = await getSession(refreshData.accessToken);

    if (!response.ok) {
      cookieStore.delete("accessToken");

      return Response.json({
        message: "No active session",
        user: null,
      });
    }

    return Response.json(data);
  } catch {
    return Response.json({
      message: "No active session",
      user: null,
    });
  }
}