import express, { Express } from "express";
import { PORT, consoleLogger } from "./src/config";
import { connectDB } from "./src/db";
import { initUserRouters } from "./src/route";
import { initChannel } from "./src/broker";
import cors from "cors";

const app: Express = express();

// connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// init endpoints
initUserRouters(app);

app.listen(PORT, () => {
  consoleLogger.info(`Message sevice is Listening to Port ${PORT}`)
});

initChannel();
