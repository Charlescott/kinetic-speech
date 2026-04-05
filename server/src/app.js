import cors from "cors";
import express from "express";
import helmet from "helmet";

import healthRouter from "./routes/health.js";
import formsRouter from "./routes/forms.js";

export default function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/forms", formsRouter);

  return app;
}

