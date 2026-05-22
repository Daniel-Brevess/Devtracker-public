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

export async function updateTask({
  focusId,
  taskId,
  title,
  description,
  priority,
}) {
  const response = await api.put(`/task/focus/${focusId}/${taskId}/update`, {
    title: title.trim(),
    description: description.trim(),
    priority,
  });

  return response.data;
}

export async function deleteTask({ focusId, taskId }) {
  const response = await api.delete(`/task/focus/${focusId}/${taskId}/delete`);

  return response.data;
}

export async function toggleTaskStatus({ focusId, taskId }) {
  const response = await api.patch(
    `/task/focus/${focusId}/${taskId}/toggle-status`
  );

  return response.data;
}
