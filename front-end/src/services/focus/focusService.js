import api from "../api";

export async function createFocus({ title }) {
  const response = await api.post("/focus/create", {
    title: title.trim(),
  });

  return response.data;
}
