import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export const metadata = {
  title: "Dashboard - T3 App",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bem-vindo ao T3 App</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">Atualize a página para ver</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">Atualize a página para ver</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">Atualize a página para ver</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sobre esta aplicação</CardTitle>
            <CardDescription>Stack: T3 + Next.js + tRPC + Drizzle + Better Auth</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Este é um exemplo de aplicação full stack moderna com:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Next.js 14 com App Router</li>
              <li>tRPC para chamadas seguras e tipadas</li>
              <li>Drizzle ORM para gerenciamento de banco de dados</li>
              <li>Better Auth para autenticação</li>
              <li>Tailwind CSS + shadcn/ui para interface</li>
              <li>Zod para validação de dados</li>
            </ul>
          </CardContent>
        </Card>
      </div>
  );
}
