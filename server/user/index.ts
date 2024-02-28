import express, { Express } from "express";
import { PORT } from "./src/config";
import { connectDB } from "./src/db";
import { initRouters } from "./src/route";
import cors from "cors";
import bodyParser from "body-parser";
import { consoleLogger } from "./src/config";
import { RPCObserver, subscribeMessage } from "./src/broker";

const app: Express = express();

connectDB();
RPCObserver();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// init endpoints
initRouters(app);

app.listen(PORT, () => {
  consoleLogger.info(`User sevice is Listening to Port ${PORT}`)
});

subscribeMessage().then(() => {
  consoleLogger.info("[MESSAGE BROKER] start listening messages");
});

