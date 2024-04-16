import express, { Express } from "express";
import { PORT, consoleLogger } from "./src/config";
import { connectDB } from "./src/db";
import { initUserRouters } from "./src/route";
import cors from "cors";
import http from "http";
import { initSocketServer } from "./src/socket";
import { RabbitMQ, initBrokerConsumners, initRpcConsumers } from "./src/broker";

const app: Express = express();
const httpServer = http.createServer(app);

connectDB();
// Init RPC
const rabbit = RabbitMQ.instance;
initRpcConsumers(rabbit);
initBrokerConsumners(rabbit);

app.use(cors());

app.use(express.json());
app.use(express.static("public"));

// init endpoints
initUserRouters(app);

// io socket
initSocketServer(httpServer);

httpServer.listen(PORT, () => {
  consoleLogger.info(`Message sevice is Listening to Port ${PORT}`);
});
