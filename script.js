// ============================================================
// script.js - Gestión de E/S: Micrositio Educativo
// Funcionalidades: scroll suave, resaltado de navegación,
// tooltips dinámicos, efectos de entrada y pequeños toques interactivos.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    // --------------------------------------------------------
    // 1. SCROLL SUAVE PARA TODOS LOS ENLACES INTERNOS (anclas #)
    // --------------------------------------------------------
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
                // Pequeño efecto visual: cambiar temporalmente el color del fondo del destino
                targetElement.style.transition = 'background 0.3s';
                targetElement.style.background = '#fff5e0';
                setTimeout(() => {
                    targetElement.style.background = '';
                }, 800);
            }
        });
    });

    // --------------------------------------------------------
    // 2. RESALTADO DE SECCIÓN ACTIVA EN NAVEGACIÓN (mientras se hace scroll)
    // --------------------------------------------------------
    const sections = document.querySelectorAll('.section-card, .hero'); // hero incluido por coherencia
    const navBtns = document.querySelectorAll('.nav-btn');

    function highlightActiveSection() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset para detectar antes de que llegue arriba del todo

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navBtns.forEach(btn => {
            const href = btn.getAttribute('href');
            if (href && href.substring(1) === currentSectionId) {
                btn.style.background = '#d4eaf2';
                btn.style.borderColor = '#2c7da0';
                btn.style.fontWeight = '700';
                btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            } else {
                btn.style.background = '';
                btn.style.borderColor = '#dce9f0';
                btn.style.fontWeight = '400';
                btn.style.boxShadow = '';
            }
        });
    }

    // ejecutar al cargar y al hacer scroll
    window.addEventListener('scroll', highlightActiveSection);
    window.addEventListener('resize', highlightActiveSection);
    highlightActiveSection();

    // --------------------------------------------------------
    // 3. TOOLTIP INTERACTIVO: mostrar un dato curioso al pasar sobre las tarjetas de funciones
    //    (pequeño extra educativo)
    // --------------------------------------------------------
    const tooltipData = {
        "Control de dispositivos": "⚙️ Los sistemas modernos manejan colas de E/S con algoritmos como FCFS, SSTF o C-SCAN.",
        "Buffering": "📦 El buffer de entrada/salida reduce la fragmentación y mejora el rendimiento en streaming.",
        "Spooling": "🖨️ SPOOL = Simultaneous Peripheral Operations On-Line. Se usa mucho en impresión y trabajos batch.",
        "Manejo de interrupciones": "🔔 Una interrupción puede tener prioridades: NMI (no maskable) frente a IRQ normales.",
        "Control de errores": "⚠️ Los controladores implementan CRC o checksums para detectar corrupción en transferencias.",
        "Controladores / Drivers": "💿 Los drivers trabajan en modo kernel para acceso directo a hardware.",
        "BIOS (Basic Input/Output System)": "🔌 La BIOS moderna (UEFI) ofrece gestión básica de E/S antes del arranque del SO.",
        "DMA (Acceso Directo a Memoria)": "⚡ DMA permite transferencias sin CPU, liberando recursos para cómputo intensivo."
    };

    // Buscar elementos que tengan un <h3> dentro de .info-box y agregar tooltip (solo para temas clave)
    const infoBoxes = document.querySelectorAll('.info-box');
    infoBoxes.forEach(box => {
        const titleElem = box.querySelector('h3');
        if (titleElem) {
            const titleText = titleElem.innerText.trim();
            if (tooltipData[titleText]) {
                // Crear ícono de tooltip informativo
                const tooltipSpan = document.createElement('span');
                tooltipSpan.className = 'custom-tooltip-icon';
                tooltipSpan.innerHTML = ' <i class="fas fa-info-circle" style="font-size:0.8rem; color:#2c7da0; cursor:help;"></i>';
                tooltipSpan.style.position = 'relative';
                tooltipSpan.style.display = 'inline-block';
                tooltipSpan.style.marginLeft = '6px';
                
                // Crear tooltip flotante (div oculto)
                const tooltipTextDiv = document.createElement('div');
                tooltipTextDiv.className = 'tooltip-bubble';
                tooltipTextDiv.innerHTML = tooltipData[titleText];
                tooltipTextDiv.style.position = 'absolute';
                tooltipTextDiv.style.bottom = '150%';
                tooltipTextDiv.style.left = '50%';
                tooltipTextDiv.style.transform = 'translateX(-50%)';
                tooltipTextDiv.style.backgroundColor = '#1a2c3e';
                tooltipTextDiv.style.color = '#f0f9ff';
                tooltipTextDiv.style.padding = '6px 12px';
                tooltipTextDiv.style.borderRadius = '20px';
                tooltipTextDiv.style.fontSize = '0.7rem';
                tooltipTextDiv.style.fontWeight = '400';
                tooltipTextDiv.style.whiteSpace = 'nowrap';
                tooltipTextDiv.style.zIndex = '100';
                tooltipTextDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                tooltipTextDiv.style.pointerEvents = 'none';
                tooltipTextDiv.style.opacity = '0';
                tooltipTextDiv.style.transition = 'opacity 0.2s ease';
                tooltipTextDiv.style.fontFamily = 'Inter, sans-serif';
                tooltipTextDiv.style.letterSpacing = '0.2px';
                tooltipSpan.appendChild(tooltipTextDiv);
                titleElem.appendChild(tooltipSpan);
                
                // Eventos hover
                tooltipSpan.addEventListener('mouseenter', () => {
                    tooltipTextDiv.style.opacity = '1';
                });
                tooltipSpan.addEventListener('mouseleave', () => {
                    tooltipTextDiv.style.opacity = '0';
                });
            }
        }
    });

    // --------------------------------------------------------
    // 4. EFECTO "TYPEWRITER" EN EL PARRAFO DE HERO (solo por diversión)
    //    pero lo haremos sutil: al cargar la página, mostrar el texto original pero con animación de fade?
    //    Mejor efecto de resaltado gradual en el título principal.
    //    Decidí añadir una pequeña animación de entrada para las tarjetas (aparición suave)
    // --------------------------------------------------------
    const cards = document.querySelectorAll('.section-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        card.style.transition = `opacity 0.35s ease-out, transform 0.35s ease-out`;
        // uso de IntersectionObserver para revelar al scrollear
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
        observer.observe(card);
    });
    
    // efecto para hero también
    const hero = document.querySelector('.hero');
    if(hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'scale(0.98)';
        hero.style.transition = 'opacity 0.5s ease, transform 0.4s ease';
        setTimeout(() => {
            hero.style.opacity = '1';
            hero.style.transform = 'scale(1)';
        }, 100);
    }
    
    // --------------------------------------------------------
    // 5. BOTÓN DE "VOLVER ARRIBA" QUE APARECE AL SCROLL
    //    mejora experiencia de navegación
    // --------------------------------------------------------
    const createScrollTopButton = () => {
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.id = 'scrollTopBtn';
        btn.style.position = 'fixed';
        btn.style.bottom = '25px';
        btn.style.right = '25px';
        btn.style.zIndex = '99';
        btn.style.border = 'none';
        btn.style.outline = 'none';
        btn.style.backgroundColor = '#1c4e6e';
        btn.style.color = 'white';
        btn.style.cursor = 'pointer';
        btn.style.padding = '12px 15px';
        btn.style.borderRadius = '50px';
        btn.style.fontSize = '18px';
        btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        btn.style.transition = 'opacity 0.3s, background 0.2s';
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
        btn.style.border = '1px solid rgba(255,255,255,0.3)';
        
        document.body.appendChild(btn);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
            }
        });
        
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = '#2c7da0';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = '#1c4e6e';
        });
    };
    createScrollTopButton();

    // --------------------------------------------------------
    // 6. PEQUEÑA INTERACTIVIDAD EN TABLAS: resaltar fila al pasar el mouse
    // --------------------------------------------------------
    const tables = document.querySelectorAll('.tech-table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.backgroundColor = '#f1f9fe';
                row.style.transition = '0.1s';
            });
            row.addEventListener('mouseleave', () => {
                row.style.backgroundColor = '';
            });
        });
    });
    
    // --------------------------------------------------------
    // 7. MOSTRAR UNA NOTIFICACIÓN AMIGABLE AL USUARIO SOBRE EL MODO DE NAVEGACIÓN (opcional)
    //    Solo una vez cada sesión usando sessionStorage
    // --------------------------------------------------------
    if (!sessionStorage.getItem('eios_tip_shown')) {
        const tipMsg = document.createElement('div');
        tipMsg.innerText = '💡 Tip: Puedes usar los botones de navegación superior para moverte rápido.';
        tipMsg.style.position = 'fixed';
        tipMsg.style.bottom = '80px';
        tipMsg.style.right = '25px';
        tipMsg.style.backgroundColor = '#2c7da0';
        tipMsg.style.color = 'white';
        tipMsg.style.padding = '8px 16px';
        tipMsg.style.borderRadius = '40px';
        tipMsg.style.fontSize = '0.8rem';
        tipMsg.style.fontWeight = '500';
        tipMsg.style.zIndex = '98';
        tipMsg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        tipMsg.style.opacity = '0';
        tipMsg.style.transition = 'opacity 0.5s';
        tipMsg.style.backdropFilter = 'blur(4px)';
        tipMsg.style.background = 'rgba(28, 78, 110, 0.92)';
        document.body.appendChild(tipMsg);
        
        setTimeout(() => {
            tipMsg.style.opacity = '1';
            setTimeout(() => {
                tipMsg.style.opacity = '0';
                setTimeout(() => {
                    if(tipMsg.parentNode) tipMsg.remove();
                }, 800);
            }, 4000);
        }, 600);
        sessionStorage.setItem('eios_tip_shown', 'true');
    }
    
    // --------------------------------------------------------
    // 8. PEQUEÑO AJUSTE: Asegurar que las tablas tengan clase .tech-table (ya están en HTML, pero lo dejamos)
    //    y evitar conflictos con el ancho en móviles
    // --------------------------------------------------------
    function checkTablesResponsive() {
        const allTables = document.querySelectorAll('table');
        allTables.forEach(tbl => {
            if (!tbl.closest('.section-card')) return;
            const wrapper = tbl.parentElement;
            if (window.innerWidth < 640 && !tbl.hasAttribute('data-wrapped')) {
                tbl.style.display = 'block';
                tbl.style.overflowX = 'auto';
                tbl.setAttribute('data-wrapped', 'true');
            } else if (window.innerWidth >= 640 && tbl.hasAttribute('data-wrapped')) {
                tbl.style.display = '';
                tbl.style.overflowX = '';
            }
        });
    }
    window.addEventListener('resize', checkTablesResponsive);
    checkTablesResponsive();
    

    console.log("Micrositio de Gestión de E/S cargado completamente (JS activo)");
});