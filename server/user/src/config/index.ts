require('dotenv').config();

// environment variable
export const PORT = process.env.PORT as string;
export const MONGODB_LOCAL_URI = process.env.MONGODB_LOCAL_URI as string;
export const AMQP_PATH = process.env.AMQP_PATH as string;
export const RPC_QUEUE_NAME = process.env.RPC_QUEUE_NAME as string;
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME as string;
export const CUSTOMER_SERVICE = process.env.CUSTOMER_SERVICE as string;
export const RPC_REQUEST_TIME_OUT = +(process.env.RPC_REQUEST_TIME_OUT || 2000) as number;
export const SALT_ROUNDS = +(process.env.SALT_ROUNDS || 10) as number;
export const JWT_PRIVATE_KEY = (process.env.JWT_PRIVATE_KEY || "json-web-token") as string;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";


// other configs
export { logger } from "./logger";