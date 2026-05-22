import api from "../api";

export async function createTask({ focusId, title, description, priority }) {
  const response = await api.post(`/task/focus/${focusId}/create`, {
    title: title.trim(),
    description: description.trim(),
    priority,
  });

  return response.data;
}
