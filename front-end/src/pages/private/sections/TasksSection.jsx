import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Plus,
  Search,
  X,
} from "lucide-react";

import { createFocus } from "../../../services/focus/focusService";
import { getApiErrorMessage } from "../../../utils/apiError";

const initialFocusGroups = [
  {
    title: "Today",
    tasks: [
      {
        title: "Review authentication flow",
        meta: "Security",
        done: true,
      },
      {
        title: "Create first task model",
        meta: "Back-end",
        done: false,
      },
      {
        title: "Draft task dashboard layout",
        meta: "Front-end",
        done: false,
      },
    ],
  },
  {
    title: "Next",
    tasks: [
      {
        title: "Connect tasks with authenticated user",
        meta: "API",
        done: false,
      },
      {
        title: "Add status and priority filters",
        meta: "Product",
        done: false,
      },
    ],
  },
];

export default function TasksSection() {
  const [focusGroups, setFocusGroups] = useState(initialFocusGroups);
  const [isCreateFocusModalOpen, setIsCreateFocusModalOpen] = useState(false);
  const [focusTitle, setFocusTitle] = useState("");
  const [createFocusMessage, setCreateFocusMessage] = useState("");
  const [isCreatingFocus, setIsCreatingFocus] = useState(false);

  const taskSummary = useMemo(() => {
    const tasks = focusGroups.flatMap((group) => group.tasks);

    return {
      open: tasks.filter((task) => !task.done).length,
      completed: tasks.filter((task) => task.done).length,
      activeFocus: focusGroups[0]?.title || "None",
    };
  }, [focusGroups]);

  function openCreateFocusModal() {
    setFocusTitle("");
    setCreateFocusMessage("");
    setIsCreateFocusModalOpen(true);
  }

  function closeCreateFocusModal() {
    if (isCreatingFocus) return;

    setFocusTitle("");
    setCreateFocusMessage("");
    setIsCreateFocusModalOpen(false);
  }

  async function handleCreateFocus(event) {
    event.preventDefault();

    const trimmedTitle = focusTitle.trim();
    setCreateFocusMessage("");

    if (!trimmedTitle) {
      setCreateFocusMessage("Add a title for this focus.");
      return;
    }

    setIsCreatingFocus(true);

    try {
      const createdFocus = await createFocus({ title: trimmedTitle });

      setFocusGroups((currentGroups) => [
        {
          title: createdFocus.title,
          tasks: [],
        },
        ...currentGroups,
      ]);

      setFocusTitle("");
      setIsCreateFocusModalOpen(false);
    } catch (error) {
      setCreateFocusMessage(
        getApiErrorMessage(error, "Could not create focus. Try again.")
      );
    } finally {
      setIsCreatingFocus(false);
    }
  }

  return (
    <section className="flex-1 overflow-y-auto px-8 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Tasks
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Plan your development work
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
              Organize what needs to be built, reviewed, and shipped next.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateFocusModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            New focus
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Open
            </p>
            <strong className="mt-2 block text-2xl text-white">
              {taskSummary.open}
            </strong>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Completed
            </p>
            <strong className="mt-2 block text-2xl text-white">
              {taskSummary.completed}
            </strong>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Focus
            </p>
            <strong className="mt-2 block truncate text-2xl text-white">
              {taskSummary.activeFocus}
            </strong>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {focusGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-3xl border border-white/10 bg-zinc-950/50 p-5 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  {group.title}
                </h2>

                <CalendarDays className="h-4 w-4 text-blue-400" />
              </div>

              <div className="space-y-3">
                {group.tasks.length === 0 && (
                  <div className="rounded-2xl border border-white/5 bg-black/40 p-4">
                    <p className="text-sm font-medium text-white">
                      No tasks in this focus yet.
                    </p>
                    <span className="mt-1 block text-xs text-zinc-600">
                      Tasks added to this focus will appear here.
                    </span>
                  </div>
                )}

                {group.tasks.map((task) => {
                  const StatusIcon = task.done ? CheckCircle2 : Circle;

                  return (
                    <div
                      key={task.title}
                      className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/40 p-4 transition hover:border-white/15"
                    >
                      <StatusIcon
                        className={`h-5 w-5 shrink-0 ${
                          task.done ? "text-emerald-400" : "text-zinc-600"
                        }`}
                      />

                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-medium ${
                            task.done ? "text-zinc-500 line-through" : "text-white"
                          }`}
                        >
                          {task.title}
                        </p>

                        <span className="mt-1 block text-xs text-zinc-600">
                          {task.meta}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCreateFocusModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  New focus
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  Create a focus area before adding tasks to it.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateFocusModal}
                disabled={isCreatingFocus}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFocus} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Focus title</label>

                <input
                  name="focusTitle"
                  type="text"
                  value={focusTitle}
                  onChange={(event) => {
                    setFocusTitle(event.target.value);
                    setCreateFocusMessage("");
                  }}
                  maxLength={255}
                  placeholder="Ex: Authentication flow"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-blue-500/50"
                />
              </div>

              {createFocusMessage && (
                <span className="block text-sm text-red-400">
                  {createFocusMessage}
                </span>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCreateFocusModal}
                  disabled={isCreatingFocus}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreatingFocus}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingFocus ? "Creating..." : "Create focus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
