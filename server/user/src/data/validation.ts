import { InvalidDataError } from "./invalid-data-error";

export type TAccountRegisterMethod = "manual" | "google-oauth" | "facebook-oauth";

export const validateAccountRegisterMethod = async (method?: TAccountRegisterMethod): Promise<boolean> => {
    const methods = ["manual", "google-oauth", "facebook-oauth"];
    if (method == undefined || !methods.includes(method)) {
        throw new InvalidDataError({
            message: `Invalid method "${method}" for Account register.`,
            data: {
                targetLabel: "method",
                reason: "INVALID_METHOD"
            }
        });
    }
    return true;
} 

export const validateEmail = async (email?: string): Promise<boolean> => {
    if (email === undefined) {
        throw new InvalidDataError({
            message: "Email can not be undefined",
            data: {
                targetLabel: "email",
                reason: "EMPTY_EMAIL"
            }
        });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new InvalidDataError({
            message: "Invalid email format",
            data: {
                targetLabel: "email",
                reason: "INVALID_EMAIL_FORMAT"
            }
        });
    }
    return true;
}

export const validatePassword = async (password?: string): Promise<boolean> => {
    if (password == undefined) {
        throw new InvalidDataError({
            message: "Password can not be undefined",
            data: {
                targetLabel: "password",
                reason: "EMPTY_PASSWORD"
            }
        });
    }
    if (password.length < 8) {
        throw new InvalidDataError({
            message: "Invalid password format: Length have to larger or equal to 8",
            data: {
                targetLabel: "password",
                reason: "INVALID_PASSWORD_LENGTH"
            }
        });
    }

    if (!/[A-Z]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one upper case character",
            data: {
                targetLabel: "password",
                reason: "INVALID_PASSWORD_CHARACTER_UPPER"
            }
        });
    }

    if (!/[a-z]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one lower case character",
            data: {
                targetLabel: "password",
                reason: "INVALID_PASSWORD_CHARACTER_LOWER"
            }
        });
    }

    if (!/[0-9]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one digit character",
            data: {
                targetLabel: "password",
                reason: "INVALID_PASSWORD_CHARACTER_DIGIT"
            }
        });
    }

    if (!/[!@#$%^&*]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one special character",
            data: {
                targetLabel: "password",
                reason: "INVALID_PASSWORD_CHARACTER_SPECIAL"
            }
        });
    }
    return true;
}

export const validateName = async (firstName?: string, lastName?: string): Promise<boolean> => {
    if (firstName === undefined || firstName === "") {
        throw new InvalidDataError({
            message: "First name cannot be empty",
            data: {
                targetLabel: "firstName",
                reason: "EMPTY_FIRST_NAME"
            }
        });
    }
    if (lastName === undefined || lastName === "") {
        throw new InvalidDataError({
            message: "Last name cannot be empty",
            data: {
                targetLabel: "lastName",
                reason: "EMPTY_LAST_NAME"
            }
        });
    }
    return true;
}