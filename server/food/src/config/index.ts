require('dotenv').config();

// environment variable
export const PORT = process.env.PORT as string;
export const MONGODB_LOCAL_URI = process.env.MONGODB_LOCAL_URI as string;
export const AMQP_PATH = process.env.AMQP_PATH as string;
export const RPC_QUEUE_NAME = process.env.RPC_QUEUE_NAME as string;
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME as string;
export const RPC_REQUEST_TIME_OUT = +(process.env.RPC_REQUEST_TIME_OUT || 2000) as number;

export const USER_SERVICE = process.env.USER_SERVICE as string;
export const MESSAGE_SERVICE = process.env.MESSAGE_SERVICE as string;
export const FOOD_SERVICE = process.env.FOOD_SERVICE as string;

export const SALT_ROUNDS = process.env.SALT_ROUNDS as string;


// other configs
export { logger as winstonLogger } from "./winston";
export { logger as consoleLogger } from "./logger";