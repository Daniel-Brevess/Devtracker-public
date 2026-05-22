import api from "../api";

export async function createTask({ focusId, title, description, priority }) {
  const response = await api.post(`/task/focus/${focusId}/create`, {
    title: title.trim(),
    description: description.trim(),
    priority,
  });

  return response.data;
}

export async function getTasksByFocus(focusId) {
  const response = await api.get(`/task/focus/${focusId}/all`);

  return response.data;
}
