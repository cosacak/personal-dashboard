"use client";

import { useEffect, useState } from "react";
import type { Todo } from "@/types";

export function TodoWidget() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/todos")
      .then((r) => r.json())
      .then((data) => setTodos(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    if (!input.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input.trim() }),
    });
    const todo = await res.json();
    setTodos((prev) => [todo, ...prev]);
    setInput("");
  }

  async function handleToggle(id: string, completed: boolean) {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
    );
  }

  async function handleDelete(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const pending = todos.filter((t) => !t.completed);
  const done = todos.filter((t) => t.completed);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Tasks</h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
          {pending.length} pending
        </span>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a task..."
          className="flex-1 text-sm text-gray-900 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {loading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        )}

        {!loading && todos.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            No tasks yet. Add one above!
          </p>
        )}

        {pending.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}

        {done.length > 0 && (
          <>
            <p className="text-xs text-gray-400 font-medium pt-2 pb-1">
              Completed ({done.length})
            </p>
            {done.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 group py-1.5 px-2 rounded-lg hover:bg-gray-50">
      <button
        onClick={() => onToggle(todo.id, todo.completed)}
        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
          todo.completed
            ? "bg-green-500 border-green-500"
            : "border-gray-300 hover:border-blue-400"
        }`}
      />
      <span
        className={`flex-1 text-sm ${
          todo.completed ? "line-through text-gray-400" : "text-gray-700"
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}
