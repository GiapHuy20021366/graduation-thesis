import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from "~/config";


export const hashText = (text: string): string | null => {
    let result: string | null = null;
    try {
        result = bcrypt.hashSync(text, SALT_ROUNDS);
    } finally {
        return result;
    }
}

export const compareHash = (plainText: string, encryptedText: string): boolean | null => {
    let result: boolean | null = null;
    try {
        result = bcrypt.compareSync(plainText, encryptedText);
    } finally {
        return result;
    } 
} 