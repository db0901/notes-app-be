import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "Notes API",
    description:
      "A notes application with authentication based on JWT and all the crud operations",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3128",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      jwt: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      user: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
          },
          password: {
            type: "string",
          },
          username: {
            type: "string",
          },
          createdAt: {
            type: "string",
          },
        },
      },
      note: {
        type: "object",
        required: ["userId", "title"],
        properties: {
          userId: {
            type: "string",
          },
          title: {
            type: "string",
          },
          content: {
            type: "string",
          },
          createdAt: {
            type: "string",
          },
          updatedAt: {
            type: "string",
          },
        },
      },
    },
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.ts"],
};

export default swaggerJSDoc(swaggerOptions);
