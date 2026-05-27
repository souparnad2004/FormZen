export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "FormZen API",
    version: "0.1.0",
    description:
      "tRPC procedures served from /trpc. Use the React tRPC client in the web app for normal frontend calls.",
  },
  servers: [
    {
      url: "/",
      description: "Current API server",
    },
  ],
  tags: [
    { name: "Auth" },
    { name: "Forms" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      jwtCookie: {
        type: "apiKey",
        in: "cookie",
        name: "jwt",
      },
    },
    schemas: {
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      RegisterInput: {
        type: "object",
        required: ["email", "name", "password"],
        properties: {
          email: { type: "string", format: "email" },
          name: { type: "string" },
          password: { type: "string", format: "password" },
        },
      },
      CreateFormInput: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          name: { type: "string" },
          email_verified: { type: "boolean" },
        },
      },
    },
  },
  paths: {
    "/trpc/auth.login": {
      post: {
        tags: ["Auth"],
        summary: "Log in",
        description: "tRPC mutation: auth.login. Sets the httpOnly jwt cookie.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Authenticated user",
          },
        },
      },
    },
    "/trpc/auth.register": {
      post: {
        tags: ["Auth"],
        summary: "Register",
        description: "tRPC mutation: auth.register. Sets the httpOnly jwt cookie.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Registered user",
          },
        },
      },
    },
    "/trpc/auth.me": {
      get: {
        tags: ["Auth"],
        summary: "Current user",
        description: "tRPC query: auth.me.",
        security: [{ bearerAuth: [] }, { jwtCookie: [] }],
        responses: {
          "200": {
            description: "Current authenticated user",
          },
        },
      },
    },
    "/trpc/form.getPublicForms": {
      get: {
        tags: ["Forms"],
        summary: "Public forms",
        description: "tRPC query: form.getPublicForms.",
        responses: {
          "200": {
            description: "Public forms",
          },
        },
      },
    },
    "/trpc/form.created": {
      post: {
        tags: ["Forms"],
        summary: "Create form",
        description: "tRPC mutation: form.created.",
        security: [{ bearerAuth: [] }, { jwtCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateFormInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Created form",
          },
        },
      },
    },
  },
} as const;
