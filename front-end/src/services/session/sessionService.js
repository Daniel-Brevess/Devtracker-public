import api from "../api";

export async function createSession({ type, duration }) {
  const response = await api.post("/session/create", {
    type,
    duration,
  });

  return response.data;
}

export async function getAllSessions() {
  const response = await api.get("/session/all");

  return response.data;
}
