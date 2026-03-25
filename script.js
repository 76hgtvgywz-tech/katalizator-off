// ОСНОВНОЙ СКРИПТ САЙТА
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт загружен - КатализаторОFF.ru');

    // =================== МОБИЛЬНОЕ МЕНЮ ===================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMobileMenu();
        });

        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
            body.style.overflow = '';
        }
    }

    // =================== ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ ===================
    const header = document.querySelector('.header');
    if (header) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!' || href === '') return;

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Закрываем мобильное меню, если открыто
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        closeMobileMenu();
                    }
                }
            });
        });
    }

    // =================== КОРРЕКЦИЯ ОТСТУПА ДЛЯ ФИКСИРОВАННОЙ ШАПКИ ===================
    function fixHeaderOffset() {
        if (header) {
            document.body.style.paddingTop = header.offsetHeight + 'px';
        }
    }

    fixHeaderOffset();
    window.addEventListener('resize', fixHeaderOffset);
    window.addEventListener('load', fixHeaderOffset);

    // =================== ФОРМА ОТПРАВКИ ===================
    const requestForm = document.getElementById('requestForm');

    if (requestForm) {
        const phoneInput = requestForm.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value[0] === '7' || value[0] === '8') value = value.substring(1);
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

        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.querySelector('#name');
            const phone = this.querySelector('#phone');
            const car = this.querySelector('#car');
            let errors = [];

            if (!name || !name.value.trim()) {
                errors.push('Введите ваше имя');
                if (name) name.style.borderColor = 'var(--primary)';
            } else if (name) name.style.borderColor = '';

            if (!phone || !phone.value.trim()) {
                errors.push('Введите номер телефона');
                if (phone) phone.style.borderColor = 'var(--primary)';
            } else if (phone.value.replace(/\D/g, '').length < 10) {
                errors.push('Введите корректный номер телефона');
                if (phone) phone.style.borderColor = 'var(--primary)';
            } else if (phone) phone.style.borderColor = '';

            if (!car || !car.value.trim()) {
                errors.push('Введите марку и модель автомобиля');
                if (car) car.style.borderColor = 'var(--primary)';
            } else if (car) car.style.borderColor = '';

            if (errors.length === 0) {
                if (typeof sendToTelegram === 'function') {
                    sendToTelegram(this);
                } else {
                    showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                    this.reset();
                    [name, phone, car].forEach(input => { if (input) input.style.borderColor = ''; });
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
            document.querySelectorAll('.accordion-item.active').forEach(activeItem => {
                if (activeItem !== item) activeItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // =================== УВЕДОМЛЕНИЯ ===================
    window.showNotification = function(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(n => n.remove());
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) notification.parentNode.removeChild(notification);
            }, 300);
        }, 5000);
    };

    // =================== ГАЛЕРЕЯ ===================
    function initGallery() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) console.log('Открыть изображение:', img.src);
            });
        });
    }
    initGallery();

    // =================== ОБРАБОТКА ОШИБОК ЗАГРУЗКИ ИЗОБРАЖЕНИЙ ===================
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Не удалось загрузить изображение:', this.src);
        });
    });
});
