import { Request, Response, NextFunction } from "express";

export const errorHandler = (error: Error, _request: Request, response: Response, _next: NextFunction) => {
    return response.status(500).json({ message: error.message });
}