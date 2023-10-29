import { NextFunction, Request, Response } from "express";


export const handleHello = (_request: Request, _response: Response, next: NextFunction) => {
    // _request.customProperty = 
    return next();
}