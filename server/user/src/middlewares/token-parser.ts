import { NextFunction, Request, Response } from "express";
import { AuthLike, UnauthorizationError } from "../data";

export const tokenParser = (request: Request<{}, {}, {}, {}>, _response: Response, next: NextFunction) => {
    const jsonToken = request.headers.authorization;
    if (jsonToken == null) {
        return next(new UnauthorizationError({
            message: "No token found",
            data: {
                reason: "no-token-found",
                target: "token"
            }
        }))
    }
    try {
        const parsed = JSON.parse(jsonToken);
        if (parsed.email == null) {
            return next(new UnauthorizationError({
                message: "Invalid token",
                data: {
                    reason: "invalid-token",
                    target: "token"
                }
            }))
        }
        request.authContext = parsed as AuthLike;
        next();
    } catch (error) {
        return next(new UnauthorizationError({
            message: "No token found",
            data: {
                reason: "no-token-found",
                target: "token"
            }
        }))
    }
}