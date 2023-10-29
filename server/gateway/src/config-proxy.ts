import { Express } from "express";
import proxy from "express-http-proxy";
import endpoints from "../endpoints.json";

interface EndPoint {
    path: string;
    host: string;
    port: number;
}

export const withProxy = (app: Express): void => {
    endpoints.forEach((endpoint: EndPoint) => {
        const url = `${endpoint.host}:${endpoint.port}`;
        app.use(endpoint.path, proxy(url));
        console.log(
            `BINDING: "${endpoint.path}" to "${endpoint.host}:${endpoint.port}"`
        );
    });
}