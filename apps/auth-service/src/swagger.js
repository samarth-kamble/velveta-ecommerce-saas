const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Auth Service API",
    description: "API documentation for the Auth Service",
    version: "1.0.0",
  },
  host: "localhost:6001",
  schemes: ["http"],
  basePath: "/api",
};

const outputFile = "./swagger-output.json";
const endpoints = ["./routes/auth.router.ts"];

swaggerAutogen(outputFile, endpoints, doc);
