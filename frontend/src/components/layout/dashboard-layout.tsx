"use client";

import type { ReactNode } from "react";
import { Sidebar } from "~/components/layout/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) {
          router.push("/auth/sign-in");
          return;
        }
        const session = await response.json();
        if (session?.user) {
          setUser(session.user);
        } else {
          router.push("/auth/sign-in");
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        router.push("/auth/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar userEmail={user.email} />
      <div className="flex-1 overflow-auto bg-slate-50">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
