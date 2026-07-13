import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/lib/api/backend";

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

async function proxyRequest(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  try {
    const { path } = await context.params;

    const backendPath = `/api/${path.join("/")}`;
    const queryString = request.nextUrl.searchParams.toString();

    const targetPath = queryString
      ? `${backendPath}?${queryString}`
      : backendPath;

    const requestHeaders = new Headers();

    const contentType = request.headers.get("content-type");
    const authorization = request.headers.get("authorization");
    const cookie = request.headers.get("cookie");
    const accept = request.headers.get("accept");

    if (contentType) {
      requestHeaders.set("content-type", contentType);
    }

    if (authorization) {
      requestHeaders.set("authorization", authorization);
    }

    if (cookie) {
      requestHeaders.set("cookie", cookie);
    }

    if (accept) {
      requestHeaders.set("accept", accept);
    }

    const hasBody =
      request.method !== "GET" && request.method !== "HEAD";

    const body = hasBody
      ? await request.arrayBuffer()
      : undefined;

    const backendResponse = await backendFetch(targetPath, {
      method: request.method,
      headers: requestHeaders,
      body,
    });

    const responseBody = await backendResponse.arrayBuffer();

    const response = new NextResponse(responseBody, {
      status: backendResponse.status,
    });

    const responseContentType =
      backendResponse.headers.get("content-type");

    if (responseContentType) {
      response.headers.set("content-type", responseContentType);
    }

    const location = backendResponse.headers.get("location");

    if (location) {
      response.headers.set("location", location);
    }

    /*
     * Forward authentication cookies returned by the backend.
     */
    if (
      "getSetCookie" in backendResponse.headers &&
      typeof backendResponse.headers.getSetCookie === "function"
    ) {
      const cookies = backendResponse.headers.getSetCookie();

      for (const cookieValue of cookies) {
        response.headers.append("set-cookie", cookieValue);
      }
    } else {
      const setCookie = backendResponse.headers.get("set-cookie");

      if (setCookie) {
        response.headers.set("set-cookie", setCookie);
      }
    }

    return response;
  } catch (error) {
    console.error("Backend proxy request failed:", error);

    return NextResponse.json(
      {
        message: "Backend request failed",
      },
      {
        status: 500,
      },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;