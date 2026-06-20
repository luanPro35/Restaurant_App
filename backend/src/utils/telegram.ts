import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const defaultChatId = process.env.TELEGRAM_CHAT_ID || process.env.CHAT_ID;

const sendToTelegram = async (payload: any, targetChatId?: string | number, retries = 3) => {
    const finalChatId = targetChatId || defaultChatId;

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
            }
        } catch (error: any) {
            if (i === retries - 1) {
                console.error(`Telegram notification failed:`, error.message);
                throw error;
            }
            await new Promise(res => setTimeout(res, 1000 * (i + 1)));
        }
    }
};

export const sendTelegramMessage = async (message: string, targetChatId?: string | number, retries = 3) => {
    return sendToTelegram({ text: message }, targetChatId, retries);
};
