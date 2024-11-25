import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a
    .model({
      title: a.string().required(),
      owner: a
        .string()
        .authorization((allow) => [
          allow.owner().to(["read", "create", "delete"]),
        ]),
      comments: a.hasMany("Comment", "postId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.owner(),
    ]),
  Comment: a
    .model({
      content: a.string().required(),
      postId: a.id(),
      post: a.belongsTo("Post", "postId"),
      owner: a
        .string()
        .authorization((allow) => [
          allow.owner().to(["read", "create", "delete"]),
        ]),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.owner(),
    ]),
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
