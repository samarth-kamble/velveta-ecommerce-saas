const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Product Service API",
    description: "API documentation for the Product Service",
    version: "1.0.0",
  },
  host: "localhost:6002",
  schemes: ["http"],
  basePath: "/product/api",
};

const outputFile = "./swagger-output.json";
const endpoints = ["./routes/product.route.ts"];

swaggerAutogen(outputFile, endpoints, doc);
