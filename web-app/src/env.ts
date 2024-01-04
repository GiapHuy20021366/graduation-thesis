const env = import.meta.env;

export const GOOGLE_CLIENT_ID = env.VITE_GOOGLE_CLIENT_ID as string;
export const GOOGLE_MAP_API_KEY = env.VITE_GOOGLE_MAP_API_KEY as string;
export const GEOCODE_MAPS_API = env.VITE_GEOCODE_MAPS_API as string;

export const PROXY_URL = env.VITE_PROXY_URL as string;
export const USER_PATH = env.VITE_USER_PATH as string;
export const MESSAGE_PATH = env.VITE_MESSAGE_PATH as string;
export const FOOD_PATH = env.VITE_FOOD_PATH as string;