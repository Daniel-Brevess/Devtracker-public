import api from "../api";

export async function createGoal({ title, description, difficulty, status }) {
  const response = await api.post("/goal/create", {
    title: title.trim(),
    description: description.trim(),
    difficulty,
    status,
  });

  return response.data;
}

export async function getAllGoals() {
  const response = await api.get("/goal/all");

  return response.data;
}

export async function updateGoal({
  goalId,
  title,
  description,
  difficulty,
  status,
}) {
  const response = await api.put(`/goal/${goalId}/update`, {
    title: title.trim(),
    description: description.trim(),
    difficulty,
    status,
  });

  return response.data;
}

export async function deleteGoal({ goalId }) {
  const response = await api.delete(`/goal/${goalId}/delete`);

  return response.data;
}
