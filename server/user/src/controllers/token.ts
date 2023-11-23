import { NextFunction, Request, Response } from "express";
import { InvalidDataError, toResponseSuccessData } from "../data";
import * as services from "../services";

export interface IRefreshTokenBody {
    token?: string;
}

export interface IRefreshTokenQuery {
    profile?: boolean;
}

export const refreshToken = async (request: Request<{}, {}, {}, IRefreshTokenQuery>, response: Response, next: NextFunction) => {
    const token = request.headers.authorization;
    if (token == null) {
        return next(new InvalidDataError({
            message: "Token not found",
            data: {
                target: "token",
                reason: "missing-token-in-headers"
            }
        }))
    }
    services.refreshToken(token, request.query.profile).then((result) => {
        return response.status(200).json(toResponseSuccessData(result))
    }).catch(next);
}

