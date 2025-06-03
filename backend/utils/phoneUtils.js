export function formatToE164(phone) {
    if (!phone) return '';

    const cleaned = phone.replace(/[^\d+]/g, "");

    if (cleaned.startsWith("+")) {
        return cleaned;
    }

    if (cleaned.startsWith("0")) {
        return "+359" + cleaned.slice(1);
    }

    if (/^[89]\d{8}$/.test(cleaned)) {
        return "+359" + cleaned;
    }

    return cleaned;
}

export function validateBulgarianPhone(phone) {
    const normalized = formatToE164(phone);
    return /^\+359[0-9]{8,9}$/.test(normalized);
}