import express, { Express } from "express";
import cors from "cors";
import { PORT } from "./src/config";
import { withProxy } from "./src/config-proxy";
import { logger as consoleLogger } from "./src/logger";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../web-app"));
withProxy(app);

app.listen(PORT, () => {
  consoleLogger.info(`Gateway is Listening to Port ${PORT}`);
});
