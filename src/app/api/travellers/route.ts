import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL ??
  process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      {
        message: "Backend URL is not configured",
      },
      {
        status: 500,
      },
    );
  }

  const { searchParams } = request.nextUrl;

  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "12";

  try {
    const response = await fetch(
      `${BACKEND_URL}/users?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Не вдалося завантажити мандрівників",
      },
      {
        status: 500,
      },
    );
  }
}