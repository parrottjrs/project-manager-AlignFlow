import { cookieBasedClient, isAuthenticated } from "@/src/utils/amplify-utils";
import { revalidatePath } from "next/cache";
import { deleteTask } from "@/src/app/_actions/actions";
import React from "react";
import { Edit } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import SortTasks from "@/src/components/SortTasks";

export default async function Projects({
  params,
  searchParams,
}: {
  params: { projectId: string };
  searchParams: { sort: string; filter: string };
}) {
  if (!params.projectId) return null;
  const isSignedIn = await isAuthenticated();
  const sortDirection = searchParams.sort === "DESC" ? "DESC" : "ASC"; //had to define explicitly - graphQL sortDirection throws type error with string
  const filter: any = {};
  if (searchParams.filter && searchParams.filter !== "all") {
    filter.status = { eq: searchParams.filter };
  }

  const { data: project } = await cookieBasedClient.models.Project.get(
    {
      id: params.projectId,
    },
    {
      selectionSet: ["id", "title"],
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
    await deleteTask(formData);
    revalidatePath(`/projects/${params.projectId}`);
  };

  if (!project) return null;
  console.log(sortedTasks);

  return (
    <div className="flex flex-col items-items-start w-3/4 p-4 gap-4 m-auto">
      <h1 className="text-2xl font-bold">{project.title}</h1>
      <Link
        className={"w-32"}
        href={`/projects/${params.projectId}/tasks/create`}
      >
        <button className="text-white bg-teal-600 rounded px-4 py-2 h-10 w-full">
          Add Task
        </button>
      </Link>
      <SortTasks />
      <div className={"flex flex-col"}>
        {sortedTasks.map((task, idx) => (
          <div
            key={idx}
            className="flex flex-row  w-1/2 p-4 rounded border bg-slate-100 flex justify-between"
          >
            <>
              <div>{task.title}</div>
              <div>{task.description}</div>
              <div>{task.status}</div>
              <div>{task.priority}</div>
              <div>{task.dueDate}</div>
            </>
            <div className="flex flex-ro items-center gap-4">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
