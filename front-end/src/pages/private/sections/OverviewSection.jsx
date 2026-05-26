import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  Flame,
  ListChecks,
  Target,
  Timer,
} from "lucide-react";

import { getOverviewData } from "../../../services/overview/overviewService";
import { getApiErrorMessage } from "../../../utils/apiError";

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${minutes}m`;
}

function formatShortDate(dateKey) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(`${dateKey}T00:00:00`));
}

function StatCard({ colorClassName, icon: Icon, label, sub, value }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-zinc-950/50 p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <h3 className={`mt-3 text-3xl font-bold ${colorClassName}`}>
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-600">{sub}</p>
    </article>
  );
}

export default function OverviewSection() {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadOverview() {
      setIsLoading(true);
      setMessage("");

      try {
        const overviewData = await getOverviewData();
        setOverview(overviewData);
      } catch (error) {
        setMessage(
          getApiErrorMessage(error, "Could not load overview. Try again.")
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOverview();
  }, []);

  const maxWeeklyDuration = useMemo(() => {
    if (!overview?.sessions.weeklyActivity) return 0;

    return Math.max(
      ...overview.sessions.weeklyActivity.map((day) => day.duration),
      0
    );
  }, [overview]);

  if (isLoading) {
    return (
      <section className="flex flex-1 items-center justify-center px-8">
        <p className="text-sm text-zinc-500">Loading overview...</p>
      </section>
    );
  }

  if (message) {
    return (
      <section className="flex flex-1 items-center justify-center px-8">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-sm text-red-300">{message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-y-auto px-8 py-8">
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Overview
          </h1>
          <p className="max-w-2xl text-sm text-zinc-500">
            A general view of your tasks, goals, sessions, and consistency.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            colorClassName="text-blue-400"
            icon={ListChecks}
            label="Tasks Done"
            sub={`${overview.tasks.pending} pending tasks`}
            value={`${overview.tasks.completed}/${overview.tasks.total}`}
          />
          <StatCard
            colorClassName="text-emerald-400"
            icon={CheckCircle2}
            label="Completion"
            sub="Task completion rate"
            value={`${overview.tasks.completionRate}%`}
          />
          <StatCard
            colorClassName="text-orange-400"
            icon={Flame}
            label="Current Streak"
            sub={`${overview.sessions.activeDaysLastSeven} active days this week`}
            value={`${overview.sessions.currentStreak}d`}
          />
          <StatCard
            colorClassName="text-violet-400"
            icon={Timer}
            label="Focus Time"
            sub={`${overview.sessions.total} recorded sessions`}
            value={formatDuration(overview.sessions.totalDuration)}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-sm xl:col-span-2">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Weekly Frequency
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Session time recorded in the last 7 days.
                </p>
              </div>

              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>

            <div className="flex h-64 items-end gap-3">
              {overview.sessions.weeklyActivity.map((day) => {
                const height =
                  maxWeeklyDuration > 0
                    ? Math.max((day.duration / maxWeeklyDuration) * 100, 8)
                    : 8;

                return (
                  <div
                    key={day.date}
                    className="flex h-full min-w-0 flex-1 flex-col justify-end gap-3"
                  >
                    <div className="flex flex-1 items-end">
                      <div
                        style={{ height: `${height}%` }}
                        className={`w-full rounded-t-xl transition ${
                          day.duration > 0
                            ? "bg-blue-500/70"
                            : "bg-white/10"
                        }`}
                      />
                    </div>

                    <div className="text-center">
                      <span className="block text-xs text-zinc-500">
                        {formatShortDate(day.date)}
                      </span>
                      <span className="mt-1 block text-[10px] text-zinc-600">
                        {formatDuration(day.duration)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Goals
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Long-term progress by status.
                </p>
              </div>

              <Target className="h-5 w-5 text-blue-400" />
            </div>

            <div className="space-y-4">
              {[
                ["In Progress", overview.goals.inProgress, "bg-blue-400"],
                ["Pending", overview.goals.pending, "bg-zinc-400"],
                ["Completed", overview.goals.completed, "bg-emerald-400"],
                ["Paused", overview.goals.discarded, "bg-orange-400"],
              ].map(([label, value, dotClassName]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/30 px-4 py-3"
                >
                  <span className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className={`h-2 w-2 rounded-full ${dotClassName}`} />
                    {label}
                  </span>
                  <span className="font-mono text-sm text-white">{value}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">
                Active Focus
              </h2>
            </div>
            <p className="mt-4 truncate text-2xl font-bold text-white">
              {overview.focuses.activeFocus}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Based on the focus with the most tasks.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">
                Average Session
              </h2>
            </div>
            <p className="mt-4 text-2xl font-bold text-white">
              {formatDuration(overview.sessions.averageDuration)}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Average time per recorded session.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">
                Goal Total
              </h2>
            </div>
            <p className="mt-4 text-2xl font-bold text-white">
              {overview.goals.total}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Goals currently tracked in DevTracker.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
