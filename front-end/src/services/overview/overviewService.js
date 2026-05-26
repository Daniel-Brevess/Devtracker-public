import { getAllFocuses } from "../focus/focusService";
import { getGitHubAnalytics } from "../github/githubAnalyticsService";
import { getAllGoals } from "../goal/goalService";
import { getAllSessions } from "../session/sessionService";
import { getTasksByFocus } from "../task/taskService";

function toDateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function getLastSevenDays() {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return toDateKey(date);
  });
}

function getCurrentStreak(activeDateKeys) {
  let streak = 0;
  const cursor = new Date();

  while (activeDateKeys.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function buildTaskStats(tasks) {
  const completed = tasks.filter((task) => Boolean(task.status)).length;
  const total = tasks.length;
  const pending = total - completed;

  return {
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    completed,
    pending,
    total,
  };
}

function buildGoalStats(goals) {
  return {
    completed: goals.filter((goal) => goal.status === "DONE").length,
    discarded: goals.filter((goal) => goal.status === "DISCARDED").length,
    inProgress: goals.filter((goal) => goal.status === "IN_PROGRESS").length,
    pending: goals.filter((goal) => goal.status === "TODO").length,
    total: goals.length,
  };
}

function buildSessionStats(sessions) {
  const totalDuration = sessions.reduce(
    (sum, session) => sum + (session.duration || 0),
    0
  );
  const averageDuration =
    sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;
  const lastSevenDays = getLastSevenDays();
  const durationByDate = sessions.reduce((accumulator, session) => {
    if (!session.createdAt) return accumulator;

    const dateKey = toDateKey(session.createdAt);
    accumulator[dateKey] = (accumulator[dateKey] || 0) + (session.duration || 0);

    return accumulator;
  }, {});
  const weeklyActivity = lastSevenDays.map((date) => ({
    date,
    duration: durationByDate[date] || 0,
  }));
  const activeDateKeys = new Set(
    Object.entries(durationByDate)
      .filter(([, duration]) => duration > 0)
      .map(([date]) => date)
  );

  return {
    activeDaysLastSeven: weeklyActivity.filter((day) => day.duration > 0).length,
    averageDuration,
    currentStreak: getCurrentStreak(activeDateKeys),
    total: sessions.length,
    totalDuration,
    weeklyActivity,
  };
}

function buildFocusStats(focuses, tasks) {
  const tasksByFocus = tasks.reduce((accumulator, task) => {
    const focusId = task.idFocus;
    accumulator[focusId] = (accumulator[focusId] || 0) + 1;

    return accumulator;
  }, {});
  const activeFocus = focuses
    .map((focus) => ({
      ...focus,
      taskCount: tasksByFocus[focus.id] || 0,
    }))
    .sort((firstFocus, secondFocus) => secondFocus.taskCount - firstFocus.taskCount)[0];

  return {
    activeFocus: activeFocus?.title || "None",
    total: focuses.length,
  };
}

function buildEmptyGitHubStats() {
  return {
    connected: false,
    username: null,
    publicRepos: 0,
    commitsLastSevenDays: 0,
    commitsLastThirtyDays: 0,
    stacks: [],
    repositories: [],
    frequency: getLastSevenDays().map((date) => ({
      date,
      commits: 0,
    })),
  };
}

export async function getOverviewData() {
  const [focuses, goals, sessions, githubResult] = await Promise.all([
    getAllFocuses(),
    getAllGoals(),
    getAllSessions(),
    getGitHubAnalytics().catch(() => buildEmptyGitHubStats()),
  ]);
  const taskGroups = await Promise.all(
    focuses.map(async (focus) => getTasksByFocus(focus.id))
  );
  const tasks = taskGroups.flat();

  return {
    focuses: buildFocusStats(focuses, tasks),
    goals: buildGoalStats(goals),
    github: githubResult || buildEmptyGitHubStats(),
    sessions: buildSessionStats(sessions),
    tasks: buildTaskStats(tasks),
  };
}
