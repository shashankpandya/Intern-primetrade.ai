import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/useAuth";
import { api } from "../lib/api";
import { getErrorMessage } from "../lib/errors";
import type { Task } from "../types";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to load tasks"));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTasks();
  }, []);

  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await api.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      setMessage("Task added");
      await loadTasks();
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to create task"));
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      await api.patch(`/tasks/${task.id}`, { completed: !task.completed });
      await loadTasks();
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to update task"));
    }
  };

  const deleteTask = async (task: Task) => {
    try {
      await api.delete(`/tasks/${task.id}`);
      await loadTasks();
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to delete task"));
    }
  };

  return (
    <section className="dashboard">
      <header>
        <h1>Dashboard</h1>
        <div>
          <span>
            {user?.name} ({user?.role})
          </span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <form className="task-form" onSubmit={addTask}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button type="submit">Add Task</button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <div>
              <strong>{task.title}</strong>
              <p>{task.description}</p>
            </div>
            <div>
              <button onClick={() => toggleTask(task)}>
                {task.completed ? "Mark open" : "Mark done"}
              </button>
              <button onClick={() => deleteTask(task)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DashboardPage;
