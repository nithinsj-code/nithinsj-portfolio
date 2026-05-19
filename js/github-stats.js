document.addEventListener("DOMContentLoaded", () => {
  const statNodes = document.querySelectorAll("[data-github-stat]");
  if (!statNodes.length) return;

  const username = "nithinsj-code";
  const fallbackStats = {
    repos: 0,
    commits: 0,
    stars: 0
  };

  function setStat(type, value) {
    const normalizedValue = Number.isFinite(value) ? value : fallbackStats[type];
    document.querySelectorAll(`[data-github-stat="${type}"]`).forEach((node) => {
      node.dataset.target = String(normalizedValue);
      animateStat(node, normalizedValue);
    });
  }

  function animateStat(node, target) {
    if (typeof gsap === "undefined") {
      node.textContent = String(target);
      return;
    }

    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        node.textContent = String(Math.floor(counter.value));
      },
      onComplete: () => {
        node.textContent = String(target);
      }
    });
  }

  function parseLastPage(linkHeader) {
    if (!linkHeader) return 1;

    const lastLink = linkHeader
      .split(",")
      .map((part) => part.trim())
      .find((part) => part.includes('rel="last"'));

    if (!lastLink) return 1;

    const pageMatch = lastLink.match(/[?&]page=(\d+)/);
    return pageMatch ? parseInt(pageMatch[1], 10) : 1;
  }

  async function getRepoCommitCount(repo) {
    if (!repo.default_branch || repo.empty) return 0;

    const response = await fetch(
      `https://api.github.com/repos/${username}/${repo.name}/commits?sha=${encodeURIComponent(repo.default_branch)}&per_page=1`
    );

    if (!response.ok) return 0;
    return parseLastPage(response.headers.get("Link"));
  }

  async function loadGithubStats() {
    try {
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
      if (!reposResponse.ok) {
        throw new Error(`GitHub repos API returned ${reposResponse.status}`);
      }

      const repos = await reposResponse.json();
      const sourceRepos = repos.filter((repo) => !repo.fork);
      const publicProjectCount = sourceRepos.length || repos.length;
      const totalStars = sourceRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

      setStat("repos", publicProjectCount);
      setStat("stars", totalStars);

      const commitCounts = await Promise.all(sourceRepos.slice(0, 45).map(getRepoCommitCount));
      const totalCommits = commitCounts.reduce((sum, count) => sum + count, 0);
      setStat("commits", totalCommits);
    } catch (error) {
      console.warn("Unable to load live GitHub stats.", error);
      Object.entries(fallbackStats).forEach(([type, value]) => setStat(type, value));
    }
  }

  loadGithubStats();
});
