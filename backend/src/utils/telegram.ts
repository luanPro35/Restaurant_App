import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const sendTelegramMessage = async (message: string, retries = 3) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || process.env.CHAT_ID;

    if (!botToken || !chatId) {
        console.error('CRITICAL: Telegram bot token or chat ID is missing in .env');
        return;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
    };

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error: any) {
            if (i === retries - 1) {
                console.error(`Telegram notification failed after ${retries} attempts:`, error.message);
                throw error;
            }
            await new Promise(res => setTimeout(res, 1000 * (i + 1)));
        }
    }
};
