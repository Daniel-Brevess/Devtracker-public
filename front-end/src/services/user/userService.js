import api from "../api";
import { getUser, getToken, logout } from "../tokenService";

export async function getMe() {
  const response = await api.get("/user/me");

  return response.data;
}

export function getCurrentUser() {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return null;
  }

  return user;
}

export function isGitHubUser(user = getCurrentUser()) {
  return user?.authProvider === "GITHUB";
}

export function getDisplayUsername(user = getCurrentUser()) {
  if (!user) {
    return "username";
  }

  if (isGitHubUser(user)) {
    return user.githubUsername || user.username || "github-user";
  }

  return user.username || "username";
}

export function requireCurrentUser() {
  const user = getCurrentUser();

  if (!user) {
    logout();
    throw new Error("Usuario nao autenticado.");
  }

  return user;
}

export function getUserInitials() {
  const user = getCurrentUser();

  if (!user?.name) {
    return "DV";
  }

  return user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
