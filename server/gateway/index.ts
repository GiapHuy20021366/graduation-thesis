import express, { Express } from "express";
import cors from "cors";
import { PORT } from "./src/config";
import { withProxy } from "./src/config-proxy";
import { logger as consoleLogger } from "./src/logger";
import path from "path";

const app: Express = express();

app.use(cors());
app.use(
  express.json({
    limit: "10000kb",
  })
);
withProxy(app);
app.use(express.static("./web-app"));
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../web-app", "index.html"));
});

app.listen(PORT, () => {
  consoleLogger.info(`Gateway is Listening to Port ${PORT}`);
});
