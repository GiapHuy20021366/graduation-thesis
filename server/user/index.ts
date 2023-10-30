import express, { Express } from "express";
import { PORT } from "./src/config";
import { connectDB } from "./src/db";
import { RPCObserver } from "./src/broker/rpc"
import { initUserRouters } from "./src/route";
import cors from "cors";
import bodyParser from "body-parser";

const app: Express = express();

// connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// init endpoints
initUserRouters(app);

app.listen(PORT, () => {
  console.log(`User sevice is Listening to Port ${PORT}`);
});

// RPCObserver();
