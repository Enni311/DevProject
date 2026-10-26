document.addEventListener('DOMContentLoaded', () => {
    const pagesTrack = document.getElementById('pages-track');
    const pageViews = document.querySelectorAll('.page-view');
    let currentIndex = 1;
    const maxIndex = pageViews.length;
    let isScrollLocked = false;

    // Перемикання на вибрану сторінку за індексом (1-4)
    function switchPage(targetIndex) {
        if (targetIndex < 1 || targetIndex > maxIndex) return;

        currentIndex = targetIndex;
        const shiftPercent = (currentIndex - 1) * 25;

        // Зсув треку
        if (pagesTrack) {
            pagesTrack.style.transform = `translateX(-${shiftPercent}%)`;
        }

        // Оновлення активного стану для ефектів
        pageViews.forEach((view, idx) => {
            if (idx + 1 === currentIndex) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        // Оновлення активної кнопки меню
        document.querySelectorAll('[data-nav]').forEach(el => {
            if (parseInt(el.getAttribute('data-nav')) === currentIndex) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
    }

    // 1. МИТТЄВА ПРОКРУТКА З ПЕРШОГО КЛІКУ КОЛЕСИКА
    window.addEventListener('wheel', (e) => {
        // Якщо відкрито модальне вікно — не перемикаємо сторінки
        if (document.querySelector('.modal-overlay.active')) return;

        // Якщо сторінка вже в процесі анімації переходу — ігноруємо подальші рухи колесика
        if (isScrollLocked) return;

        // Регулюємо чутливість (достатньо найменшого відхилення deltaY > 1 або < -1)
        if (Math.abs(e.deltaY) > 1) {
            if (e.deltaY > 0 && currentIndex < maxIndex) {
                // Прокрутка вниз/вперед -> наступна сторінка
                switchPage(currentIndex + 1);
                lockScroll();
            } else if (e.deltaY < 0 && currentIndex > 1) {
                // Прокрутка вгору/назад -> попередня сторінка
                switchPage(currentIndex - 1);
                lockScroll();
            }
        }
    }, { passive: true });

    function lockScroll() {
        isScrollLocked = true;
        // Блокуємо повторне спрацьовування на 600мс (поки іде анімація слайда)
        setTimeout(() => {
            isScrollLocked = false;
        }, 600);
    }

    // 2. СВАЙПИ ДЛЯ ТАЧПАДІВ ТА СЕНСОРНИХ ЕКРАНІВ
    let touchStartX = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (isScrollLocked) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;

        if (Math.abs(diffX) > 40) {
            if (diffX > 0 && currentIndex < maxIndex) {
                switchPage(currentIndex + 1);
                lockScroll();
            } else if (diffX < 0 && currentIndex > 1) {
                switchPage(currentIndex - 1);
                lockScroll();
            }
        }
    }, { passive: true });

    // 3. КЛІК ПО КНОПКАХ НАВІГАЦІЇ
    document.addEventListener('click', (e) => {
        const navEl = e.target.closest('[data-nav]');
        if (navEl) {
            e.preventDefault();
            const targetIndex = parseInt(navEl.getAttribute('data-nav'));
            switchPage(targetIndex);
        }
    });

    // 4. УПРАВЛІННЯ МОДАЛЬНИМ ВІКНОМ
    const modal = document.getElementById('order-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    document.addEventListener('click', (e) => {
        if (e.target.closest('.open-modal-btn')) {
            e.preventDefault();
            modal.classList.add('active');
        }
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});