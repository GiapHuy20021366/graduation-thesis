import express, { Express } from "express";
import { PORT, POSTMAN_URL, PROXY_URL } from "./src/config";
import { connectDB } from "./src/db";
import { initUserRouters } from "./src/route";
import cors from "cors";
import bodyParser from "body-parser";
import { consoleLogger } from "./src/config";
import { subscribeMessage, publishMessage } from "./src/broker";

const app: Express = express();

connectDB();

app.use(cors({
  credentials: true,
  origin: [PROXY_URL]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// init endpoints
initUserRouters(app);

app.listen(PORT, () => {
  consoleLogger.info(`Food sevice is Listening to Port ${PORT}`)
});

subscribeMessage().then(() => {
  consoleLogger.info("[MESSAGE BROKER] start listening messages");
});


// RPCObserver();
