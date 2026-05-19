document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }

  /* ----------------------------------------------------
     1. LOADER SYSTEM & BOOT SEQUENCER
     ---------------------------------------------------- */
  const loader = document.getElementById("loader");
  const percentEl = document.getElementById("loader-percent");
  const barEl = document.getElementById("loader-bar");
  const terminalEl = document.getElementById("loader-terminal");

  if (loader && percentEl && barEl && terminalEl) {
    const terminalMessages = [
      { text: "SYSTEM: Starting boot sequence...", time: 200 },
      { text: "SYSTEM: Loading core dependencies...", time: 600 },
      { text: "[OK] Core frameworks loaded successfully.", time: 900, type: "success" },
      { text: "SYSTEM: Connecting to remote ThreeJS systems...", time: 1300 },
      { text: "SYSTEM: Initializing vector engines & memory nodes...", time: 1700 },
      { text: "[OK] Agent pathways mapped and operational.", time: 2200, type: "success" },
      { text: "SYSTEM: Resolving digital developer persona...", time: 2500 },
      { text: "SYSTEM: Handshake complete. Welcome, Nithin.", time: 2800, type: "success" }
    ];

    // Boot sequence messages
    terminalMessages.forEach((msg) => {
      setTimeout(() => {
        const line = document.createElement("div");
        line.className = `terminal-line ${msg.type || ""}`;
        line.textContent = msg.text;
        terminalEl.appendChild(line);
        terminalEl.scrollTop = terminalEl.scrollHeight;
      }, msg.time);
    });

    // Increment progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        setTimeout(completeLoading, 400);
      }
      percentEl.textContent = `${progress}%`;
      barEl.style.width = `${progress}%`;
    }, 100);

    function completeLoading() {
      gsap.to(loader, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut",
        onComplete: () => {
          loader.style.display = "none";
          triggerEntryAnimations();
        }
      });
    }
  } else {
    // If no loader, trigger entry animations directly
    setTimeout(triggerEntryAnimations, 100);
  }

  /* ----------------------------------------------------
     2. GSAP ENTRY & SCROLL REVEALS
     ---------------------------------------------------- */
  function triggerEntryAnimations() {
    if (typeof gsap === 'undefined') return;

    // Navbar Entry
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      gsap.set(navbar, {
        opacity: 1,
        y: 0,
        clearProps: "transform"
      });
    }

    // Hero page entry animations
    if (document.querySelector(".hero")) {
      gsap.from(".hero-pretitle", {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: "power3.out"
      });

      gsap.from(".hero-title .glow-text", {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 1,
        delay: 0.2,
        ease: "power4.out"
      });

      gsap.from(".hero-role-wrapper", {
        opacity: 0,
        x: -30,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out"
      });

      gsap.from(".hero-tagline", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out"
      });

      gsap.from(".hero-ctas .btn", {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.8,
        delay: 0.8,
        ease: "power3.out"
      });
    }

    // Standard page specific entry animation (e.g. About, Projects headers)
    const headerTitle = document.querySelector(".section-title");
    if (headerTitle) {
      gsap.from(headerTitle, {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power2.out"
      });
    }

    // Scroll-triggered reveals for all section sub-elements with .animate-reveal
    const revealElements = document.querySelectorAll(".animate-reveal");
    revealElements.forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 45,
        duration: 1,
        ease: "power3.out"
      });
    });

    // Count Up animations
    const countUpStats = document.querySelectorAll(".count-up");
    countUpStats.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target"), 10);
      ScrollTrigger.create({
        trigger: stat,
        start: "top 90%",
        onEnter: () => {
          let obj = { count: 0 };
          gsap.to(obj, {
            count: target,
            duration: 2.5,
            ease: "power2.out",
            onUpdate: () => {
              stat.textContent = Math.floor(obj.count);
            }
          });
        }
      });
    });
  }

  /* ----------------------------------------------------
     3. TYPEWRITER (HERO ROLE SELECTOR)
     ---------------------------------------------------- */
  const roleTextEl = document.getElementById("role-text");
  if (roleTextEl) {
    const roles = ["AI Engineer", "Agent Architect", "Full Stack Developer", "Tech Explorer"];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeRoles() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        charIdx--;
        typeSpeed = 50;
      } else {
        charIdx++;
        typeSpeed = 120;
      }

      roleTextEl.textContent = currentRole.substring(0, charIdx);

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 500;
      }

      setTimeout(typeRoles, typeSpeed);
    }

    setTimeout(typeRoles, 1500);
  }

  /* ----------------------------------------------------
     4. CUSTOM LERP CURSOR
     ---------------------------------------------------- */
  const cursorDot = document.getElementById("cursor-dot");
  const cursorRing = document.getElementById("cursor-ring");

  if (cursorDot && cursorRing) {
    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
      cursorDot.style.display = "block";
      cursorRing.style.display = "block";

      window.addEventListener("mousemove", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
      });

      const updateCursor = () => {
        cursorX += (targetX - cursorX) * 0.15;
        cursorY += (targetY - cursorY) * 0.15;

        cursorDot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
        cursorRing.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

        requestAnimationFrame(updateCursor);
      };
      updateCursor();

      const refreshCursorListeners = () => {
        const hoveredItems = document.querySelectorAll("a, button, .project-card, .skills-category, .nav-hamburger, .suggestion-chip, .resource-card");
        hoveredItems.forEach((item) => {
          // Prevent attaching multiple duplicate listeners
          item.removeEventListener("mouseenter", addCursorHover);
          item.removeEventListener("mouseleave", removeCursorHover);
          item.addEventListener("mouseenter", addCursorHover);
          item.addEventListener("mouseleave", removeCursorHover);
        });
      };

      function addCursorHover() { document.body.classList.add("cursor-hover"); }
      function removeCursorHover() { document.body.classList.remove("cursor-hover"); }

      refreshCursorListeners();
      // Expose cursor refresher globally so dynamically created cards/chips can call it
      window.refreshCursorListeners = refreshCursorListeners;
    }
  }

  /* ----------------------------------------------------
     5. MAGNETIC BUTTONS & INTERFACE
     ---------------------------------------------------- */
  const magneticItems = document.querySelectorAll(".magnetic");
  magneticItems.forEach((item) => {
    const strength = parseInt(item.getAttribute("data-strength") || 10, 10);

    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      if (typeof gsap !== 'undefined') {
        gsap.to(item, {
          x: (x / rect.width) * strength,
          y: (y / rect.height) * strength,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    item.addEventListener("mouseleave", () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(item, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });
      }
    });
  });

  /* ----------------------------------------------------
     6. NAVBAR SCROLL EFFECT & INTERACTION
     ---------------------------------------------------- */
  const header = document.getElementById("navbar");
  const scrollTopBtn = document.getElementById("scroll-top");

  window.addEventListener("scroll", () => {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    if (scrollTopBtn) {
      if (window.scrollY > 150) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    }
  });

  if (scrollTopBtn && typeof gsap !== 'undefined') {
    scrollTopBtn.addEventListener("click", () => {
      gsap.to(window, {
        scrollTo: { y: 0 },
        duration: 1.2,
        ease: "power3.inOut"
      });
    });
  }

  /* ----------------------------------------------------
     7. HAMBURGER MOBILE MENU CONTROL
     ---------------------------------------------------- */
  const hamburger = document.getElementById("nav-hamburger");
  const mobileNav = document.getElementById("mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileNav.classList.toggle("active");
    });

    // Close on clicking mobile link
    const mobileLinks = mobileNav.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileNav.classList.remove("active");
      });
    });
  }
});
