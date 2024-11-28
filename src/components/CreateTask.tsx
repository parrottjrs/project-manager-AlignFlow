"use client";
import { Schema } from "@/amplify/data/resource";
import React, { useState, useTransition } from "react";

export default function CreateTask({
  addTask,
  project,
  paramsId,
}: {
  addTask: (
    title: string,
    description: string,
    dueDate: string,
    priority: string,
    project: Schema["Project"]["type"],
    paramsId: string
  ) => void;
  project: Schema["Project"]["type"];
  paramsId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [description, setDescription] = useState("");

  const add = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      setTitle("");
      setDescription("");
      setSelectedDate("");
      setPriority("low");
      addTask(title, description, priority, selectedDate, project, paramsId);
    });
  };

  return (
    <form onSubmit={add} className="p-4 flex flex-row gap-8">
      <div className="flex flex-col items-start gap-2">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="add title"
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
          placeholder="add description"
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
          Add task
        </button>
      </div>
    </form>
  );
}
