import api from "../api";

export async function getGitHubAnalytics() {
  const response = await api.get("/github/analytics");

  return response.data;
}
