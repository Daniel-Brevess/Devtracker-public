import api from "../api";

export async function createFocus({ title }) {
  const response = await api.post("/focus/create", {
    title: title.trim(),
  });

  return response.data;
}

export async function getAllFocuses() {
  const response = await api.get("/focus/all");

  return response.data;
}

export async function updateFocus({ id, title }) {
  const response = await api.put("/focus/update", {
    id,
    title: title.trim(),
  });

  return response.data;
}
