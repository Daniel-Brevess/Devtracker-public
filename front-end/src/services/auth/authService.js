import api from "../api";

export async function login({ email, password }) {
  const response = await api.post("/auth/login", {
    email: email.trim(),
    password,
  });

  return response.data;
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
