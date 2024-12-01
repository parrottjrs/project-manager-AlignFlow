"use client";

import React, { useEffect, useState, useTransition } from "react";
import { updateTask } from "@/src/app/_actions/actions";
import { useRouter } from "next/navigation";

interface Task {
  title: string;
  id: string;
  description: string | null;
  priority: string | null;
  status: string | null;
  dueDate: string | null;
}

export default function UpdateTask({
  params,
  task,
}: {
  params: { projectId: string; taskId: string };
  task: Task;
}) {
  if (!params.projectId || !params.taskId) return null;

  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority || "low");
  const [selectedDate, setSelectedDate] = useState(task.dueDate || "");
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "to do");
  const router = useRouter();
  const update = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      updateTask(
        params.taskId,
        title,
        description,
        priority,
        status,
        selectedDate,
        params.projectId
      );
      router.push(`/projects/${params.projectId}`);
    });
  };

  useEffect(() => {
    console.log(typeof selectedDate);
  }, [selectedDate]);
  return (
    <form onSubmit={update} className="p-4 flex flex-row gap-8">
      <div className="flex flex-col items-start gap-2">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="update title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
          required
        />
      </div>
      <div className="flex flex-col items-start gap-2">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          placeholder="update description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
        />
      </div>

      <div className="flex flex-col items-start gap-2">
        <label htmlFor="priority">Priority</label>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm">Low</span>
            <input
              type="radio"
              name="priority"
              id="priority"
              value="low"
              checked={priority === "low"}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm">Medium</span>
            <input
              type="radio"
              name="priority"
              id="priority"
              value="medium"
              checked={priority === "medium"}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm">High</span>
            <input
              type="radio"
              name="priority"
              id="priority"
              value="high"
              checked={priority === "high"}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <label htmlFor="status">Status</label>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm">To-do</span>
            <input
              type="radio"
              name="status"
              id="status"
              value="to do"
              checked={status === "to do"}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm">In progress</span>
            <input
              type="radio"
              name="status"
              id="status"
              value="in progress"
              checked={status === "in progress"}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm">Completed</span>
            <input
              type="radio"
              name="status"
              id="status"
              value="completed"
              checked={status === "completed"}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <label htmlFor="dueDate">Due date</label>
        <input
          type="date"
          name="dueDate"
          id="dueDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <div className="flex items-center">
        <button
          type="submit"
          className="text-white bg-teal-600 rounded px-4 py-2 h-10"
          disabled={isPending}
        >
          Update task
        </button>
      </div>
    </form>
  );
}
