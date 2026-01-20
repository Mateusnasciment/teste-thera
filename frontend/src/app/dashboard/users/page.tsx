import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const metadata = {
  title: "Usuários - T3 App",
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Usuários</h1>
          <p className="text-gray-600 mt-2">Gerenciar usuários da aplicação</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Funcionalidade de gerenciamento de usuários em desenvolvimento</p>
          </CardContent>
        </Card>
      </div>
  );
}
