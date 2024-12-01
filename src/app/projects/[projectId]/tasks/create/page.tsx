"use client";
import { Schema } from "@/amplify/data/resource";
import { addTask } from "@/src/app/_actions/actions";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";

export default function CreateTask({
  params,
}: {
  params: { projectId: string };
}) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  if (!params.projectId) {
    router.push("/");
  }

  const add = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      addTask(title, description, priority, selectedDate, params.projectId);
    });
    router.push(`/projects/${params.projectId}`);
  };

  return (
    <form
      onSubmit={add}
      className="border bg-gray-100 w-1/2 p-4 rounded flex flex-col justify-between m-auto"
    >
      <div className="border-b flex flex-row justify-items-start items-center  pb-4 gap-2">
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
      <div className="border-b flex flex-row justify-items-start items-center  py-4 gap-2">
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

      <div className="border-b flex flex-row justify-items-start items-center  py-4 gap-6">
        <label htmlFor="priority">Priority</label>
        <div className="flex flex-row gap-6">
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
          <div className="border-b flex flex-row justify-items-start items-center  py-4 gap-2">
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
          <div className="border-b flex flex-row justify-items-start items-center  py-4 gap-2">
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
      <div className="border-b flex flex-row justify-items-start items-center  py-4 gap-2">
        <label htmlFor="dueDate">Due date</label>
        <input
          type="date"
          name="dueDate"
          id="dueDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      <div className="flex items-center pt-4">
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
