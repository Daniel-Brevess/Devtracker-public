import api from "../api";
import { logout, saveToken, saveUser } from "../tokenService";
import { getMe } from "../user/userService";

export async function login({ email, password }) {
  const response = await api.post("/auth/login", {
    email: email.trim(),
    password,
  });

  return response.data;
}

export async function finishAuthentication(token) {
  saveToken(token);

  try {
    const user = await getMe();
    saveUser(user);

    return user;
  } catch (error) {
    logout();
    throw error;
  }
}

export async function register({ name, username, email, password }) {
  const response = await api.post("/auth/register", {
    name: name.trim(),
    username: username.trim(),
    email: email.trim(),
    password,
  });

  return response.data;
}

export function startGitHubAuth() {
  window.location.href = "http://localhost:8080/auth/github";
}
