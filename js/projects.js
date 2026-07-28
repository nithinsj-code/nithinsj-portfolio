document.addEventListener("DOMContentLoaded", () => {
  const projectsSkeleton = document.getElementById("projects-skeleton");
  const projectsContainer = document.getElementById("projects-container");

  if (!projectsContainer) return;

  const username = "nithinsj-code";

  // Static fallback repositories (in case GitHub API rate limits or fails)
  const fallbackRepos = [
    {
      name: "Prep4Future",
      description: "Developed Prep4Future AI, a full-stack career preparation platform that provides AI-powered resume analysis, interview practice, and career coaching.",
      language: "TypeScript",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/nithinsj-code/Prep4Future"
    },
    {
      name: "DraftRex",
      description: "Developed DraftRex, a full-stack AI SaaS platform that helps freelance writers maintain distinct writing styles for multiple clients using AI-generated voice profiles.",
      language: "TypeScript",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/nithinsj-code/DraftRex"
    },
    {
      name: "DocGenius",
      description: "Developed DocGenius, an AI-powered document analysis platform that allows users to upload PDFs, chat with document content, and generate AI-based text.",
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/nithinsj-code/DocGenius"
    },
    {
      name: "sadhurangam",
      description: "Full-stack real-time multiplayer chess platform with visual move history validation, draw offers, and resign states.",
      language: "JavaScript",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/nithinsj-code/sadhurangam"
    },
    {
      name: "naturo-crop",
      description: "Intelligent farming assistant designed to detect plant diseases, recommend treatments, and optimize crop yields using ML and LLMs.",
      language: "HTML",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/nithinsj-code/naturo-crop"
    },
    {
      name: "emotion-recognition",
      description: "Real-time deep learning facial expression analysis and emotion classification using custom CNN models in Python.",
      language: "Python",
      stargazers_count: 0,
      forks_count: 0,
      html_url: "https://github.com/nithinsj-code/emotion-recognition"
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

  const featuredRepoNames = [
    "Prep4Future",
    "DraftRex",
    "DocGenius",
    "sadhurangam",
    "naturo-crop",
    "emotion-recognition"
  ];

  async function fetchGithubRepos() {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      if (!response.ok) {
        throw new Error(`API fetch status: ${response.status}`);
      }
      const allRepos = await response.json();
      
      // Filter to only include featured repos
      const filteredRepos = featuredRepoNames
        .map(name => allRepos.find(r => r.name.toLowerCase() === name.toLowerCase()))
        .filter(Boolean);

      // If we found less than 6 featured repos, append other repositories from profile
      if (filteredRepos.length < 6) {
        const extraRepos = allRepos.filter(r => 
          !featuredRepoNames.includes(r.name.toLowerCase()) && 
          r.name.toLowerCase() !== username.toLowerCase()
        );
        extraRepos.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
        
        while (filteredRepos.length < 6 && extraRepos.length > 0) {
          filteredRepos.push(extraRepos.shift());
        }
      }
      
      if (filteredRepos.length > 0) {
        renderRepos(filteredRepos);
      }
    } catch (err) {
      // Fallback already rendered — do nothing
      console.warn("GitHub API unavailable, showing fallback projects.", err);
    }
  }

  function renderRepos(repos) {
    projectsContainer.innerHTML = "";

    repos.slice(0, 6).forEach((repo) => {
      const card = document.createElement("div");
      card.className = "project-card glass";
      card.setAttribute("data-tilt", "");
      card.setAttribute("data-tilt-max", "6");

      const lang = repo.language || "Python";
      const dotColor = langColors[lang] || "#ffffff";
      const description = repo.description || "Experimental AI/ML script testing various learning networks or API systems.";

      card.innerHTML = `
        <div class="project-top">
          <div class="project-folder-icon"><i class="fa-regular fa-folder-open"></i></div>
          <div class="project-links">
            <a href="${repo.html_url}" target="_blank" aria-label="GitHub Repository"><i class="fa-brands fa-github"></i></a>
            <a href="${repo.html_url}" target="_blank" aria-label="Project Website"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
        </div>
        <div class="project-mid">
          <h3 class="project-name">${repo.name.replace(/-/g, ' ')}</h3>
          <p class="project-description">${description}</p>
        </div>
        <div class="project-bottom">
          <div class="project-lang">
            <span class="project-lang-dot" style="background-color: ${dotColor};"></span>
            <span>${lang}</span>
          </div>
          <div class="project-stats">
            <div class="project-stat-item">
              <i class="fa-regular fa-star"></i>
              <span>${repo.stargazers_count || 0}</span>
            </div>
            <div class="project-stat-item">
              <i class="fa-solid fa-code-branch"></i>
              <span>${repo.forks_count || 0}</span>
            </div>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        window.open(repo.html_url, "_blank");
      });

      projectsContainer.appendChild(card);
    });

    if (projectsSkeleton) {
      projectsSkeleton.style.display = "none";
    }
    projectsContainer.style.display = "grid";

    // Initialize Tilt
    if (typeof VanillaTilt !== 'undefined' && !document.body.classList.contains("neo-brutal")) {
      VanillaTilt.init(document.querySelectorAll(".project-card"), {
        max: 6,
        speed: 400,
        glare: true,
        "max-glare": 0.15
      });
    }

    // Direct entry GSAP stagger animation
    if (typeof gsap !== 'undefined') {
      gsap.from(projectsContainer.querySelectorAll(".project-card"), {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "all"
      });
    }

    if (window.refreshCursorListeners) {
      window.refreshCursorListeners();
    }
  }

  // Render fallback immediately so skeleton doesn't stay
  renderRepos(fallbackRepos);
  fetchGithubRepos();
});
