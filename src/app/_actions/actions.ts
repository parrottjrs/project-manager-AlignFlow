"use server";
import { redirect } from "next/navigation";
import { cookieBasedClient } from "@/src/utils/amplify-utils";
import { revalidatePath } from "next/cache";
import { error } from "console";

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
      incompleteTaskCount: 0,
    });
  if (!errors) {
    console.log("Created project:", project);
  } else {
    console.log("Error creating project:", errors);
  }
  redirect("/");
}

type CountType = "taskCount" | "incompleteTaskCount";
type Operation = "add" | "subtract";

async function updateTaskCount(
  projectId: string,
  countType: CountType,
  operation: Operation
) {
  if (!projectId) return;

  const { data: currentProject } = await cookieBasedClient.models.Project.get(
    {
      id: projectId,
    },
    {
      selectionSet: [`${countType}`],
      authMode: "userPool",
    }
  );

  const taskCount = currentProject?.[countType];

  if (
    taskCount === null ||
    taskCount === undefined ||
    (taskCount === 0 && operation === "subtract") //don't want negative values!
  ) {
    console.log(`Cannot update ${countType} for project ${projectId}`);
    return;
  }

  const newCount = operation === "add" ? taskCount + 1 : taskCount - 1; //No real need to use if/else if since operation has a strict type

  const project =
    //Same as above: countType has a strict type
    countType === "taskCount"
      ? { id: projectId, taskCount: newCount }
      : { id: projectId, incompleteTaskCount: newCount };

  const { data: updatedProject, errors } =
    await cookieBasedClient.models.Project.update(project);

  if (!errors) {
    console.log(`Updated project:`, updatedProject);
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
  projectId: string
) {
  if (description.trim().length === 0) return;

  const { data: task, errors } = await cookieBasedClient.models.Task.create({
    title,
    description,
    priority,
    status: "to do",
    dueDate,
    projectId: projectId,
  });

  await updateTaskCount(projectId, "taskCount", "add");
  await updateTaskCount(projectId, "incompleteTaskCount", "add");

  if (!errors) {
    console.log("Created task:", task);
  } else {
    console.log("Error creating task:", errors);
  }
  revalidatePath(`/project/${projectId}`);
}

export async function deleteTask(formData: FormData, projectId: string) {
  const id = formData.get("id")?.toString();
  if (!id) return;

  const { data: deletedTask, errors } =
    await cookieBasedClient.models.Task.delete({
      id,
    });

  if (deletedTask?.status !== "completed") {
    await updateTaskCount(projectId, "incompleteTaskCount", "subtract");
  }

  await updateTaskCount(projectId, "taskCount", "subtract");

  if (!errors) {
    console.log("Deleted task:", deletedTask);
  } else {
    console.log("Error deleting task:", errors);
  }
}

async function checkTaskStatus(taskId: string) {
  const { data: task } = await cookieBasedClient.models.Task.get(
    {
      id: taskId,
    },
    {
      selectionSet: ["status"],
      authMode: "userPool",
    }
  );
  if (task?.status) {
    return task?.status;
  } else {
    console.log(`Error retrieving status for task ${taskId}:`, error);
  }
}

export async function updateTask(
  taskId: string,
  title: string,
  description: string,
  priority: string,
  status: string,
  dueDate: string,
  projectId: string
) {
  if (!taskId) return;

  const task = {
    id: taskId,
    title: title,
    description: description,
    priority: priority,
    status: status,
    dueDate: dueDate,
  };

  const currentTaskStatus = await checkTaskStatus(taskId); //check to see if task's status is staying the same

  if (status !== currentTaskStatus) {
    //conditionally update amount of incomplete tasks on project
    switch (status) {
      case "completed":
        await updateTaskCount(projectId, "incompleteTaskCount", "subtract");
        break;
      case "in progress":
      case "to do":
        if (currentTaskStatus === "completed")
          await updateTaskCount(projectId, "incompleteTaskCount", "add");
        break;
      default:
        console.error("Error updating task status. Try again later.");
        break;
    }
  }

  const { data: updatedTask, errors } =
    await cookieBasedClient.models.Task.update(task);

  if (!errors) {
    console.log("Task updated:", updatedTask);
  } else {
    console.log("Error updating task:", errors);
  }

  revalidatePath(`/project/${projectId}`);
}
