import { Request, Response } from "express";

interface IRequestAccountParams { }

interface IResponseAccountBody { }

interface IRequestAccountBody {
    email?: string;
    password?: string;
}

interface IRequestAccountQuery {
    method?: TAccountRegisterMethod;
}

type TAccountRegisterMethod = "mannual" | "google-oauth" | "facebook-oauth";

export const registAccount = (request: Request<IRequestAccountParams, IResponseAccountBody, IRequestAccountBody, IRequestAccountQuery>, response: Response) => {
    const method: TAccountRegisterMethod | undefined = request.query.method;
    validateAccountRegisterMethod(method);
    switch (method) {
        case "mannual":
            const { email, password } = request.body;
            validateEmail(email);
            validatePassword(password);
        case "google-oauth":

        case "facebook-oauth":

    }
    return response.send("Loading");
}

const validateAccountRegisterMethod = (method?: TAccountRegisterMethod): void => {
    const methods = ["mannual", "google-oauth", "facebook-oauth"];
    if (method == undefined || !methods.includes(method)) {
        throw new Error(`Invalid method "${method}" for Account register.`);
    }
}

const validateEmail = (email?: string): void => {
    if (email === undefined) {
        throw new Error("Email can not be undefined");
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
    }
}

const validatePassword = (password?: string): void => {
    if (password == undefined) {
        throw new Error("Password can not be undefined");
    }
    if (password.length < 8) {
        throw new Error("Invalid password format: Length have to larger or equal t0 8");
    }

    if (!/[A-Z]/.test(password)) {
        throw new Error("Invalid password format:");
    }

    if (!/[a-z]/.test(password)) {
        throw new Error("Invalid password format:");
    }

    if (!/[0-9]/.test(password)) {
        throw new Error("Invalid password format:");
    }

    if (!/[!@#$%^&*]/.test(password)) {
        throw new Error("Invalid password format:");
    }
}