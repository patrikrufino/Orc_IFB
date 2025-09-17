
lucide.createIcons();

async function loadTranslations(lang) {
    // Cache settings
    const CACHE_PREFIX = "site_translations_";
    const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

    // Try localStorage cache first
    try {
        const stored = localStorage.getItem(CACHE_PREFIX + lang);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (!parsed.ts || Date.now() - parsed.ts < CACHE_TTL_MS) {
                // populate in-memory cache for this session
                translationsCache[lang] = parsed.data;
                return parsed.data;
            }
        }
    } catch (e) {
        // localStorage may be unavailable; fall back to network
    }

    const relativeCandidates = [
        `/i18n/${lang}.json`,
        `i18n/${lang}.json`,
        `./i18n/${lang}.json`,
    ];

    const candidates = relativeCandidates.map((p) => {
        try {
            return new URL(p, window.location.href).href;
        } catch (e) {
            return p;
        }
    });

    // também tenta um fallback absoluto para public (não depende de base href)
    candidates.push(`${window.location.origin}/public/i18n/${lang}.json`);

    for (const url of candidates) {
        try {
            const res = await fetch(url, { cache: "no-cache" });
            if (!res.ok) continue;
            const json = await res.json();
            // save to localStorage for future loads (best-effort)
            try {
                const payload = JSON.stringify({ ts: Date.now(), data: json });
                localStorage.setItem(CACHE_PREFIX + lang, payload);
            } catch (e) {
                // silent fail on storage issues
            }
            // update in-memory cache
            translationsCache[lang] = json;
            return json;
        } catch (err) {
            // ignora e tenta o próximo
            continue;
        }
    }

    console.warn(`Não foi possível carregar traduções para '${lang}'. Verifique se os arquivos em /i18n/ existem.`);
    return null;
}
// Cache local das traduções já carregadas
const translationsCache = { pt: null, en: null };

async function setLanguage(lang) {
    document.documentElement.lang = lang === "en" ? "en-US" : "pt-BR";

    // Carregar traduções (cache primeiro)
    if (!translationsCache[lang]) {
        translationsCache[lang] = await loadTranslations(lang);
    }

    const translations = translationsCache[lang];
    if (translations) {
        document.querySelectorAll("[data-lang-key]").forEach((el) => {
            const key = el.dataset.langKey;
            if (translations[key]) {
                el.innerHTML = translations[key];
            }
        });
    } else {
        console.warn(`Nenhuma tradução disponível para '${lang}', mantendo texto atual.`);
    }

    // Update active flag
    document
        .getElementById("lang-pt")
        .classList.toggle("active", lang === "pt");
    document
        .getElementById("lang-en")
        .classList.toggle("active", lang === "en");
}

document.getElementById("lang-pt").addEventListener("click", () => setLanguage("pt"));
document.getElementById("lang-en").addEventListener("click", () => setLanguage("en"));

// Set initial language (tenta carregar JSON, senão mantém o texto hardcoded na página)
document.addEventListener("DOMContentLoaded", async () => {
    // Detectar idioma do navegador e tentar carregar a tradução correspondente
    const nav = (navigator.language || navigator.userLanguage || "pt").toLowerCase();
    const preferred = nav.startsWith("en") ? "en" : nav.startsWith("pt") ? "pt" : "pt";
    await setLanguage(preferred);
});

// Efeitos Parallax
class ParallaxController {
    constructor() {
        this.lastScrollY = 0;
        this.ticking = false;
        this.isMobile = window.innerWidth <= 768;
        this.parallaxElements =
            document.querySelectorAll(".parallax-element");
        this.animateElements =
            document.querySelectorAll(".animate-on-scroll");

        this.init();
    }

    init() {
        // Detectar dispositivo móvel e ajustar comportamento
        this.detectMobile();

        // Inicializar IntersectionObserver para animações de entrada
        this.setupIntersectionObserver();

        // Listener de scroll para parallax (desabilitar em móveis para performance)
        if (!this.isMobile) {
            window.addEventListener(
                "scroll",
                () => this.requestParallaxUpdate(),
                { passive: true }
            );
        }

        // Listener para redimensionamento
        window.addEventListener("resize", () => this.handleResize(), {
            passive: true,
        });

        // Aplicar efeito inicial
        this.updateParallax();

        // Verificar elementos visíveis no carregamento
        this.checkVisibleElements();
    }

    detectMobile() {
        this.isMobile =
            window.innerWidth <= 768 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );

        // Adicionar classe ao body para ajustes CSS se necessário
        if (this.isMobile) {
            document.body.classList.add("mobile-device");
        } else {
            document.body.classList.remove("mobile-device");
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.detectMobile();

        // Se mudou de desktop para mobile ou vice-versa, reinicializar
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                // Reset transforms em mobile
                this.parallaxElements.forEach((element) => {
                    element.style.transform = "";
                });
            } else {
                // Reativar parallax em desktop
                window.addEventListener(
                    "scroll",
                    () => this.requestParallaxUpdate(),
                    { passive: true }
                );
            }
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: "-5% 0px -5% 0px",
            threshold: [0.1, 0.3, 0.7],
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Adicionar delay baseado no atributo style
                    const element = entry.target;
                    const style = element.getAttribute("style");
                    const delayMatch =
                        style && style.match(/animation-delay:\s*([0-9.]+)s/);
                    const delay = delayMatch ? parseFloat(delayMatch[1]) * 1000 : 0;

                    setTimeout(() => {
                        element.classList.add("visible");
                    }, delay);
                }
            });
        }, options);

        this.animateElements.forEach((element) => {
            this.observer.observe(element);
        });
    }

    requestParallaxUpdate() {
        if (this.isMobile) return; // Skip em mobile

        this.lastScrollY = window.scrollY;

        if (!this.ticking) {
            requestAnimationFrame(() => this.updateParallax());
            this.ticking = true;
        }
    }

    updateParallax() {
        if (this.isMobile) {
            this.ticking = false;
            return;
        }

        const scrollY = this.lastScrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Parallax do fundo - movimento mais sutil
        const backgroundSpeed = Math.min(scrollY * 0.3, documentHeight * 0.1);
        document.body.style.setProperty(
            "--bg-transform",
            `translateY(${backgroundSpeed}px)`
        );

        // Aplicar parallax nos elementos
        this.parallaxElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementHeight = rect.height;
            const elementBottom = elementTop + elementHeight;

            // Verificar se o elemento está próximo da viewport para melhor performance
            if (elementBottom >= -200 && elementTop <= windowHeight + 200) {
                let translateY = 0;

                // Diferentes efeitos para diferentes tipos de elementos
                if (element.classList.contains("parallax-header")) {
                    // Header move mais devagar que o scroll
                    translateY = scrollY * -0.2;
                } else if (element.classList.contains("parallax-card")) {
                    // Cards com movimento baseado na posição relativa
                    const cardIndex = Array.from(
                        document.querySelectorAll(".parallax-card")
                    ).indexOf(element);
                    const elementCenter = elementTop + elementHeight / 2;
                    const viewportCenter = windowHeight / 2;
                    const distanceFromCenter =
                        (viewportCenter - elementCenter) / windowHeight;

                    translateY = distanceFromCenter * 20 + cardIndex * 5;
                } else if (element.classList.contains("parallax-section")) {
                    // Seções com movimento sutil
                    const elementCenter = elementTop + elementHeight / 2;
                    const viewportCenter = windowHeight / 2;
                    const distanceFromCenter =
                        (viewportCenter - elementCenter) / windowHeight;

                    translateY = distanceFromCenter * 15;
                }

                // Aplicar transform com limite para evitar movimentos excessivos
                const limitedTranslateY = Math.max(
                    -100,
                    Math.min(100, translateY)
                );
                element.style.transform = `translateY(${limitedTranslateY}px)`;
            }
        });

        this.ticking = false;
    }

    checkVisibleElements() {
        // Verificar elementos que já estão visíveis no carregamento
        this.animateElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
                const style = element.getAttribute("style");
                const delayMatch =
                    style && style.match(/animation-delay:\s*([0-9.]+)s/);
                const delay = delayMatch ? parseFloat(delayMatch[1]) * 1000 : 0;

                setTimeout(() => {
                    element.classList.add("visible");
                }, delay);
            }
        });
    }
}

// Aplicar efeito parallax ao pseudo-elemento do body via CSS custom properties
const style = document.createElement("style");
style.textContent = `
            body::before {
                transform: translateY(var(--bg-transform, 0px));
            }
        `;
document.head.appendChild(style);

// Inicializar parallax quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
    new ParallaxController();
});

// Se a página já estiver carregada
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        new ParallaxController();
    });
} else {
    new ParallaxController();
}