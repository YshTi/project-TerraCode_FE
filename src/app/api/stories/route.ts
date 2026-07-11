import { cookies } from "next/headers";

import { backendFetch } from "@/lib/api/backend";

export async function GET() {
  return Response.json({
    message: "Stories API route is working",
  });
}

// NOTE: added for issue #52 (AddStoryForm). The GET handler above was
// already here as a placeholder (see issue for the stories list) and is
// intentionally left untouched.
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json({ message: "Not authorized" }, { status: 401 });
  }

  const formData = await request.formData();

  const response = await backendFetch("/api/stories", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await response.json();

  return Response.json(data, {
    status: response.status,
  });
}
