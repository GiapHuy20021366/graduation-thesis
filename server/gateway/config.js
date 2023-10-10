const dotEnv = require("dotenv");
dotEnv.config();

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  console.log(configFile)
  dotEnv.config({ path: configFile });
  console.log(process.env.PORT)
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT
};