"use server";
import React from "react";
import { cookieBasedClient, isAuthenticated } from "@/src/utils/amplify-utils";
import UpdateTask from "@/src/components/UpdateTask";
import { redirect } from "next/navigation";

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
  const isSignedIn = await isAuthenticated();
  if (!isSignedIn) redirect("/signin");
  if (!params.projectId || !params.taskId) return null;

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

  if (!task || !isSignedIn) return null;
  const typedTask: Task = task;

  return <UpdateTask params={params} task={typedTask} />;
}
