import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Try loading .env from multiple possible locations
const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'backend', '.env'),
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env'),
];

for (const p of envPaths) {
    if (fs.existsSync(p)) {
        dotenv.config({ path: p });
    }
}

export const getTelegramBotToken = () =>
    process.env.TELEGRAM_BOT_TOKEN || '8727022042:AAHrO9ymxpc87tiklGJgM4Qf8_0Ao4ovZmg';

export const getTelegramDefaultChatId = () =>
    process.env.TELEGRAM_CHAT_ID || process.env.CHAT_ID || '5990494613';

const sendToTelegram = async (payload: any, targetChatId?: string | number, retries = 3) => {
    const botToken = getTelegramBotToken();
    const finalChatId = targetChatId || getTelegramDefaultChatId();

    if (!botToken || !finalChatId) {
        console.error('CRITICAL: Telegram bot token or chat ID is missing');
        return;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: finalChatId,
                    parse_mode: 'HTML',
                    ...payload,
                }),
            });

            if (response.ok) {
                return await response.json();
            } else {
                const errorData = await response.json();
                console.error(`Telegram API Error (attempt ${i + 1}/${retries}):`, errorData);

                // If error is related to HTML entities, retry sending as plain text
                if (errorData?.description && errorData.description.includes("can't parse entities")) {
                    console.warn('Retrying Telegram message as plain text without HTML formatting...');
                    const fallbackResponse = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: finalChatId,
                            text: payload.text?.replace(/<[^>]*>/g, '') || payload.text,
                        }),
                    });
                    if (fallbackResponse.ok) {
                        return await fallbackResponse.json();
                    }
                }
            }
        } catch (error: any) {
            console.error(`Telegram network error (attempt ${i + 1}/${retries}):`, error.message);
            if (i === retries - 1) {
                throw error;
            }
            await new Promise(res => setTimeout(res, 1000 * (i + 1)));
        }
    }
};

export const sendTelegramMessage = async (message: string, targetChatId?: string | number, retries = 3) => {
    return sendToTelegram({ text: message }, targetChatId, retries);
};
