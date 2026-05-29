import api from "../api";

export async function getAdminAnalytics() {
  const response = await api.get("/admin/analytics");

  return response.data;
}

export function isAdminUser(user) {
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(user?.email && adminEmails.includes(user.email.toLowerCase()));
}
