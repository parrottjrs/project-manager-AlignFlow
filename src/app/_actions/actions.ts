"use server";
import { redirect } from "next/navigation";
import { cookieBasedClient } from "@/src/utils/amplify-utils";
import { revalidatePath } from "next/cache";

export async function onDeleteProject(id: string) {
  const { data: deletedProject, errors } =
    await cookieBasedClient.models.Project.delete({
      id,
    });

  if (!errors) {
    console.log("Deleted project:", deletedProject);
  } else {
    console.log("Error deleting project:", errors);
  }
  revalidatePath("/");
}

export async function createProject(title: string) {
  const { data: project, errors } =
    await cookieBasedClient.models.Project.create({
      title: title,
      taskCount: 0,
      status: "In progress",
    });

  if (!errors) {
    console.log("Created project:", project);
  } else {
    console.log("Error creating project:", errors);
  }
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

  const taskCount = currentProject?.taskCount;
  if (taskCount === null || taskCount === undefined) return;
  const newCount = operation === "add" ? taskCount + 1 : taskCount - 1;
  const project = { id: projectId, taskCount: newCount };
  const { data: updatedProject, errors } =
    await cookieBasedClient.models.Project.update(project);

  if (!errors) {
    console.log(`New task count for project ${projectId}:`, newCount);
  } else {
    console.log(`Error updating task count for project ${projectId}:`, errors);
  }
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
  if (!errors) {
    console.log("Created task", task);
  } else {
    console.log("Error creating task:", errors);
  }
  revalidatePath(`/project/${paramsId}`);
}

export async function deleteTask(formData: FormData, projectId: string) {
  const id = formData.get("id")?.toString();
  if (!id) return;
  const { data: deletedTask, errors } =
    await cookieBasedClient.models.Task.delete({
      id,
    });
  updateTaskCount(projectId, "subtract");

  if (!errors) {
    console.log("Deleted task:", deletedTask);
  } else {
    console.log("Error deleting task:", errors);
  }
}

async function updateProjectStatus(id: string, updatedStatus: string) {
  if (!id) return;

  const { data: updatedProject, errors } =
    await cookieBasedClient.models.Project.update({
      id: id,
      status: updatedStatus,
    });

  if (!errors) {
    console.log("Project status updated:", updatedProject);
  } else {
    console.log("Error updating project status:", errors);
  }
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

  if (task.status === "completed") {
    const { data: tasks } = await cookieBasedClient.models.Task.listByStatus({
      projectId: paramsId,
    });
    const result = tasks.some(
      (task) => task.id !== id && task.status !== "completed"
    )
      ? "in progress"
      : "completed";
    if (result === "completed")
      await updateProjectStatus(paramsId, "completed");
  }

  const { data: updatedTask, errors } =
    await cookieBasedClient.models.Task.update(task);

  if (!errors) {
    console.log("Task updated:", updatedTask);
  } else {
    console.log("Error updating task:", errors);
  }

  revalidatePath(`/project/${paramsId}`);
}
