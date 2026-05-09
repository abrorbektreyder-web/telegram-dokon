const BOT_TOKEN = '7629555771:AAGy7M64V8w9w9w9w9w9w9w9w9w9w9w'; // Bu yerga bot tokenini qo'yishingiz kerak
const ADMIN_CHAT_ID = 'YOUR_CHAT_ID'; // Bu yerga admin chat ID sini qo'yishingiz kerak

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
