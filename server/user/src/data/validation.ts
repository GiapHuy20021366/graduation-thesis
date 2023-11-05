import { InvalidDataError } from "./invalid-data-error";

export type TAccountRegisterMethod = "mannual" | "google-oauth" | "facebook-oauth";

export const validateAccountRegisterMethod = (method?: TAccountRegisterMethod): void => {
    const methods = ["mannual", "google-oauth", "facebook-oauth"];
    if (method == undefined || !methods.includes(method)) {
        throw new InvalidDataError({
            message: `Invalid method "${method}" for Account register.`
        });
    }
} 

export const validateEmail = async (email?: string): Promise<boolean> => {
    if (email === undefined) {
        throw new InvalidDataError({
            message: "Email can not be undefined"
        });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new InvalidDataError({
            message: "Invalid email format"
        });
    }
    return true;
}

export const validatePassword = async (password?: string): Promise<boolean> => {
    if (password == undefined) {
        throw new InvalidDataError({
            message: "Password can not be undefined"
        });
    }
    if (password.length < 8) {
        throw new InvalidDataError({
            message: "Invalid password format: Length have to larger or equal to 8"
        });
    }

    if (!/[A-Z]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one upper case character"
        });
    }

    if (!/[a-z]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one lower case character"
        });
    }

    if (!/[0-9]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one digit character"
        });
    }

    if (!/[!@#$%^&*]/.test(password)) {
        throw new InvalidDataError({
            message: "Invalid password format: At least one special character"
        });
    }
    return true;
}

export const validateName = async (firstName?: string, lastName?: string): Promise<boolean> => {
    if (firstName === undefined || firstName === "") {
        throw new InvalidDataError({
            message: "First name cannot be empty"
        });
    }
    if (lastName === undefined || lastName === "") {
        throw new InvalidDataError({
            message: "Last name cannot be empty"
        });
    }
    return true;
}