const BOT_TOKEN = '8532025601:AAEB8BY-J-6qy3LK4au7wQHAwuO-OsKkXss';
export const ADMIN_CHAT_IDS = ['6377333240', '482537660'];

export const sendTelegramNotification = async (message: string) => {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const promises = ADMIN_CHAT_IDS.map(chat_id => 
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chat_id,
          text: message,
          parse_mode: 'HTML'
        })
      })
    );

    const responses = await Promise.all(promises);
    return responses.every(r => r.ok);
  } catch (error) {
    console.error('Telegram notification error:', error);
    return false;
  }
};
