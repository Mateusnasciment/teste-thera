import { TasksList } from "~/components/tasks/tasks-list";

export const metadata = {
  title: "Tasks - T3 App",
};

export default function TasksPage() {
  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Tasks</h1>
          <p className="text-gray-600 mt-2">Gerenciar suas tarefas</p>
        </div>
      <TasksList />
    </div>
  );
}
