import { InvalidDataError } from "./invalid-data-error";

export type TAccountRegisterMethod = "manual" | "google-oauth" | "facebook-oauth";

export const validateAccountRegisterMethod = (method?: TAccountRegisterMethod): boolean => {
    const methods = ["manual", "google-oauth", "facebook-oauth"];
    if (method == undefined || !methods.includes(method)) {
        throw new InvalidDataError({
            message: `Invalid method "${method}" for Account register.`,
            data: {
                target: "method",
                reason: "invalid-method"
            }
        });
    }
    return true;
} 

export const validateEmail = (email?: string): boolean => {
    if (email == null) {
        throw new InvalidDataError({
            message: "Email not found",
            data: {
                target: "email",
                reason: "empty-email"
            }
        });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new InvalidDataError({
            message: "Invalid email format",
            data: {
                target: "email",
                reason: "invalid-email-format"
            }
        });
    }
    return true;
}

export const validatePassword = (password?: string): boolean => {
    if (password == undefined) {
        throw new InvalidDataError({
            message: "Password can not be undefined",
            data: {
                target: "password",
                reason: "empty-password"
            }
        });
    }
    if (password.length < 8) {
        throw new InvalidDataError({
            message: "Invalid password format: Length have to larger or equal to 8",
            data: {
                target: "password",
                reason: "invalid-password-length"
            }
        });
    }

    if (!/[A-Z]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one upper case character",
            data: {
                target: "password",
                reason: "invalid-password-character-upper"
            }
        });
    }

    if (!/[a-z]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one lower case character",
            data: {
                target: "password",
                reason: "invalid-password-character-lower"
            }
        });
    }

    if (!/[0-9]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one digit character",
            data: {
                target: "password",
                reason: "invalid-password-character-digit"
            }
        });
    }

    if (!/[!@#$%^&*]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one special character",
            data: {
                target: "password",
                reason: "invalid-password-character-special"
            }
        });
    }
    return true;
}

export const validateName = (firstName?: string, lastName?: string): boolean => {
    if (firstName === undefined || firstName === "") {
        throw new InvalidDataError({
            message: "First name cannot be empty",
            data: {
                target: "firstName",
                reason: "empty-first-name"
            }
        });
    }
    if (lastName === undefined || lastName === "") {
        throw new InvalidDataError({
            message: "Last name cannot be empty",
            data: {
                target: "lastName",
                reason: "empty-last-name"
            }
        });
    }
    return true;
}