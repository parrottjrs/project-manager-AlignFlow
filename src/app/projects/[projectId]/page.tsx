import { cookieBasedClient, isAuthenticated } from "@/src/utils/amplify-utils";
import { revalidatePath } from "next/cache";
import { deleteTask } from "@/src/app/_actions/actions";
import React from "react";
import { Edit } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import SortTasks from "@/src/components/SortTasks";
import { redirect } from "next/navigation";

export default async function Projects({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: { sort: string; filter: string };
}) {
  const isSignedIn = await isAuthenticated();
  if (!isSignedIn) redirect("/signin");
  if (!params.projectId) return null;

  const sortDirection = searchParams.sort === "DESC" ? "DESC" : "ASC"; //had to define explicitly - graphQL sortDirection throws type error with string
  //@ts-ignore
  const filter: any = {}; //couldn't figure out how to type this...

  if (searchParams.filter && searchParams.filter !== "all") {
    filter.status = { eq: searchParams.filter };
  }

  const { data: project } = await cookieBasedClient.models.Project.get(
    {
      id: params.projectId,
    },
    {
      selectionSet: ["id", "title", "taskCount", "tasks.id"],
      authMode: "userPool",
    }
  );

  const { data: sortedTasks } =
    await cookieBasedClient.models.Task.listByStatus(
      { projectId: params.projectId },
      {
        sortDirection: sortDirection,
        filter: Object.keys(filter).length > 0 ? filter : null,
      }
    );

  const handleDelete = async (formData: FormData) => {
    "use server";
    if (!project) return;
    await deleteTask(formData, params.projectId);
    revalidatePath(`/projects/${params.projectId}`);
  };

  if (!project) return null;

  return (
    <div className="flex flex-col items-items-start w-3/4 p-4 gap-4 m-auto">
      <h1 className="text-2xl font-bold">Tasks for {project.title}</h1>
      <Link
        className={"w-32"}
        href={`/projects/${params.projectId}/tasks/create`}
      >
        <button className="text-white bg-teal-600 rounded px-4 py-2 h-10 w-full">
          Add Task
        </button>
      </Link>
      <SortTasks />

      <table>
        <thead>
          <tr className="flex flex-row w-full p-4 rounded border bg-slate-100 flex items-center gap-4">
            <th className="w-1/6 text-left">Name</th>
            <th className="w-1/6 text-left">Status</th>
            <th className="w-1/6 text-left">Priority</th>
            <th className="w-1/6 text-left">Due Date</th>
            <th className="w-1/6 text-left">Description</th>
            <th className="w-1/6 text-left">Options</th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task, idx) => (
            <tr
              key={idx}
              className="flex flex-row w-full p-4 rounded border bg-slate-100 flex items-center gap-4"
            >
              <td className="w-1/6 text-left">{task.title}</td>
              <td className="w-1/6 text-left">{task.status}</td>
              <td className="w-1/6 text-left">{task.priority}</td>
              <td className="w-1/6 text-left">{task.dueDate}</td>
              <td className="w-1/6 text-left">{task.description}</td>

              <td className="w-1/6 flex flex-row items-center text-left gap-4">
                <Link
                  href={`/projects/${params.projectId}/tasks/${task.id}/edit`}
                >
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
