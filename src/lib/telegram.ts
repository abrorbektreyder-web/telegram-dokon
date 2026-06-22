const BOT_TOKEN = '8532025601:AAEB8BY-J-6qy3LK4au7wQHAwuO-OsKkXss';
const ADMIN_CHAT_ID = '6377333240';

export const sendTelegramNotification = async (message: string) => {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Telegram notification error:', error);
    return false;
  }
};
