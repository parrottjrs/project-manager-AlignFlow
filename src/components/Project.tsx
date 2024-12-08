"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Schema } from "../../amplify/data/resource";
import { Delete } from "@mui/icons-material";
import { Button } from "@aws-amplify/ui-react";
export default function Project({
  project,
  onDelete,
  isSignedIn,
}: {
  project: Pick<
    Schema["Project"]["type"],
    "title" | "id" | "taskCount" | "incompleteTaskCount"
  >;
  onDelete: (id: string) => void;
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const projectStatus =
    project.incompleteTaskCount === 0 && project.taskCount > 0
      ? "Complete"
      : "In progress";

  const onDetail = () => {
    router.push(`projects/${project.id}`);
  };

  console.log(project);
  return (
    <tr className="flex flex-row w-3/4 p-4 rounded border bg-slate-100 flex items-center ">
      <td className="w-1/4 text-left">{project.title}</td>
      <td className="w-1/4 text-left">{project.taskCount}</td>
      <td className="w-1/4 text-left">{projectStatus}</td>
      <td className="flex flex-row gap-4 w-1/4 text-left">
        <input type="hidden" name="id" id="id" value={project.id} />
        <Button
          variation="primary"
          borderRadius="2rem"
          className="mr-4"
          onClick={onDetail}
        >
          See tasks
        </Button>
        {isSignedIn && (
          <button
            className="text-red-500 cursor-pointer"
            onClick={() => onDelete(project.id)}
          >
            <Delete />
          </button>
        )}
      </td>
    </tr>
  );
}
