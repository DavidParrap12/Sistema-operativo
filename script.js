/**
 * Lógica interactiva para Micrositio de Gestión E/S
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Suave para enlaces de navegación
    document.querySelectorAll('a[href^="#"], button[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href') || this.dataset.href;
            if (!href || href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                // Compensar la altura del navbar fijo
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navegación con botones píldora usando atributos data-href
    const pillButtons = document.querySelectorAll('button[data-href]');
    pillButtons.forEach((btn) => {
        btn.addEventListener('click', function() {
            const targetElement = document.querySelector(this.dataset.href);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });


    // 2. Transparencia y Sombra de la barra de navegación al hacer scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('shadow-md');
            nav.classList.remove('shadow-sm');
        } else {
            nav.classList.add('shadow-sm');
            nav.classList.remove('shadow-md');
        }
    });

    // 3. Intersection Observer para animar las tarjetas al aparecer en pantalla
    const animatedElements = document.querySelectorAll('.edu-card, .section-anchor, table');
    
    // Configuración inicial (ocultar)
    animatedElements.forEach(el => {
        el.classList.add('opacity-0-init');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0-init');
                entry.target.classList.add('animate-fade-in-up');
                // Dejar de observar una vez que ya apareció
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // 4. Menú móvil (Toggle)
    const menuBtn = document.querySelector('nav .md\\:hidden');
    const navLinks = document.querySelector('nav .hidden.lg\\:flex');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            const isHidden = navLinks.classList.contains('hidden');
            
            if (isHidden) {
                // Mostrar menú
                navLinks.classList.remove('hidden', 'lg:flex');
                navLinks.classList.add('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-white', 'p-6', 'shadow-xl', 'border-t', 'border-gray-100');
            } else {
                // Ocultar menú
                navLinks.classList.add('hidden', 'lg:flex');
                navLinks.classList.remove('flex', 'flex-col', 'absolute', 'top-full', 'left-0', 'w-full', 'bg-white', 'p-6', 'shadow-xl', 'border-t', 'border-gray-100');
            }
        });
    }
});