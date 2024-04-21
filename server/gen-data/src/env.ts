require("dotenv").config();
const env = process.env;

export const SALT_ROUNDS = +(env.SALT_ROUNDS ?? 10) as number;
export const DEFAULT_PASSWORD = env.DEFAULT_PASSWORD as string;
