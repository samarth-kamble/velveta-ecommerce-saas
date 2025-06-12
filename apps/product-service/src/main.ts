import "./jobs/product-cron.job";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "@packages/error-handler/ErrorMiddleware";
import router from "./routes/product.route";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = require("./swagger-output.json");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello Products Service" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
  res.json(swaggerDocument);
});

// Routes
app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 6002;
const server = app.listen(port, () => {
  console.log(
    `Product Service Listening at http://localhost:${port}/product/api`
  );
  console.log(`Swagger UI at http://localhost:${port}/product/api-docs`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
