const express = require("express");
const cors = require("cors");
import { PORT } from "./src/config";
import { connectDB } from "./src/db";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`User sevice is Listening to Port ${PORT}`);
});
