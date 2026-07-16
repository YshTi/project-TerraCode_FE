import { backendFetch } from "@/lib/api/backend";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json(
      {
        message: "Verification token is required",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const response = await backendFetch(
      `/api/users/me/verify-email?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => ({
      message: "Unexpected backend response",
    }));

    return Response.json(data, {
      status: response.status,
    });
  } catch {
    return Response.json(
      {
        message: "Email verification failed",
      },
      {
        status: 500,
      },
    );
  }
}