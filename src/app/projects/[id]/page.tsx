import { cookieBasedClient, isAuthenticated } from "@/src/utils/amplify-utils";
import { revalidatePath } from "next/cache";
import { addTask, deleteTask } from "@/src/app/_actions/actions";

import React from "react";
import { Schema } from "../../../../amplify/data/resource";
import AddTask from "@/src/components/AddTask";

export default async function Projects({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const isSignedIn = await isAuthenticated();
  const { data: project } = await cookieBasedClient.models.Project.get(
    {
      id: params.id,
    },
    {
      selectionSet: ["id", "title"],
      authMode: "userPool",
    }
  );
  console.log("project", project);

  const { data: allTasks } = await cookieBasedClient.models.Task.list({
    selectionSet: [
      "title",
      "description",
      "dueDate",
      "priority",
      "status",
      "project.id",
      "id",
    ],
    authMode: "userPool",
  });

  const tasks = allTasks.filter((task) => task.project?.id === params.id);

  if (!project) return null;

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h1 className="text-2xl font-bold">Project Information:</h1>
      <div className="border rounded w-1/2 m-auto bg-gray-200 p-4 ">
        <h2>Title: {project.title}</h2>
      </div>

      {isSignedIn && (
        <AddTask
          addTask={addTask}
          paramsId={params.id}
          project={project as Schema["Project"]["type"]}
        />
      )}

      <h1 className="text-xl font-bold">Tasks:</h1>
      {tasks.map((task, idx) => (
        <div key={idx}>
          <div className="flex flex-row gap-4 w-96 p-2 rounded border bg-yellow-100 flex justify-between">
            <div>{task.title}</div>
            <div>{task.description}</div>
            <div>{task.status}</div>
            <div>{task.priority}</div>
            <div>{task.dueDate}</div>
            <form
              action={async (formData) => {
                "use server";
                await deleteTask(formData);
                revalidatePath(`/projects/${params.id}`);
              }}
            >
              <input type="hidden" name="id" id="id" value={task.id} />
              {isSignedIn && (
                <button type="submit" className="text-red-950">
                  X
                </button>
              )}
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
