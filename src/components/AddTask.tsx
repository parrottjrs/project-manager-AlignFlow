"use client";
import React, { useState, useTransition } from "react";
import { Schema } from "../../amplify/data/resource";

export default function AddTask({
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
    <form onSubmit={add} className="p-4 flex flex-col items-center gap-4">
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
      <input
        type="text"
        name="description"
        id="description"
        placeholder="add description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
      />
      <label>
        <input
          type="radio"
          name="priority"
          id="priority"
          value="low"
          checked={priority === "low"}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
        />
        low
      </label>
      <label>
        <input
          type="radio"
          name="priority"
          id="priority"
          value="medium"
          checked={priority === "medium"}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
        />
        medium
      </label>
      <label>
        <input
          type="radio"
          name="priority"
          id="priority"
          value="high"
          checked={priority === "high"}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
        />
        high
      </label>
      <input
        type="date"
        name="dueDate"
        id="dueDate"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <button
        type="submit"
        className="text-white bg-teal-600 rounded p-4"
        disabled={isPending}
      >
        Submit
      </button>
    </form>
  );
}
