document.addEventListener("DOMContentLoaded", () => {
  const statNodes = document.querySelectorAll("[data-github-stat]");
  if (!statNodes.length) return;

  const username = "nithinsj-code";
  const fallbackText = "--";

  function setStat(type, value) {
    document.querySelectorAll(`[data-github-stat="${type}"]`).forEach((node) => {
      if (Number.isFinite(value)) {
        node.dataset.target = String(value);
        animateStat(node, value);
      } else {
        node.textContent = fallbackText;
      }
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

    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/commits?sha=${encodeURIComponent(repo.default_branch)}&per_page=1`
      );

      if (!response.ok) return null;
      return parseLastPage(response.headers.get("Link"));
    } catch (error) {
      return null;
    }
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

      setStat("repos", publicProjectCount);

      const commitCounts = await Promise.all(sourceRepos.slice(0, 45).map(getRepoCommitCount));
      const validCommitCounts = commitCounts.filter((count) => Number.isFinite(count));
      const totalCommits = validCommitCounts.reduce((sum, count) => sum + count, 0);
      setStat("commits", validCommitCounts.length ? totalCommits : NaN);
    } catch (error) {
      console.warn("Unable to load live GitHub stats.", error);
      setStat("repos", NaN);
      setStat("commits", NaN);
    }
  }

  loadGithubStats();
});
