// ОСНОВНОЙ СКРИПТ САЙТА
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен - КатализаторОFF.ru');
    
    // =================== МОБИЛЬНОЕ МЕНЮ ===================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    
    if (mobileMenuToggle && mobileMenu) {
        // Открытие/закрытие меню
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            
            // Меняем иконку
            mobileMenuToggle.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
            
            // Блокируем скролл страницы
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Закрытие меню при клике на ссылку
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Закрытие меню на ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
        
        // Функция закрытия меню
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
            body.style.overflow = '';
        }
    }
    
    // =================== ПЛАВНАЯ ПРОКРУТКА ===================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + 
                                      window.pageYOffset - 
                                      headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню если оно открыто
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });
    });
    
    // =================== ФОРМА ===================
    const requestForm = document.getElementById('requestForm');
    
    if (requestForm) {
        // Маска для телефона
        const phoneInput = requestForm.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    // Убираем первую 7 или 8
                    if (value[0] === '7' || value[0] === '8') {
                        value = value.substring(1);
                    }
                    
                    // Форматируем
                    let formatted = '+7 (';
                    
                    if (value.length > 0) formatted += value.substring(0, 3);
                    if (value.length >= 4) formatted += ') ' + value.substring(3, 6);
                    if (value.length >= 7) formatted += '-' + value.substring(6, 8);
                    if (value.length >= 9) formatted += '-' + value.substring(8, 10);
                    
                    this.value = formatted;
                }
            });
            
            phoneInput.addEventListener('keydown', function(e) {
                if (!/(\d|Backspace|Delete|ArrowLeft|ArrowRight|Tab)/.test(e.key) && 
                    !(e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key))) {
                    e.preventDefault();
                }
            });
        }
        
        // Отправка формы
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            const name = this.querySelector('#name');
            const phone = this.querySelector('#phone');
            const car = this.querySelector('#car');
            
            let errors = [];
            
            if (!name || !name.value.trim()) {
                errors.push('Введите ваше имя');
                name.style.borderColor = 'var(--primary)';
            } else {
                name.style.borderColor = '';
            }
            
            if (!phone || !phone.value.trim()) {
                errors.push('Введите номер телефона');
                phone.style.borderColor = 'var(--primary)';
            } else if (phone.value.replace(/\D/g, '').length < 10) {
                errors.push('Введите корректный номер телефона');
                phone.style.borderColor = 'var(--primary)';
            } else {
                phone.style.borderColor = '';
            }
            
            if (!car || !car.value.trim()) {
                errors.push('Введите марку и модель автомобиля');
                car.style.borderColor = 'var(--primary)';
            } else {
                car.style.borderColor = '';
            }
            
            if (errors.length === 0) {
                // Если есть функция отправки в Telegram
                if (typeof sendToTelegram === 'function') {
                    sendToTelegram(this);
                } else {
                    // Имитация успешной отправки
                    showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                    
                    // Очистка формы
                    this.reset();
                    
                    // Сброс стилей
                    [name, phone, car].forEach(input => {
                        if (input) input.style.borderColor = '';
                    });
                }
            } else {
                showNotification('Пожалуйста, исправьте ошибки:\n' + errors.join('\n'), 'error');
            }
        });
    }
    
    // =================== FAQ АККОРДЕОН ===================
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            
            // Закрываем все другие открытые элементы
            document.querySelectorAll('.accordion-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                }
            });
            
            // Открываем/закрываем текущий
            item.classList.toggle('active');
        });
    });
    
    // =================== УВЕДОМЛЕНИЯ ===================
    window.showNotification = function(message, type = 'info') {
        // Удаляем старые уведомления
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Создаем новое
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Автоудаление через 5 секунд
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    };
    
    // =================== ИСПРАВЛЕНИЕ ВЫСОТЫ ХЕДЕРА ===================
    function fixHeaderOffset() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        const headerHeight = header.offsetHeight;
        document.body.style.paddingTop = headerHeight + 'px';
        
        // Корректируем якорные ссылки
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (target) {
                    setTimeout(() => {
                        window.scrollBy(0, -headerHeight);
                    }, 100);
                }
            });
        });
    }
    
    fixHeaderOffset();
    window.addEventListener('resize', fixHeaderOffset);
    window.addEventListener('load', fixHeaderOffset);
    
    // =================== ГАЛЕРЕЯ ===================
    initGallery();
});

// ПРОСТАЯ ГАЛЕРЕЯ
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img) {
                // Можно добавить лайтбокс при необходимости
                console.log('Открыть изображение:', img.src);
            }
        });
    });
}

// ОБРАБОТЧИК ОШИБОК
window.addEventListener('error', function(e) {
    console.error('Ошибка на сайте:', e.error);
});

// ЗАГРУЗКА ИЗОБРАЖЕНИЙ
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Не удалось загрузить изображение:', this.src);
        });
    });
});