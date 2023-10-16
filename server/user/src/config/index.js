const dotEnv = require("dotenv");
dotEnv.config();

module.exports = {
  PORT: process.env.PORT,
  MONGODB_LOCAL_URI: process.env.MONGODB_LOCAL_URI,
  AMQP_PATH: process.env.AMQP_PATH,
  RPC_QUEUE_NAME: process.env.RPC_QUEUE_NAME,
};
