import { cookies } from "next/headers";

import { backendFetch } from "@/lib/api/backend";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await backendFetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return Response.json(data, {
      status: response.status,
    });
  }

  const cookieStore = await cookies();

  cookieStore.set("accessToken", data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return Response.json(data, {
    status: response.status,
  });
}