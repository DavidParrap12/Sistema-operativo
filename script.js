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

    // ========================================
    // 5. CONTADORES ANIMADOS
    // ========================================
    function animateCounter(counterEl) {
        const valueEl = counterEl.querySelector('.counter-value');
        const target = parseInt(counterEl.dataset.target, 10);
        const barPercent = parseInt(counterEl.dataset.bar, 10);
        const barFill = counterEl.closest('.bg-surface-container')?.querySelector('.counter-bar-fill');
        
        if (!valueEl || isNaN(target)) return;

        const duration = 1800; // ms
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentValue = Math.round(easedProgress * target);

            valueEl.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);

        // Animar la barra de progreso
        if (barFill && !isNaN(barPercent)) {
            setTimeout(() => {
                barFill.style.width = barPercent + '%';
            }, 100);
        }
    }

    // Observer para los contadores
    const metricsGrid = document.getElementById('metrics-grid');
    if (metricsGrid) {
        let countersAnimated = false;
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    const counters = metricsGrid.querySelectorAll('.metric-counter');
                    counters.forEach((counter, index) => {
                        // Escalonar las animaciones
                        setTimeout(() => {
                            animateCounter(counter);
                        }, index * 200);
                    });
                    metricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        metricsObserver.observe(metricsGrid);
    }

    // ========================================
    // 6. DIAGRAMA INTERACTIVO DE CAPAS
    // ========================================
    const layerDiagram = document.getElementById('layer-diagram');
    if (layerDiagram) {
        const layerItems = layerDiagram.querySelectorAll('.layer-item');

        layerItems.forEach(item => {
            item.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Cerrar todas las capas
                layerItems.forEach(li => li.classList.remove('active'));
                
                // Si no estaba activa, abrirla
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
});