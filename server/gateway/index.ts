import express, { Express } from "express";
import cors from "cors";
import { PORT } from "./src/config";
import { withProxy } from "./src/config-proxy";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../web-app"));
withProxy(app);

app.listen(PORT, () => {
  console.log(`Gateway is Listening to Port ${PORT}`);
});
