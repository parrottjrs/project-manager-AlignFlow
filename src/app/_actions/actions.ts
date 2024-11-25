"use server";
import { redirect } from "next/navigation";
import { cookieBasedClient } from "@/src/utils/amplify-utils";
import { revalidatePath } from "next/cache";
import { Schema } from "@/amplify/data/resource";

export async function onDeletePost(id: string) {
  const { data: deletedPost, errors } =
    await cookieBasedClient.models.Post.delete({
      id,
    });
  console.log("Deleted post:", deletedPost);
  console.log("Errors:", errors);
  revalidatePath("/");
}

export async function createPost(title: string) {
  const { data: post, errors } = await cookieBasedClient.models.Post.create({
    title: title,
  });
  console.log("Created post:", post);
  console.log("errors:", errors);
  redirect("/");
}

export async function addComment(
  content: string,
  post: Schema["Post"]["type"],
  paramsId: string
) {
  if (content.trim().length === 0) return;
  const { data: comment, errors } =
    await cookieBasedClient.models.Comment.create({
      postId: post.id,
      content,
    });
  console.log("Created comment", comment);
  console.log("Errors:", errors);
  revalidatePath(`/post/${paramsId}`);
}

export async function deleteComment(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) return;
  const { data: deletedComment, errors } =
    await cookieBasedClient.models.Comment.delete({
      id,
    });
  console.log("Deleted comment:", deletedComment);
  console.log("Errors:", errors);
}
