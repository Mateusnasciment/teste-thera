"use client";

import { LogOut, Home, ListTodo, Users, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";

interface SidebarProps {
  userEmail?: string;
}

export function Sidebar({ userEmail }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push("/auth/sign-in");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex h-screen flex-col gap-4 bg-slate-900 text-white p-6 w-64">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">T3 App</h1>
        {userEmail && <p className="text-xs text-slate-400">{userEmail}</p>}
      </div>

      <nav className="flex-1 space-y-2">
        <Link href="/dashboard">
          <Button
            variant={isActive("/dashboard") ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        <Link href="/dashboard/tasks">
          <Button
            variant={isActive("/dashboard/tasks") ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <ListTodo className="mr-2 h-4 w-4" />
            Tasks
          </Button>
        </Link>

        <Link href="/dashboard/users">
          <Button
            variant={isActive("/dashboard/users") ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Users className="mr-2 h-4 w-4" />
            Usuários
          </Button>
        </Link>

        <Link href="/dashboard/products">
          <Button
            variant={isActive("/dashboard/products") ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Produtos
          </Button>
        </Link>
      </nav>

      <Button
        variant="destructive"
        className="w-full justify-start"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
