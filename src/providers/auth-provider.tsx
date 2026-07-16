"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  articlesAmount?: number;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(
  null,
);

async function getSessionUser(): Promise<AuthUser | null> {
  const response = await fetch("/api/auth/session", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return data.user ?? null;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const refreshUser = async () => {
    setIsLoading(true);

    try {
      const sessionUser =
        await getSessionUser();

      setUser(sessionUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error,
      );
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    let ignore = false;

    getSessionUser()
      .then((sessionUser) => {
        if (!ignore) {
          setUser(sessionUser);
        }
      })
      .catch(() => {
        if (!ignore) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("BroadcastChannel" in window)
    ) {
      return;
    }

    const authChannel =
      new BroadcastChannel("auth");

    const handleAuthMessage = (
      event: MessageEvent,
    ) => {
      if (
        event.data?.type !== "logout"
      ) {
        return;
      }

      setUser(null);
      setIsLoading(false);

      router.replace("/auth/login");
      router.refresh();
    };

    authChannel.addEventListener(
      "message",
      handleAuthMessage,
    );

    return () => {
      authChannel.removeEventListener(
        "message",
        handleAuthMessage,
      );

      authChannel.close();
    };
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(
    AuthContext,
  );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}