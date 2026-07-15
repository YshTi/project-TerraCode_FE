import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/lib/api/backend";

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

const ACCESS_TOKEN_MAX_AGE = 60 * 60;

function createRequestHeaders(
  request: NextRequest,
  accessToken?: string,
): Headers {
  const headers = new Headers();

  const contentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");
  const accept = request.headers.get("accept");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (accept) {
    headers.set("accept", accept);
  }

  /*
   * Preserve cookies because they contain refreshToken
   * and possibly the current accessToken.
   */
  if (cookie) {
    headers.set("cookie", cookie);
  }

  /*
   * A newly refreshed access token must override the old
   * Authorization header or accessToken cookie.
   */
  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  } else if (authorization) {
    headers.set("authorization", authorization);
  }

  return headers;
}

async function sendBackendRequest({
  request,
  targetPath,
  body,
  accessToken,
}: {
  request: NextRequest;
  targetPath: string;
  body?: ArrayBuffer;
  accessToken?: string;
}): Promise<Response> {
  return backendFetch(targetPath, {
    method: request.method,
    headers: createRequestHeaders(request, accessToken),
    body,
  });
}

function forwardBackendHeaders(
  backendResponse: Response,
  response: NextResponse,
) {
  const contentType = backendResponse.headers.get("content-type");

  if (contentType) {
    response.headers.set("content-type", contentType);
  }

  const location = backendResponse.headers.get("location");

  if (location) {
    response.headers.set("location", location);
  }

  /*
   * Forward cookies returned by the backend.
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
      response.headers.append("set-cookie", setCookie);
    }
  }
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

    /*
     * Read the request body once.
     * The same ArrayBuffer can then be reused for the retry.
     */
    const hasBody =
      request.method !== "GET" && request.method !== "HEAD";

    const body = hasBody
      ? await request.arrayBuffer()
      : undefined;

    /*
     * First attempt with the currently available credentials.
     */
    let backendResponse = await sendBackendRequest({
      request,
      targetPath,
      body,
    });

    let newAccessToken: string | undefined;
    let refreshFailed = false;

    const refreshToken =
      request.cookies.get("refreshToken")?.value;

    /*
     * If access authorization failed, use the refresh token
     * and retry the original request exactly once.
     */
    if (
      backendResponse.status === 401 &&
      refreshToken &&
      targetPath !== "/api/auth/refresh"
    ) {
      const refreshResponse = await backendFetch(
        "/api/auth/refresh",
        {
          method: "POST",
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        },
      );

      if (refreshResponse.ok) {
        const refreshData: unknown =
          await refreshResponse.json();

        if (
          typeof refreshData === "object" &&
          refreshData !== null &&
          "accessToken" in refreshData &&
          typeof refreshData.accessToken === "string"
        ) {
          newAccessToken = refreshData.accessToken;

          /*
           * Retry the original protected request with
           * the newly issued access token.
           */
          backendResponse = await sendBackendRequest({
            request,
            targetPath,
            body,
            accessToken: newAccessToken,
          });
        } else {
          refreshFailed = true;
        }
      } else {
        refreshFailed = true;
      }
    }

    const responseBody =
      await backendResponse.arrayBuffer();

    const response = new NextResponse(responseBody, {
      status: backendResponse.status,
    });

    forwardBackendHeaders(backendResponse, response);

    /*
     * Save the new access token in the browser.
     */
    if (newAccessToken) {
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
    }

    /*
     * The refresh token is invalid or expired.
     * Remove both local authentication cookies.
     */
    if (refreshFailed) {
      response.cookies.set("accessToken", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });

      response.cookies.set("refreshToken", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
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