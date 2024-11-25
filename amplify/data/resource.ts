import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Project: a
    .model({
      title: a.string().required(),
      owner: a
        .string()
        .authorization((allow) => [
          allow.owner().to(["read", "create", "delete"]),
        ]),
      tasks: a.hasMany("Task", "projectId"),
    })
    .authorization((allow) => [allow.owner()]),
  Task: a
    .model({
      title: a.string().required(),
      description: a.string(),
      dueDate: a.date(),
      priority: a.string(),
      status: a.string(),
      taskId: a.id(),
      projectId: a.id(),
      project: a.belongsTo("Project", "projectId"),
      owner: a
        .string()
        .authorization((allow) => [
          allow.owner().to(["read", "create", "update", "delete"]),
        ]),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
