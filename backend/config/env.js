import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 5500;

export const {
    SERVER_URL,
    DB_URI,
    JWT_SECRET,
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER,
} = process.env;