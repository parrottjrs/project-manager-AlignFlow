import React from "react";
import Project from "../components/Project";
import { cookieBasedClient, isAuthenticated } from "../utils/amplify-utils";
import { onDeleteProject } from "./_actions/actions";
import CreateProject from "../components/CreateProject";

export default async function Home() {
  const { data: projects } = await cookieBasedClient.models.Project.list({
    selectionSet: ["id", "title", "taskCount", "status"],
    authMode: "userPool",
  });

  return (
    <main className="flex flex-col items-center justify-between p-24 w-1/2 m-auto gap-4">
      <h1 className="text-2xl pb-10">List of all projects</h1>
      <CreateProject />
      <div className="w-full">
        {projects?.map(async (project, idx) => (
          <Project
            key={idx}
            project={project}
            onDelete={onDeleteProject}
            isSignedIn={await isAuthenticated()}
          />
        ))}
      </div>
    </main>
  );
}
