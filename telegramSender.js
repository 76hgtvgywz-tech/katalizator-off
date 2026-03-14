// telegramSender.js – обновлённая версия для работы с Vercel API
async function sendToTelegram(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    try {
        // Собираем данные формы
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Отправляем на наш API-эндпоинт
        const response = await fetch('/api/sendTelegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Ошибка сервера');
        }

        // Успех
        if (typeof showNotification === 'function') {
            showNotification('✅ Заявка успешно отправлена! Мы свяжемся с вами.', 'success');
        } else {
            alert('✅ Заявка успешно отправлена!');
        }

        form.reset();
    } catch (error) {
        console.error('Ошибка отправки:', error);
        const msg = '❌ Ошибка отправки. Пожалуйста, позвоните нам: +7 (962) 628-97-77';
        if (typeof showNotification === 'function') {
            showNotification(msg, 'error');
        } else {
            alert(msg);
        }
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Делаем функцию глобальной
window.sendToTelegram = sendToTelegram;
