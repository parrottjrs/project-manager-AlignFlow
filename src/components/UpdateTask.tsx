"use client";
import React, { useState, useTransition } from "react";
import { Schema } from "../../amplify/data/resource";
import { Task } from "@mui/icons-material";
import { updateTask } from "../app/_actions/actions";

export default function UpdateTask({
  task,
  paramsId,
}: {
  task: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
  };

  paramsId: string;
}) {
  const id = task.id;
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [selectedDate, setSelectedDate] = useState(task.dueDate);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);

  const update = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = task.id;
    startTransition(async () => {
      updateTask(
        id,
        title,
        description,
        selectedDate,
        priority,
        status,
        paramsId
      );
    });
  };

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
