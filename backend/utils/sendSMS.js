import twilio from 'twilio';
import {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
} from '../config/env.js';
import { formatToE164 } from './phoneUtils.js';

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export async function sendSMS(toRaw, body) {
    try {
        const to = formatToE164(toRaw);

        console.log(`📱 Изпращане на SMS към ${toRaw} (нормализиран: ${to})`);

        const message = await client.messages.create({
            body,
            from: TWILIO_PHONE_NUMBER,
            to,
        });

        console.log(`✅ SMS изпратен към ${to}: SID ${message.sid}`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error(`❌ Failed to send SMS to ${toRaw}:`, error.message);
        return { success: false, error: error.message };
    }
}