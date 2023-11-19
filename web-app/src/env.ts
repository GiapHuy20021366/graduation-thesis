const env = import.meta.env;

export const GOOGLE_CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID as string;
export const PROXY_URL = env.VITE_PROXY_URL as string;
export const USER_PATH = env.VITE_USER_PATH as string;