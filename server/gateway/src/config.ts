require("dotenv").config();

export const PORT = +(process.env.PORT || 8000) as number;
export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY as string;