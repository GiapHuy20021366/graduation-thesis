import express, { Express } from "express";
import { PORT, PROXY_URL } from "./src/config";
import { connectDB } from "./src/db";
import { initRouter } from "./src/route";
import cors from "cors";
import bodyParser from "body-parser";
import { consoleLogger } from "./src/config";
import { RabbitMQ, initBrokerConsumners, initRpcConsumers } from "./src/broker";
import {
  notifyFavoriteFoodsChecker,
  notifyNearExpiredChecker,
  notifyAroundChecker,
  notifyExpiredChecker,
} from "./src/services";

const app: Express = express();

connectDB();
// Init RPC
const rabbit = RabbitMQ.instance;
initRpcConsumers(rabbit);
initBrokerConsumners(rabbit);

// Checkers
notifyAroundChecker.exe(0);
notifyFavoriteFoodsChecker.exe(30 * 60 * 1000);
notifyNearExpiredChecker.exe(60 * 60 * 1000);
notifyExpiredChecker.exe(60 * 60 * 1000);

app.use(
  cors({
    credentials: true,
    origin: [PROXY_URL],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init endpoints
initRouter(app);

app.listen(PORT, () => {
  consoleLogger.info(`Food sevice is Listening to Port ${PORT}`);
});
