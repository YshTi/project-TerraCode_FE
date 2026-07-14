import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/lib/api/backend";

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get("page") ?? "1";
  const limit = request.nextUrl.searchParams.get("limit") ?? "12";

  try {
    const searchParams = new URLSearchParams({
      page,
      limit,
    });

    const response = await backendFetch(
      `/api/users?${searchParams.toString()}`,
    );

    const data = await response.json().catch(() => ({
      message: "Backend returned an invalid response",
    }));

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(
      "Failed to load travellers through proxy:",
      error,
    );

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