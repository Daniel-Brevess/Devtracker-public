import { getUser, getToken, logout } from "../tokenService";

export function getCurrentUser() {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return null;
  }

  return user;
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
