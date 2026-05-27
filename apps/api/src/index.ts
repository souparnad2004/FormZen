import express from "express";
import cors from "cors";
import { apiReference } from "@scalar/express-api-reference";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "@repo/trpc";
import { createContext } from "@repo/trpc";
import { openApiDocument } from "./openapi.js";
import cookieParser from "cookie-parser";
import { env } from "@repo/config";

const app = express();

const port = env.PORT;

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});

app.get("/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});

app.use(
  "/reference",
  apiReference({
    content: openApiDocument,
    pageTitle: "FormZen API Reference",
    theme: "default",
  }),
);

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use((_req, res) => {
  res.status(404).json({
    error: "Not found",
  });
});

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Scalar API reference: http://localhost:${port}/reference`);
});

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`${signal} received. Closing HTTP server...`);
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
