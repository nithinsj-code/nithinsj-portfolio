// projects.js — GitHub Showcase Renderer (Robust Static Fallback)

(function () {
  "use strict";

  const projects = [
    {
      name: "Prep4Future",
      displayName: "Prep4Future",
      description: "AI-powered career preparation platform with resume analysis, interview practice, and career coaching.",
      tags: ["Python", "TypeScript", "React", "FastAPI", "Groq"],
      language: "TypeScript",
      url: "https://github.com/nithinsj-code/Prep4Future"
    },
    {
      name: "DraftRex",
      displayName: "DraftRex",
      description: "AI SaaS platform that helps freelance writers maintain distinct writing styles for multiple clients using AI-generated voice profiles.",
      tags: ["Next.js", "FastAPI", "Python"],
      language: "TypeScript",
      url: "https://github.com/nithinsj-code/DraftRex"
    },
    {
      name: "DocGenius",
      displayName: "DocGenius",
      description: "AI-powered document analysis platform to upload PDFs, chat with document content, and generate AI-based text using RAG.",
      tags: ["Python", "FastAPI", "RAG"],
      language: "Python",
      url: "https://github.com/nithinsj-code/DocGenius"
    },
    {
      name: "Sadhurangam",
      displayName: "Sadhurangam",
      description: "Full-stack real-time multiplayer chess platform with visual move history validation, draw offers, and resign states.",
      tags: ["JavaScript", "Node.js", "Socket.io"],
      language: "JavaScript",
      url: "https://github.com/nithinsj-code/sadhurangam"
    },
    {
      name: "Naturo-Crop",
      displayName: "Naturo Crop",
      description: "Intelligent farming assistant to detect plant diseases, recommend treatments, and optimize crop yields using ML and LLMs.",
      tags: ["Python", "ML", "LLM"],
      language: "Python",
      url: "https://github.com/nithinsj-code/naturo-crop"
    },
    {
      name: "Emotion-Recognition",
      displayName: "Emotion Recognition",
      description: "Real-time deep learning facial expression analysis and emotion classification using custom CNN models.",
      tags: ["Python", "CNN", "OpenCV"],
      language: "Python",
      url: "https://github.com/nithinsj-code/emotion-recognition"
    }
  ];

  const langColors = {
    Python: "#3572A5",
    JavaScript: "#f1e05a",
    HTML: "#e34c26",
    CSS: "#563d7c",
    TypeScript: "#3178c6",
    React: "#61dafb"
  };

  function renderProjects() {
    const skeleton = document.getElementById("projects-skeleton");
    const container = document.getElementById("projects-container");

    if (!container) return;

    container.innerHTML = "";

    projects.forEach(function (proj) {
      const dotColor = langColors[proj.language] || "#aaaaaa";

      const tagsHtml = proj.tags
        .map(function (t) { return '<span class="proj-tag">' + t + '</span>'; })
        .join("");

      const card = document.createElement("div");
      card.className = "project-card glass";

      card.innerHTML =
        '<div class="project-top">' +
          '<div class="project-folder-icon"><i class="fa-regular fa-folder-open"></i></div>' +
          '<div class="project-links">' +
            '<a href="' + proj.url + '" target="_blank" rel="noopener" aria-label="GitHub Repository" onclick="event.stopPropagation()"><i class="fa-brands fa-github"></i></a>' +
            '<a href="' + proj.url + '" target="_blank" rel="noopener" aria-label="Open project" onclick="event.stopPropagation()"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>' +
          '</div>' +
        '</div>' +
        '<div class="project-mid">' +
          '<h3 class="project-name">' + proj.displayName + '</h3>' +
          '<p class="project-description">' + proj.description + '</p>' +
          '<div class="proj-tags">' + tagsHtml + '</div>' +
        '</div>' +
        '<div class="project-bottom">' +
          '<div class="project-lang">' +
            '<span class="project-lang-dot" style="background-color:' + dotColor + ';"></span>' +
            '<span>' + proj.language + '</span>' +
          '</div>' +
          '<div class="project-stats">' +
            '<div class="project-stat-item"><i class="fa-regular fa-star"></i><span>0</span></div>' +
            '<div class="project-stat-item"><i class="fa-solid fa-code-branch"></i><span>0</span></div>' +
          '</div>' +
        '</div>';

      card.style.cursor = "pointer";
      card.addEventListener("click", function () {
        window.open(proj.url, "_blank");
      });

      container.appendChild(card);
    });

    // Hide skeleton, show cards
    if (skeleton) {
      skeleton.style.display = "none";
    }
    container.style.display = "grid";

    // Tilt effect (not on neo-brutal)
    if (typeof VanillaTilt !== "undefined" && !document.body.classList.contains("neo-brutal")) {
      VanillaTilt.init(container.querySelectorAll(".project-card"), {
        max: 6, speed: 400, glare: true, "max-glare": 0.15
      });
    }

    // GSAP entrance animation
    if (typeof gsap !== "undefined") {
      gsap.from(container.querySelectorAll(".project-card"), {
        opacity: 0, y: 30, stagger: 0.1, duration: 0.6,
        ease: "power2.out", clearProps: "all"
      });
    }

    if (window.refreshCursorListeners) {
      window.refreshCursorListeners();
    }
  }

  // Run immediately on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderProjects);
  } else {
    renderProjects();
  }
})();
