document.addEventListener("DOMContentLoaded", () => {
  const statNodes = document.querySelectorAll("[data-github-stat]");
  if (!statNodes.length) return;

  const username = "nithinsj-code";
  const fallbackText = "API LIMIT";

  async function fetchGithub(url) {
    const response = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status} for ${url}`);
    }

    return response;
  }

  statNodes.forEach((node) => {
    node.textContent = "LIVE...";
    node.dataset.liveState = "loading";
  });

  function setStat(type, value) {
    document.querySelectorAll(`[data-github-stat="${type}"]`).forEach((node) => {
      if (Number.isFinite(value)) {
        node.dataset.liveState = "ready";
        node.dataset.target = String(value);
        animateStat(node, value);
      } else {
        node.textContent = fallbackText;
        node.dataset.liveState = "error";
      }
    });
  }

  function parseNextPage(linkHeader) {
    if (!linkHeader) return null;

    const nextLink = linkHeader
      .split(",")
      .map((part) => part.trim())
      .find((part) => part.includes('rel="next"'));

    if (!nextLink) return null;

    const urlMatch = nextLink.match(/<([^>]+)>/);
    return urlMatch ? urlMatch[1] : null;
  }

  function animateStat(node, target) {
    node.textContent = String(target);
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
      const response = await fetchGithub(
        `https://api.github.com/repos/${username}/${repo.name}/commits?sha=${encodeURIComponent(repo.default_branch)}&per_page=1`
      );

      return parseLastPage(response.headers.get("Link"));
    } catch (error) {
      return null;
    }
  }

  async function fetchProfileRepoCount() {
    const response = await fetchGithub(`https://api.github.com/users/${username}`);
    const profile = await response.json();
    return Number.isFinite(profile.public_repos) ? profile.public_repos : null;
  }

  async function fetchAuthoredCommitCount() {
    try {
      const response = await fetchGithub(
        `https://api.github.com/search/commits?q=author:${encodeURIComponent(username)}&per_page=1`
      );
      const result = await response.json();
      return Number.isFinite(result.total_count) && result.total_count > 0 ? result.total_count : null;
    } catch (error) {
      return null;
    }
  }

  async function fetchAllRepos() {
    const repos = [];
    let url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`;

    while (url) {
      const response = await fetchGithub(url);
      repos.push(...await response.json());
      url = parseNextPage(response.headers.get("Link"));
    }

    return repos;
  }

  async function mapWithLimit(items, limit, mapper) {
    const results = [];
    const executing = new Set();

    for (const item of items) {
      const promise = Promise.resolve().then(() => mapper(item));
      results.push(promise);
      executing.add(promise);

      promise.finally(() => executing.delete(promise));

      if (executing.size >= limit) {
        await Promise.race(executing);
      }
    }

    return Promise.all(results);
  }

  async function loadGithubStats() {
    try {
      const [profileRepoCount, repos] = await Promise.all([
        fetchProfileRepoCount(),
        fetchAllRepos()
      ]);
      const sourceRepos = repos.filter((repo) => !repo.fork);
      const publicProjectCount = profileRepoCount || sourceRepos.length || repos.length;

      setStat("repos", publicProjectCount);

      const authoredCommitCount = await fetchAuthoredCommitCount();
      if (Number.isFinite(authoredCommitCount)) {
        setStat("commits", authoredCommitCount);
        return;
      }

      const commitCounts = await mapWithLimit(sourceRepos, 5, getRepoCommitCount);
      const validCommitCounts = commitCounts.filter((count) => Number.isFinite(count) && count > 0);
      const totalCommits = validCommitCounts.reduce((sum, count) => sum + count, 0);
      setStat("commits", totalCommits > 0 ? totalCommits : NaN);
    } catch (error) {
      console.warn("Unable to load live GitHub stats.", error);
      setStat("repos", NaN);
      setStat("commits", NaN);
    }
  }

  loadGithubStats();
});
