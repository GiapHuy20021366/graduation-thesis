import { Request, Response } from "express";


export const hello = (_request: Request, response: Response): Response => {
    console.log("Heelo");
    console.log(_request.url);
    return response.send("Hello from User Service");
}