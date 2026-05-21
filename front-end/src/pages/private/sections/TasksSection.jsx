import { CalendarDays, CheckCircle2, Circle, Plus, Search } from "lucide-react";

const taskGroups = [
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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Open
            </p>
            <strong className="mt-2 block text-2xl text-white">4</strong>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Completed
            </p>
            <strong className="mt-2 block text-2xl text-white">1</strong>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Focus
            </p>
            <strong className="mt-2 block text-2xl text-white">Today</strong>
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
          {taskGroups.map((group) => (
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
    </section>
  );
}
