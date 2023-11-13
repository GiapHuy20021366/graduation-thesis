import { NextFunction, Request, Response } from "express";
import {
    IRegistAccountBody,
    IRegistAccountQuery
} from "../controllers";
import { TAccountRegisterMethod, validateAccountRegisterMethod, validateEmail, validateName, validatePassword } from "../data";

export const checkRequestBodyAndParams = async (request: Request<{}, {}, IRegistAccountBody, IRegistAccountQuery>, _response: Response, next: NextFunction) => {
    const method: TAccountRegisterMethod | undefined = request.query.method;
    validateAccountRegisterMethod(method);
    let isAllValid: boolean = false;
    switch (method) {
        case "mannual":
            const { email, password, firstName, lastName } = request.body;
            await validateEmail(email).then(result => isAllValid ||= result).catch(next);
            await validatePassword(password).then(result => isAllValid ||= result).catch(next);
            await validateName(firstName, lastName).then(result => isAllValid ||= result).catch(next);
            break;
        case "google-oauth":
            next(new Error("Method not implemented"));
            break;
        case "facebook-oauth":
            next(new Error("Method not implemented"));
            break;
    }

    isAllValid && next();
}