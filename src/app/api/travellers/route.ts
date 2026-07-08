import { NextRequest, NextResponse } from "next/server";
import { isAxiosError } from 'axios';
import { api } from '@/lib/api/backend';

export async function GET(req: NextRequest) {
  try {
    const page = Number(req.nextUrl.searchParams.get('page') ?? 1);
    const limit = Number(req.nextUrl.searchParams.get('limit') ?? 12); // Чітко 12 за ТЗ

    const res = await api('/travellers', {
      params: {
        page, 
        limit,
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
       if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;

     return NextResponse.json(
  { error: errorMessage, response: error.response?.data },
  { status: error.response?.status || 500 }
);
    }
   
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}