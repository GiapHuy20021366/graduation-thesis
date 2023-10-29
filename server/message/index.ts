import express, { Express } from "express";
import { PORT } from "./src/config";
import { connectDB } from "./src/db";
import { RPCObserver } from "./src/broker/rpc"
import { initUserRouters } from "./src/route";
import cors from "cors";

const app: Express = express();

// connectDB();

app.use(cors());
app.use(express.json());

// init endpoints
initUserRouters(app);

app.listen(PORT, () => {
  console.log(`Message sevice is Listening to Port ${PORT}`);
});

// RPCObserver();
