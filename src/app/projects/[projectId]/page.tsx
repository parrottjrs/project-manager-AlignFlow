import { cookieBasedClient, isAuthenticated } from "@/src/utils/amplify-utils";
import { revalidatePath } from "next/cache";
import { deleteTask } from "@/src/app/_actions/actions";
import React, { startTransition } from "react";
import { Schema } from "../../../../amplify/data/resource";
import { Edit } from "@mui/icons-material";
import { redirect } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

export default async function Projects({
  params,
}: {
  params: { projectId: string };
}) {
  if (!params.projectId) return null;

  const isSignedIn = await isAuthenticated();

  const { data: project } = await cookieBasedClient.models.Project.get(
    {
      id: params.projectId,
    },
    {
      selectionSet: ["id", "title"],
      authMode: "userPool",
    }
  );

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

  const tasks = allTasks.filter(
    (task) => task.project?.id === params.projectId
  );

  const handleDelete = async (formData: FormData) => {
    "use server";

    await deleteTask(formData);

    revalidatePath(`/projects/${params.projectId}`);
  };

  if (!project) return null;

  return (
    <div className="flex flex-col items-items-start w-3/4 p-4 gap-4 m-auto">
      <h1 className="text-2xl font-bold">{project.title}</h1>
      <Link href={`/projects/${params.projectId}/tasks/create`}>
        <button className="text-white bg-teal-600 rounded px-4 py-2 h-10">
          Add Task
        </button>
      </Link>
      {tasks.map((task, idx) => (
        <div
          key={idx}
          className="flex flex-row gap-4 w-1/2 p-4 rounded border bg-slate-100 flex justify-between"
        >
          <>
            <div>{task.title}</div>
            <div>{task.description}</div>
            <div>{task.status}</div>
            <div>{task.priority}</div>
            <div>{task.dueDate}</div>
          </>
          <div className="flex flex-ro items-center gap-4">
            <Link href={`/projects/${params.projectId}/tasks/${task.id}/edit`}>
              <Edit />
            </Link>

            <form action={handleDelete}>
              <input type="hidden" name="id" id="id" value={task.id} />
              {isSignedIn && (
                <button type="submit">
                  <DeleteIcon />
                </button>
              )}
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
