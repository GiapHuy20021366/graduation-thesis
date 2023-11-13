import axios from "axios";

export const userInstance = axios.create({
    baseURL: import.meta.env.VITE_PROXY_URL + "/api/user",
    timeout: 2000,
    headers: {
        
    }
});