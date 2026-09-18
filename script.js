document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Mobile Menu with Back Button Integration ---
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    function openMenu() {
        navMenu.classList.add("active");
        history.pushState({ menuOpen: true }, "");
    }

    function closeMenu() {
        navMenu.classList.remove("active");
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            if (navMenu.classList.contains("active")) {
                closeMenu();
                if (history.state && history.state.menuOpen) {
                    history.back();
                }
            } else {
                openMenu();
            }
        });

        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => closeMenu());
        });

        window.addEventListener("popstate", () => {
            if (navMenu.classList.contains("active")) {
                closeMenu();
            }
        });
    }

    // --- 2. Fixed Typewriter Animation (No Scrambled/Overlapping Text) ---
    function typeWriter(element, text, speed = 35) {
        // Purana ongoing timeout clear karo taaki multiple loops overlap na ho
        if (element.typingTimeout) {
            clearTimeout(element.typingTimeout);
        }

        let i = 0;
        element.innerHTML = "";
        element.classList.add("typing-cursor");

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                element.typingTimeout = setTimeout(type, speed);
            } else {
                element.classList.remove("typing-cursor");
            }
        }
        type();
    }

    const headingObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const textToType = el.getAttribute("data-text");
                if (textToType) {
                    typeWriter(el, textToType, 35);
                }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll(".dynamic-heading").forEach(h => headingObserver.observe(h));

    // --- 3. Dynamic Number Counter ---
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute("data-target"));
                let count = 0;
                const speed = target / 50;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count);
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll(".counter").forEach(c => counterObserver.observe(c));

    // --- 4. Hero Banner Swiper (Clean Transition Call) ---
    if (document.querySelector(".hero-swiper")) {
        new Swiper(".hero-swiper", {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            on: {
                slideChangeTransitionStart: function () {
                    const activeSlide = this.slides[this.activeIndex];
                    const heading = activeSlide.querySelector(".dynamic-heading");
                    if (heading) {
                        const text = heading.getAttribute("data-text");
                        typeWriter(heading, text, 35);
                    }
                }
            }
        });
    }

    // --- 5. Dynamic Reviews Swiper Slider ---
    if (document.querySelector(".reviews-swiper")) {
        new Swiper(".reviews-swiper", {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            slidesPerView: 1,
            spaceBetween: 20,
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 25 }
            },
            pagination: {
                el: ".reviews-pagination",
                clickable: true,
            }
        });
    }

    // --- 6. Scroll Reveals ---
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("revealed");
                }, index * 90);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".dynamic-write").forEach(card => cardObserver.observe(card));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
});

// --- 7. Modal & WhatsApp Direct Redirect ---
function openAppointmentModal(serviceName = "General Consultation") {
    const modal = document.getElementById("appointmentModal");
    const serviceInput = document.getElementById("selectedServiceInput");
    
    if (serviceInput) {
        serviceInput.value = serviceName;
    }
    
    if (modal) {
        modal.classList.add("active");
    }
}

function closeAppointmentModal() {
    const modal = document.getElementById("appointmentModal");
    if (modal) {
        modal.classList.remove("active");
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById("patientName").value;
    const phone = document.getElementById("patientPhone").value;
    const service = document.getElementById("selectedServiceInput").value;
    const date = document.getElementById("appointmentDate").value;

    const message = `Hello Dr. Ram Niwas Vishnoi,\nI would like to book an appointment at Luminaa Clinic Jodhpur.\n\n*Patient Details:*\n- *Name:* ${name}\n- *Phone:* ${phone}\n- *Treatment:* ${service}\n- *Preferred Date:* ${date}\n- *Timing Slot:* 4:30 PM - 8:30 PM`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappPhone = "919950673875";
    
    window.open(`https://wa.me/${whatsappPhone}?text=${encodedMessage}`, "_blank");
    closeAppointmentModal();
}