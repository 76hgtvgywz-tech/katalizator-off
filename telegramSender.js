// Отправка заявок в Telegram для сайта по тюнингу выхлопной системы

// КОНФИГУРАЦИЯ БОТА TELEGRAM
// ВАЖНО: Замените эти значения на реальные!
const TELEGRAM_CONFIG = {
    botToken: '8454352612:AAHF_Lla5sRYM7-8mFFlUsfBE81TkDd78AI', // Токен вашего бота
    chatId: '562345561', // Ваш chat_id (ID чата)
    apiUrl: 'https://api.telegram.org/bot'
};

// Функция отправки данных формы в Telegram
async function sendToTelegram(form) {
    try {
        // Собираем данные из формы
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Формируем сообщение для Telegram
        const message = `
📞 НОВАЯ ЗАЯВКА С САЙТА КатализаторOFF.ru

👤 Имя: ${data.name || 'Не указано'}
📱 Телефон: ${data.phone || 'Не указано'}
🚗 Автомобиль: ${data.car || 'Не указано'}
🔧 Услуга: ${data.service || 'Не указано'}
📝 Сообщение: ${data.message || 'Не указано'}

🕒 Время: ${new Date().toLocaleString('ru-RU')}
🌐 Страница: ${window.location.href}
        `.trim();
        
        // Показываем индикатор загрузки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        console.log('Отправка данных в Telegram:', data);
        console.log('Токен бота:', TELEGRAM_CONFIG.botToken.substring(0, 10) + '...');
        console.log('Chat ID:', TELEGRAM_CONFIG.chatId);
        
        // Отправляем запрос к API Telegram
        const response = await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        
        console.log('Ответ от Telegram API:', result);
        
        if (result.ok) {
            // Показываем сообщение об успешной отправке
            if (typeof showNotification === 'function') {
                showNotification('✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
            } else {
                alert('✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
            }
            
            // Очищаем форму
            form.reset();
            
            // Отправляем второе сообщение с контактной информацией
            setTimeout(async () => {
                const contactMessage = `
📞 Контактная информация:
Телефон: +7 (962) 628-97-77
Telegram: @fighter64
Адрес: Москва, Щербинка гск Полет 3
Режим работы: Пн-Пт 9:00-20:00
                `.trim();
                
                await fetch(`${TELEGRAM_CONFIG.apiUrl}${TELEGRAM_CONFIG.botToken}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CONFIG.chatId,
                        text: contactMessage,
                        parse_mode: 'HTML'
                    })
                });
            }, 1000);
            
        } else {
            throw new Error(result.description || 'Ошибка отправки в Telegram');
        }
        
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        
        if (typeof showNotification === 'function') {
            showNotification('❌ Ошибка отправки заявки. Пожалуйста, позвоните нам по телефону +7 (962) 628-97-77', 'error');
        } else {
            alert('❌ Ошибка отправки заявки. Пожалуйста, позвоните нам по телефону +7 (962) 628-97-77');
        }
        
        // Показываем данные формы для отладки
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('Данные формы для отладки:', data);
        
    } finally {
        // Восстанавливаем кнопку
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Отправить заявку';
            submitBtn.disabled = false;
        }
    }
}

// Проверка конфигурации при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, настроен ли бот
    if (!TELEGRAM_CONFIG.botToken || TELEGRAM_CONFIG.botToken.includes('YOUR_BOT_TOKEN') || 
        !TELEGRAM_CONFIG.chatId || TELEGRAM_CONFIG.chatId.includes('YOUR_CHAT_ID')) {
        console.warn('ВНИМАНИЕ: Токен бота или chat_id не настроены! Замените значения в файле telegramSender.js');
        
        // Перехватываем отправку формы для отладки
        const requestForms = document.querySelectorAll('#requestForm');
        
        requestForms.forEach(requestForm => {
            const originalSubmit = requestForm.onsubmit;
            
            requestForm.addEventListener('submit', function(e) {
                if (!TELEGRAM_CONFIG.botToken || TELEGRAM_CONFIG.botToken.includes('YOUR_BOT_TOKEN')) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData.entries());
                    
                    console.log('Тестовые данные формы (Telegram не настроен):', data);
                    
                    if (typeof showNotification === 'function') {
                        showNotification('Форма в тестовом режиме. Для реальной отправки настройте Telegram бота.', 'info');
                    } else {
                        alert('Форма в тестовом режиме. Для реальной отправки настройте Telegram бота.\n\nДанные формы:\n' + 
                              JSON.stringify(data, null, 2));
                    }
                    
                    this.reset();
                    return false;
                }
                
                if (originalSubmit) {
                    return originalSubmit.call(this, e);
                }
            });
        });
    } else {
        console.log('Telegram бот настроен правильно');
    }
});

// Экспортируем функцию для глобального использования
window.sendToTelegram = sendToTelegram;