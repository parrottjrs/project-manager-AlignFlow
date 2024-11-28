import { redirect } from "next/navigation";
import Project from "../components/Project";
import { cookieBasedClient, isAuthenticated } from "../utils/amplify-utils";
import { onDeleteProject } from "./_actions/actions";

export default async function Home() {
  const { data: projects } = await cookieBasedClient.models.Project.list({
    selectionSet: ["id", "title"],
    authMode: "apiKey",
  });

  return (
    <main className="flex flex-col items-center justify-between p-24 w-1/2 m-auto">
      <h1 className="text-2xl pb-10">List of all projects</h1>
      {projects?.map(async (project, idx) => (
        <Project
          key={idx}
          project={project}
          onDelete={onDeleteProject}
          isSignedIn={await isAuthenticated()}
        />
      ))}
    </main>
  );
}
