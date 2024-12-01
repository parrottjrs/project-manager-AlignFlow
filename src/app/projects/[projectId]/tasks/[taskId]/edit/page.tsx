"use server";

import React from "react";
import { cookieBasedClient, isAuthenticated } from "@/src/utils/amplify-utils";
import UpdateTask from "@/src/components/UpdateTask";
interface Task {
  title: string;
  id: string;
  description: string | null;
  priority: string | null;
  status: string | null;
  dueDate: string | null;
}

export default async function UpdateTaskPage({
  params,
}: {
  params: { projectId: string; taskId: string };
}) {
  if (!params.projectId || !params.taskId) return null;

  const isSignedIn = await isAuthenticated();

  const { data: task } = await cookieBasedClient.models.Task.get(
    {
      id: params.taskId,
    },
    {
      selectionSet: [
        "id",
        "title",
        "description",
        "dueDate",
        "priority",
        "status",
      ],
      authMode: "userPool",
    }
  );
  if (!task) return null;
  const typedTask: Task = task;
  return <UpdateTask params={params} task={typedTask} />;
}
