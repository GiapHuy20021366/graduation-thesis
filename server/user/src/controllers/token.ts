import { NextFunction, Request, Response } from "express";
import { toResponseSuccessData } from "../data";
import * as services from "../services";

export interface IRefreshTokenBody {
    token?: string;
}

export interface IRefreshTokenQuery {
    profile?: boolean;
}

export const refreshToken = async (request: Request<{}, {}, {}, IRefreshTokenQuery>, response: Response, next: NextFunction) => {
    const authContext = request.authContext!;
    services.refreshToken(authContext, request.query.profile).then((result) => {
        return response.status(200).json(toResponseSuccessData(result))
    }).catch(next);
}

