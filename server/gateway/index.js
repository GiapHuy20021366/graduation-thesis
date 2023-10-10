const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const endpoints = require("./endpoints.json");
import { PORT } from "./config";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("../web-app"));


endpoints.forEach((endpoint) => {
    const url = `${endpoint.host}:${endpoint.port}`;
    app.use(endpoint.path, proxy(url));
    console.log(
      `BINDING: "${endpoint.path}" to "${endpoint.host}:${endpoint.port}"`
    );
});

app.listen(PORT, () => {
  console.log(`Gateway is Listening to Port ${PORT}`);
});
