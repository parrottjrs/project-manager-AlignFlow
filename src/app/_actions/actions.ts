"use server";
import { data } from "./../../../amplify/data/resource";
import { redirect } from "next/navigation";
import { cookieBasedClient } from "@/src/utils/amplify-utils";
import { revalidatePath } from "next/cache";
import { Schema } from "@/amplify/data/resource";

export async function onDeleteProject(id: string) {
  const { data: deletedProject, errors } =
    await cookieBasedClient.models.Project.delete({
      id,
    });
  console.log("Deleted project:", deletedProject);
  console.log("Errors:", errors);
  revalidatePath("/");
}

export async function createProject(title: string) {
  const { data: project, errors } =
    await cookieBasedClient.models.Project.create({
      title: title,
      taskCount: 0,
    });
  console.log("Created project:", project);
  console.log("errors:", errors);
  redirect("/");
}

export async function updateTaskCount(projectId: string, operation: string) {
  const { data: currentProject } = await cookieBasedClient.models.Project.get(
    {
      id: projectId,
    },
    {
      selectionSet: ["taskCount"],
      authMode: "userPool",
    }
  );

  console.log("Updating count...");
  const taskCount = currentProject?.taskCount;
  if (taskCount === null || taskCount === undefined) return;
  console.log("Count during update:", taskCount);
  const newCount = operation === "add" ? taskCount + 1 : taskCount - 1;
  console.log("New count:", newCount);
  const project = { id: projectId, taskCount: newCount };
  const { data: updatedProject, errors } =
    await cookieBasedClient.models.Project.update(project);

  console.log(`New task count for project ${projectId}:`, newCount);
  console.log(`Error updating task count for project ${projectId}:`, errors);
  revalidatePath("/");
}

export async function createTask(
  title: string,
  description: string,
  priority: string,
  dueDate: string,
  paramsId: string
) {
  if (description.trim().length === 0) return;
  const { data: task, errors } = await cookieBasedClient.models.Task.create({
    title,
    description,
    priority,
    status: "to do",
    dueDate,
    projectId: paramsId,
  });
  await updateTaskCount(paramsId, "add");
  console.log("Created task", task);
  console.log("Error creating task:", errors);
  revalidatePath(`/project/${paramsId}`);
}

export async function deleteTask(
  formData: FormData,
  count: number,
  projectId: string
) {
  const id = formData.get("id")?.toString();
  if (!id) return;
  const { data: deletedTask, errors } =
    await cookieBasedClient.models.Task.delete({
      id,
    });
  updateTaskCount(projectId, "subtract");

  console.log("Deleted task:", deletedTask);
  console.log("Errors:", errors);
}

export async function updateTask(
  id: string,
  title: string,
  description: string,
  priority: string,
  status: string,
  dueDate: string,
  paramsId: string
) {
  if (!id) return;

  const task = {
    id: id,
    title: title,
    description: description,
    priority: priority,
    status: status,
    dueDate: dueDate,
  };

  const { data: updatedTask, errors } =
    await cookieBasedClient.models.Task.update(task);

  console.log("Task updated:", updatedTask);
  console.log("Error updating task:", errors);
  revalidatePath(`/project/${paramsId}`);
}
