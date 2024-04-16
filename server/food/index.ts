import express, { Express } from "express";
import { PORT, PROXY_URL } from "./src/config";
import { connectDB } from "./src/db";
import { initRouter } from "./src/route";
import cors from "cors";
import bodyParser from "body-parser";
import { consoleLogger } from "./src/config";
import { RabbitMQ, initBrokerConsumners, initRpcConsumers } from "./src/broker";

const app: Express = express();

connectDB();
// Init RPC
const rabbit = RabbitMQ.instance;
initRpcConsumers(rabbit);
initBrokerConsumners(rabbit);

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
