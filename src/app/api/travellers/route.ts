import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from '@/lib/api/backend';

export async function GET(req: NextRequest) {
  try {
    const page = Number(req.nextUrl.searchParams.get('page') ?? 1);
    const limit = Number(req.nextUrl.searchParams.get('limit') ?? 12); 

  const res = await backendFetch(`/users?page=${page}&limit=${limit}`);

      if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Помилка бекенду" }, 
        { status: res.status }
      );
    }

   const data = await res.json();

    // Повертаємо дані клієнту
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Помилка у проксі-роуті travellers:", error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}