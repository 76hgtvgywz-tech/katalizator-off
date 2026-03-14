// api/sendTelegram.js
export default async function handler(req, res) {
    // Разрешаем только POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, phone, car, service, message } = req.body;

        // Проверяем обязательные поля
        if (!name || !phone || !car) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Формируем сообщение
        const text = `
📞 НОВАЯ ЗАЯВКА С САЙТА КатализаторOFF.ru

👤 Имя: ${name}
📱 Телефон: ${phone}
🚗 Автомобиль: ${car}
🔧 Услуга: ${service || 'Не указано'}
📝 Сообщение: ${message || 'Не указано'}

🕒 Время: ${new Date().toLocaleString('ru-RU')}
🌐 Страница: ${req.headers.referer || 'Не определено'}
        `.trim();

        // Токен и chat_id из переменных окружения (настраиваются в Vercel)
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            console.error('Telegram credentials not set');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Отправляем в Telegram
        const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            })
        });

        const result = await telegramRes.json();

        if (!result.ok) {
            throw new Error(result.description);
        }

        // Отправляем успешный ответ клиенту
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
}