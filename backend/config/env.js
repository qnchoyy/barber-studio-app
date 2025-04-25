import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 5500;

export const {
    SERVER_URL
} = process.env;