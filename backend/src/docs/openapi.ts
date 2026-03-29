export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "PrimeTrade Internship API",
    version: "1.0.0",
    description: "Versioned REST API with JWT auth, RBAC, and Task CRUD",
  },
  servers: [{ url: "http://localhost:5000" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/api/v1/auth/register": {
      post: {
        summary: "Register user",
        responses: {
          "201": { description: "Created" },
          "409": { description: "Email exists" },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        summary: "Login user",
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/v1/auth/refresh": {
      post: {
        summary: "Refresh access token",
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/v1/tasks": {
      get: {
        summary: "List tasks",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "OK" },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        summary: "Create task",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Created" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/v1/tasks/{id}": {
      get: {
        summary: "Get task by ID",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "OK" },
          "403": { description: "Forbidden" },
          "404": { description: "Not found" },
        },
      },
      patch: {
        summary: "Update task",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "OK" },
          "403": { description: "Forbidden" },
        },
      },
      delete: {
        summary: "Delete task",
        security: [{ bearerAuth: [] }],
        responses: {
          "204": { description: "Deleted" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/v1/admin/stats": {
      get: {
        summary: "Admin-only platform stats",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "OK" },
          "403": { description: "Forbidden" },
        },
      },
    },
  },
};
