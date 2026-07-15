type StoryRouteProps = {
  params: Promise<{
    storyId: string;
  }>;
};

const BACKEND_URL = process.env.BACKEND_API_URL;

function getForwardHeaders(request: Request) {
  const headers = new Headers();

  const cookie = request.headers.get("cookie");
  const authorization =
    request.headers.get("authorization");

  if (cookie) {
    headers.set("cookie", cookie);
  }

  if (authorization) {
    headers.set(
      "authorization",
      authorization,
    );
  }

  return headers;
}

async function createProxyResponse(
  backendResponse: Response,
) {
  const responseText =
    await backendResponse.text();

  const contentType =
    backendResponse.headers.get(
      "content-type",
    ) ?? "";

  if (
    responseText &&
    contentType.includes("application/json")
  ) {
    try {
      return Response.json(
        JSON.parse(responseText),
        {
          status: backendResponse.status,
        },
      );
    } catch {
      // Fall through to the plain-text response.
    }
  }

  return new Response(
    responseText || null,
    {
      status: backendResponse.status,
    },
  );
}

export async function PATCH(
  request: Request,
  { params }: StoryRouteProps,
) {
  const { storyId } = await params;

  if (!BACKEND_URL) {
    return Response.json(
      {
        message:
          "BACKEND_API_URL is not configured",
      },
      {
        status: 500,
      },
    );
  }

  try {
    const body = await request.json();

    const headers =
      getForwardHeaders(request);

    headers.set(
      "content-type",
      "application/json",
    );

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/stories/${storyId}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    return createProxyResponse(
      backendResponse,
    );
  } catch (error) {
    console.error(
      "PATCH story proxy error:",
      error,
    );

    return Response.json(
      {
        message:
          "Не вдалося оновити історію",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: StoryRouteProps,
) {
  const { storyId } = await params;

  if (!BACKEND_URL) {
    return Response.json(
      {
        message:
          "BACKEND_API_URL is not configured",
      },
      {
        status: 500,
      },
    );
  }

  const backendResponse = await fetch(
    `${BACKEND_URL}/api/stories/${storyId}`,
    {
      method: "DELETE",
      headers: getForwardHeaders(request),
      cache: "no-store",
    },
  );

  return createProxyResponse(
    backendResponse,
  );
}