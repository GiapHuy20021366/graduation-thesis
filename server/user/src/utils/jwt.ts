import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PRIVATE_KEY, JWT_EXPIRES_IN } from "~/config";

export const signToken = (payload: string | object | Buffer, expiresIn: string | number = JWT_EXPIRES_IN): string => {
    return "Bearer "+ jwt.sign(payload, JWT_PRIVATE_KEY, {
        expiresIn: expiresIn
    });
};

export const verifyToken = (token: string | null | undefined): string | JwtPayload | null => {
    if (token === null || token === undefined) return null;
    let result: string | JwtPayload | null = null;
    try {
        result = jwt.verify(token, JWT_PRIVATE_KEY);
    } finally {
        return result;
    }
}