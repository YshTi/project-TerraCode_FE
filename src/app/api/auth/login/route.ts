import { NextResponse } from "next/server";

import { backendFetch } from "@/lib/api/backend";

export async function POST(request: Request) {
  const body = await request.json();

  const backendResponse = await backendFetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await backendResponse.json();

  if (!backendResponse.ok) {
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  }

  const response = NextResponse.json(data, {
    status: backendResponse.status,
  });

  response.cookies.set("accessToken", data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10,
  });

  // Forward refreshToken cookie returned by the backend
  if (
    "getSetCookie" in backendResponse.headers &&
    typeof backendResponse.headers.getSetCookie === "function"
  ) {
    const setCookies = backendResponse.headers.getSetCookie();

    for (const cookie of setCookies) {
      response.headers.append("set-cookie", cookie);
    }
  } else {
    const setCookie = backendResponse.headers.get("set-cookie");

    if (setCookie) {
      response.headers.append("set-cookie", setCookie);
    }
  }

  return response;
}