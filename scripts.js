
/* =========================================
   SPORTS PHOTOGRAPHY
   PROFESSIONAL WEBSITE
   SCRIPT.JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       01. ELEMENTS
    ===================================== */

    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("navigation");

    const navLinks = document.querySelectorAll(".nav-link");
    const filterButtons = document.querySelectorAll(".filter-button");
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    const portfolioImages = document.querySelectorAll(".portfolio-image");

    const contactForm = document.getElementById("contact-form");
    const formFeedback = document.getElementById("form-feedback");

    const currentYear = document.getElementById("current-year");


    /* =====================================
       02. CURRENT YEAR
    ===================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================
       03. MOBILE MENU
    ===================================== */

    function openMenu() {

        if (!navigation || !menuToggle) return;

        navigation.classList.add("open");
        menuToggle.classList.add("active");

        document.body.classList.add("menu-open");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");

    }


    function closeMenu() {

        if (!navigation || !menuToggle) return;

        navigation.classList.remove("open");
        menuToggle.classList.remove("active");

        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

    }


    if (menuToggle && navigation) {

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", () => {

            const isOpen = navigation.classList.contains("open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });


        // Fecha ao clicar em um link

        navLinks.forEach(link => {

            link.addEventListener("click", closeMenu);

        });


        // Fecha ao clicar fora do menu

        document.addEventListener("click", event => {

            const clickedInsideMenu = navigation.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (
                navigation.classList.contains("open") &&
                !clickedInsideMenu &&
                !clickedToggle
            ) {
                closeMenu();
            }

        });


        // Fecha ao pressionar ESC

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });


        // Fecha ao mudar para desktop

        window.addEventListener("resize", () => {

            if (window.innerWidth > 768) {
                closeMenu();
            }

        });

    }


    /* =====================================
       04. HEADER SCROLL EFFECT
    ===================================== */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* =====================================
       05. PORTFOLIO FILTERS
    ===================================== */

    if (filterButtons.length && portfolioItems.length) {

        filterButtons.forEach(button => {

            button.addEventListener("click", () => {

                const selectedCategory = button.dataset.filter;

                filterButtons.forEach(filter => {

                    filter.classList.remove("active");

                    filter.setAttribute("aria-pressed", "false");

                });


                button.classList.add("active");

                button.setAttribute("aria-pressed", "true");


                portfolioItems.forEach(item => {

                    const itemCategory = item.dataset.category;

                    const shouldShow =
                        selectedCategory === "all" ||
                        selectedCategory === itemCategory;


                    if (shouldShow) {

                        item.classList.remove("hidden");

                    } else {

                        item.classList.add("hidden");

                    }

                });

            });


            button.setAttribute(
                "aria-pressed",
                button.classList.contains("active") ? "true" : "false"
            );

        });

    }


    /* =====================================
       06. PORTFOLIO LIGHTBOX
    ===================================== */

    let currentImageIndex = 0;
    let visibleImages = [];


    const lightbox = document.createElement("div");

    lightbox.className = "lightbox";

    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Photograph viewer");
    lightbox.setAttribute("aria-hidden", "true");


    lightbox.innerHTML = `

        <button class="lightbox-close" aria-label="Close image viewer">
            &times;
        </button>

        <button class="lightbox-prev" aria-label="Previous photograph">
            &#10094;
        </button>

        <div class="lightbox-content">

            <img src="" alt="">

            <p class="lightbox-caption"></p>

        </div>

        <button class="lightbox-next" aria-label="Next photograph">
            &#10095;
        </button>

    `;


    document.body.appendChild(lightbox);


    const lightboxImage = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");

    const closeLightboxButton = lightbox.querySelector(".lightbox-close");
    const previousButton = lightbox.querySelector(".lightbox-prev");
    const nextButton = lightbox.querySelector(".lightbox-next");


    function updateVisibleImages() {

        visibleImages = Array.from(portfolioImages).filter(link => {

            const item = link.closest(".portfolio-item");

            return item && !item.classList.contains("hidden");

        });

    }


    function showLightboxImage(index) {

        if (!visibleImages.length) return;

        currentImageIndex =
            (index + visibleImages.length) % visibleImages.length;

        const selectedLink = visibleImages[currentImageIndex];

        const selectedImage = selectedLink.querySelector("img");

        const imageSource = selectedLink.getAttribute("href");

        if (!selectedImage || !imageSource) return;

        lightboxImage.src = imageSource;
        lightboxImage.alt = selectedImage.alt || "Sports photograph";

        lightboxCaption.textContent =
            selectedImage.alt || "Sports photography";

    }


    function openLightbox(index) {

        updateVisibleImages();

        if (!visibleImages.length) return;

        showLightboxImage(index);

        lightbox.classList.add("active");

        lightbox.setAttribute("aria-hidden", "false");

        document.body.classList.add("menu-open");

        closeLightboxButton.focus();

    }


    function closeLightbox() {

        lightbox.classList.remove("active");

        lightbox.setAttribute("aria-hidden", "true");

        document.body.classList.remove("menu-open");

        lightboxImage.removeAttribute("src");

    }


    portfolioImages.forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            updateVisibleImages();

            const selectedIndex = visibleImages.indexOf(link);

            if (selectedIndex !== -1) {
                openLightbox(selectedIndex);
            }

        });

    });


    closeLightboxButton.addEventListener("click", closeLightbox);


    previousButton.addEventListener("click", () => {

        showLightboxImage(currentImageIndex - 1);

    });


    nextButton.addEventListener("click", () => {

        showLightboxImage(currentImageIndex + 1);

    });


    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });


    // Navegação por teclado

    document.addEventListener("keydown", event => {

        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            showLightboxImage(currentImageIndex + 1);
        }

        if (event.key === "ArrowLeft") {
            showLightboxImage(currentImageIndex - 1);
        }

    });


    /* =====================================
       07. NAVIGATION ACTIVE SECTION
    ===================================== */

    const sections = document.querySelectorAll("main section[id]");


    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const sectionId = entry.target.id;

                        navLinks.forEach(link => {

                            link.classList.toggle(
                                "active",
                                link.getAttribute("href") === `#${sectionId}`
                            );

                        });

                    }

                });

            },

            {
                rootMargin: "-30% 0px -60% 0px"
            }

        );


        sections.forEach(section => {

            sectionObserver.observe(section);

        });

    }


    /* =====================================
       08. CONTACT FORM
    ===================================== */

    if (contactForm) {

        contactForm.addEventListener("submit", event => {

            event.preventDefault();

            if (!contactForm.reportValidity()) {
                return;
            }

            const formData = new FormData(contactForm);

            const name = (formData.get("name") || "").trim();
            const email = (formData.get("email") || "").trim();
            const subject = formData.get("subject") || "";
            const message = (formData.get("message") || "").trim();


            if (!name || !email || !subject || !message) {

                if (formFeedback) {
                    formFeedback.textContent =
                        "Please complete all fields.";
                }

                return;

            }


            /*
              Replace with your real email address.
              This opens the visitor's default email application.
            */

            const recipient = "your@email.com";

            const emailSubject = encodeURIComponent(
                `Photography enquiry: ${subject}`
            );

            const emailBody = encodeURIComponent(

                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Project: ${subject}\n\n` +
                `Message:\n${message}`

            );


            if (formFeedback) {
                formFeedback.textContent =
                    "Opening your email application...";
            }


            window.location.href =
                `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

        });

    }


    /* =====================================
       09. SMOOTH ANCHOR NAVIGATION
    ===================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", event => {

            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            let target;

            try {
                target = document.querySelector(targetId);
            } catch {
                return;
            }

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({

                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",

                block: "start"

            });

        });

    });


    /* =====================================
       10. IMAGE ERROR HANDLING
    ===================================== */

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            image.classList.add("image-error");

            image.setAttribute(
                "aria-label",
                "Photograph currently unavailable"
            );

        });

    });


    /* =====================================
       11. SCROLL REVEAL EFFECTS
    ===================================== */

    const revealElements = document.querySelectorAll(

        ".section-heading, " +
        ".intro-content, " +
        ".portfolio-item, " +
        ".about-image, " +
        ".about-content, " +
        ".service-card, " +
        ".contact-cta-content, " +
        ".contact-information, " +
        ".contact-form"

    );


    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("revealed");

                        revealObserver.unobserve(entry.target);

                    }

                });

            },

            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }

        );


        revealElements.forEach(element => {

            element.classList.add("reveal");

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("revealed");

        });

    }


    /* =====================================
       12. HERO PARALLAX EFFECT
    ===================================== */

    const heroBackground = document.querySelector(".hero-background");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


    if (heroBackground && !reducedMotion.matches) {

        let ticking = false;

        window.addEventListener("scroll", () => {

            if (ticking) return;

            ticking = true;

            window.requestAnimationFrame(() => {

                const scrollPosition = window.scrollY;

                if (scrollPosition < window.innerHeight) {

                    heroBackground.style.transform =
                        `translateY(${scrollPosition * 0.25}px)`;

                }

                ticking = false;

            });

        }, { passive: true });

    }


    /* =====================================
       13. PORTFOLIO HOVER EFFECT
    ===================================== */

    portfolioItems.forEach(item => {

        item.addEventListener("mouseenter", () => {

            item.classList.add("hovered");

        });


        item.addEventListener("mouseleave", () => {

            item.classList.remove("hovered");

        });

    });


    /* =====================================
       14. LIGHTBOX CLEANUP
    ===================================== */

    // Evita que o lightbox e o menu fiquem abertos
    // simultaneamente.

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", () => {

            if (lightbox.classList.contains("active")) {
                closeLightbox();
            }

        });

    }


    /* =====================================
       15. INITIALIZATION
    ===================================== */

    updateHeader();

    updateVisibleImages();

    console.log(
        "Sports Photography Website initialized successfully."
    );

});


/* =========================================
   END OF SCRIPT.JS
========================================= */
