import api from "../api";

const GITHUB_ANALYTICS_CACHE_TTL = 60 * 1000;

let cachedGitHubAnalytics = null;

export async function getGitHubAnalytics() {
  if (
    cachedGitHubAnalytics &&
    cachedGitHubAnalytics.expiresAt > Date.now()
  ) {
    return cachedGitHubAnalytics.data;
  }

  const response = await api.get("/github/analytics");

  cachedGitHubAnalytics = {
    data: response.data,
    expiresAt: Date.now() + GITHUB_ANALYTICS_CACHE_TTL,
  };

  return response.data;
}

export function clearGitHubAnalyticsCache() {
  cachedGitHubAnalytics = null;
}
