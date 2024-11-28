import React from "react";
import { deleteTask } from "../app/_actions/actions";
import { revalidatePath } from "next/cache";
import DeleteIcon from "@mui/icons-material/Delete";

export default async function DeleteTask({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) {
  return (
    <form
      action={async (formData) => {
        "use server";
        await deleteTask(formData);
        revalidatePath(`/projects/${projectId}`);
      }}
    >
      <input type="hidden" name="id" id="id" value={taskId} />
      <button type="submit">
        <DeleteIcon />
      </button>
    </form>
  );
}
