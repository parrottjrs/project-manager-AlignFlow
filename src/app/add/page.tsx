"use client";

import React, { useState, useTransition } from "react";
import { createProject } from "../_actions/actions";

export default function AddProject() {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");

  const create = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      createProject(title);
    });
  };

  return (
    <div>
      <form onSubmit={create} className="p-4 flex flex-col items-center gap-4">
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
        />
        <button
          type="submit"
          className="text-white bg-teal-300 rounded p-4"
          disabled={isPending}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
