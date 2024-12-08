import React from "react";
import Project from "../components/Project";
import { cookieBasedClient, isAuthenticated } from "../utils/amplify-utils";
import { onDeleteProject } from "./_actions/actions";
import CreateProject from "../components/CreateProject";

export default async function Home() {
  const isSignedIn = await isAuthenticated();
  const { data: projects } = await cookieBasedClient.models.Project.list({
    selectionSet: ["id", "title", "taskCount", "incompleteTaskCount"],
    authMode: "userPool",
  });

  return (
    <main className="flex flex-col items-items-start w-3/4 p-4 gap-4 m-auto">
      <h1 className="text-2xl pb-10">Projects</h1>
      <CreateProject />
      <table>
        <thead>
          <tr className="flex flex-row w-3/4 p-4 rounded border bg-slate-100 flex items-center">
            <th className="w-1/4 text-left">Project Name</th>
            <th className="w-1/4 text-left">Number of Tasks</th>
            <th className="w-1/4 text-left">Project Status</th>
            <th className="w-1/4 text-left">Options</th>
          </tr>
        </thead>
        <tbody>
          {projects?.map(async (project, idx) => (
            <Project
              key={idx}
              project={project}
              onDelete={onDeleteProject}
              isSignedIn={isSignedIn}
            />
          ))}
        </tbody>
      </table>
    </main>
  );
}
