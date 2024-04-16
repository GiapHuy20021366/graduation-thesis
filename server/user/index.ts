import express, { Express } from "express";
import { PORT } from "./src/config";
import { connectDB } from "./src/db";
import { initRouters } from "./src/route";
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// init endpoints
initRouters(app);

app.listen(PORT, () => {
  consoleLogger.info(`User sevice is Listening to Port ${PORT}`);
});
