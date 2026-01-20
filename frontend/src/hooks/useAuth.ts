"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string;
}

export interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Hook para verificar autenticação e carregar dados do usuário
 * Reutilizável em toda a aplicação
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include", // Sempre incluir cookies
        });

        if (!response.ok) {
          if (isMounted) {
            setUser(null);
            // Redirecionar apenas se não for página pública
            if (!isPublicPage()) {
              router.push("/auth/sign-in");
            }
          }
          return;
        }

        const { user: userData } = await response.json();
        if (isMounted && userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        if (isMounted) {
          setUser(null);
          if (!isPublicPage()) {
            router.push("/auth/sign-in");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}

/**
 * Verifica se a página atual é pública
 */
function isPublicPage(): boolean {
  if (typeof window === "undefined") return false;
  const publicRoutes = ["/auth/sign-in", "/auth/sign-up", "/"];
  return publicRoutes.some((route) => window.location.pathname.startsWith(route));
}
