require('dotenv').config();

// environment variable
export const PORT = process.env.PORT as string;
export const MONGODB_LOCAL_URI = process.env.MONGODB_LOCAL_URI as string;
export const AMQP_PATH = process.env.AMQP_PATH as string;
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME as string;
export const RPC_REQUEST_TIME_OUT = +(process.env.RPC_REQUEST_TIME_OUT || 2000) as number;

export const USER_SERVICE = process.env.USER_SERVICE as string;
export const MESSAGE_SERVICE = process.env.MESSAGE_SERVICE as string;
export const FOOD_SERVICE = process.env.FOOD_SERVICE as string;

export const FOOD_SERVICE_RPC_QUEUE = process.env.FOOD_SERVICE_RPC_QUEUE as string;
export const MESSAGE_SERVICE_RPC_QUEUE = process.env.MESSAGE_SERVICE_RPC_QUEUE as string;
export const USER_SERVICE_RPC_QUEUE = process.env.USER_SERVICE_RPC_QUEUE as string;

export const SALT_ROUNDS = process.env.SALT_ROUNDS as string;
export const PROXY_URL = process.env.PROXY_URL as string;
export const POSTMAN_URL = process.env.POSTMAN_URL as string;

export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME as string;
export const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY as string;
export const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET as string;

const env = {
    PORT,
    MONGODB_LOCAL_URI,

    AMQP_PATH,
    EXCHANGE_NAME,
    RPC_REQUEST_TIME_OUT,
    USER_SERVICE,
    MESSAGE_SERVICE,
    FOOD_SERVICE,
    FOOD_SERVICE_RPC_QUEUE,
    MESSAGE_SERVICE_RPC_QUEUE,
    USER_SERVICE_RPC_QUEUE,

    SALT_ROUNDS,
    PROXY_URL,
    POSTMAN_URL,

    CLOUDINARY_NAME,
    CLOUDINARY_KEY,
    CLOUDINARY_SECRET
}

export default env;


// other configs
export { logger as winstonLogger } from "./winston";
export { logger as consoleLogger } from "./logger";

export { cloudinary } from "./cloudinary";