import { Link } from "react-router-dom";

import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Flame,
  GitBranch,
  Layers3,
  LockKeyhole,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
} from "lucide-react";

import DevLogo from "../../assets/DevLogoBranco.png";

const heroStats = [
  { value: "120h+", label: "Study Hours" },
  { value: "43", label: "Tasks Done" },
  { value: "18", label: "Day Streak" },
  { value: "+74%", label: "Consistency" },
];

const productHighlights = [
  {
    icon: Activity,
    title: "Overview analytics",
    description:
      "A single command center for focus, tasks, goals, sessions and GitHub contribution momentum.",
  },
  {
    icon: Layers3,
    title: "Focus and tasks",
    description:
      "Organize work by focus areas, keep active limits healthy and finish tasks without losing clarity.",
  },
  {
    icon: Target,
    title: "Goals that move",
    description:
      "Create, edit and complete long-term goals with status, difficulty and progress built into the workflow.",
  },
  {
    icon: Clock3,
    title: "Session tracking",
    description:
      "Start sessions from anywhere, keep the timer visible and store real time used instead of planned time.",
  },
];

const workflowSteps = [
  {
    title: "Choose a focus",
    description:
      "Split your technical growth into focused areas like Java, DevOps, English or SaaS building.",
  },
  {
    title: "Execute tasks",
    description:
      "Break goals into practical tasks and keep progress visible without heavy project management noise.",
  },
  {
    title: "Track sessions",
    description:
      "Measure real work time with a persistent session island that follows you across the dashboard.",
  },
  {
    title: "Read the signal",
    description:
      "Use GitHub contributions, streaks, goals and hours to understand whether your week is actually moving.",
  },
];

const githubSignals = [
  "Contribution calendar from GitHub GraphQL",
  "Private repository support after authorization",
  "Language and stack distribution",
  "Repository activity and commit momentum",
];

const dashboardBars = [42, 68, 58, 86, 52, 118, 80];
const contributionCells = Array.from({ length: 28 }, (_, index) => {
  if ([0, 4, 6, 8, 12, 15, 18, 20, 23, 25].includes(index)) {
    return "bg-emerald-500";
  }

  if ([3, 9, 14, 21].includes(index)) {
    return "bg-emerald-700";
  }

  return "bg-zinc-800";
});

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden scroll-smooth bg-black text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-160px] top-[-120px] h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-[-220px] right-[-140px] h-[560px] w-[560px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/45 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_0_40px_rgba(59,130,246,0.12)]">
              <img
                src={DevLogo}
                alt="DevTracker Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-base font-semibold tracking-wide">
                DevTracker
              </h1>

              <p className="text-xs text-zinc-500">
                Technical Evolution Platform
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-zinc-500 md:flex">
            <a href="#platform" className="transition hover:text-white">
              Platform
            </a>
            <a href="#github" className="transition hover:text-white">
              GitHub
            </a>
            <a href="#workflow" className="transition hover:text-white">
              Workflow
            </a>
          </div>

          <Link
            to="/login"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
          >
            Login
          </Link>
        </div>
      </header>

      <main>
        <section className="relative z-10 min-h-screen pt-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 pb-20 pt-24 lg:min-h-[calc(100vh-80px)] lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-8 inline-flex animate-[float_6s_ease-in-out_infinite] items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-5 py-2.5 text-sm text-blue-300 shadow-[0_0_40px_rgba(59,130,246,0.12)]">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                Built for developers
              </div>

              <h1 className="text-6xl font-semibold leading-[0.95] tracking-tight md:text-8xl">
                Track your
                <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-violet-400 bg-clip-text text-transparent">
                  technical evolution
                </span>
              </h1>

              <p className="mt-9 max-w-2xl text-lg leading-relaxed text-zinc-400 md:text-xl">
                Monitor study sessions, streaks, goals, GitHub analytics and
                productivity metrics inside one modern developer-focused
                dashboard.
              </p>

              <div className="mt-11 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="group flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  Start Tracking
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:border-blue-400/40 hover:bg-blue-500/10"
                >
                  <GitBranch className="h-4 w-4" />
                  Connect GitHub
                </Link>
              </div>

              <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
                {heroStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5 backdrop-blur transition hover:-translate-y-1 hover:border-blue-400/30"
                  >
                    <p className="text-3xl font-semibold">{item.value}</p>
                    <p className="mt-2 text-sm text-zinc-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full max-w-2xl">
              <div className="animate-[float_7s_ease-in-out_infinite] rounded-[28px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_30px_120px_rgba(79,70,229,0.18)] backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Dashboard Overview</p>
                    <h2 className="mt-2 text-3xl font-semibold">
                      Your progress
                    </h2>
                  </div>

                  <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
                    Active Streak
                  </div>
                </div>

                <div className="flex h-64 items-end gap-3 rounded-3xl border border-white/10 bg-black p-5">
                  {dashboardBars.map((height, index) => (
                    <div key={index} className="flex flex-1 flex-col justify-end">
                      <div
                        style={{ height }}
                        className="rounded-t-2xl bg-gradient-to-t from-blue-500 to-violet-500 shadow-[0_0_24px_rgba(99,102,241,0.25)] transition duration-500 hover:scale-y-105"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <MetricCard
                    icon={BarChart3}
                    label="Weekly Growth"
                    value="+23%"
                    tone="blue"
                  />
                  <MetricCard
                    icon={Flame}
                    label="Current Streak"
                    value="18 Days"
                    tone="orange"
                  />
                </div>

                <div className="mt-5 rounded-3xl border border-white/10 bg-black p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">
                        GitHub Integration
                      </p>
                      <h3 className="mt-2 text-xl font-semibold">
                        Connected Successfully
                      </h3>
                    </div>
                    <GitBranch className="h-5 w-5 text-zinc-500" />
                  </div>

                  <div className="mt-6 grid gap-2 [grid-template-columns:repeat(14,minmax(0,1fr))]">
                    {contributionCells.map((color, index) => (
                      <div
                        key={index}
                        className={`h-9 rounded-lg ${color} transition hover:scale-110`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="relative z-10 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-28">
            <SectionIntro
              eyebrow="Platform"
              title="A product surface for consistent developers"
              description="DevTracker is built around the real rules of the product: active quotas, focus-first task management, goal tracking, session time and GitHub analytics."
            />

            <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {productHighlights.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 overflow-hidden border-t border-white/10">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionIntro
                eyebrow="Operating system"
                title="Your week becomes visible"
                description="The overview reads your current state from tasks, goals, sessions and GitHub so you can see progress without manually building reports."
              />

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  ["20", "active focuses per user"],
                  ["25", "tasks per focus"],
                  ["30", "active goals per user"],
                  ["24/7", "session island persistence"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6"
                  >
                    <p className="text-3xl font-semibold text-white">{value}</p>
                    <p className="mt-2 text-sm text-zinc-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-zinc-950/80 p-6 shadow-[0_30px_120px_rgba(37,99,235,0.12)]">
              <div className="grid gap-4 md:grid-cols-2">
                <Panel title="Tasks" icon={CheckCircle2}>
                  {["Build OAuth polish", "Finish PostgreSQL migration", "Review streak logic"].map(
                    (task) => (
                      <div
                        key={task}
                        className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black px-4 py-3 text-sm text-zinc-300"
                      >
                        <span className="h-2 w-2 rounded-full bg-blue-400" />
                        {task}
                      </div>
                    )
                  )}
                </Panel>

                <Panel title="Goals" icon={Target}>
                  {["Launch MVP", "Master backend architecture", "Improve technical English"].map(
                    (goal) => (
                      <div
                        key={goal}
                        className="rounded-2xl border border-white/5 bg-black px-4 py-3"
                      >
                        <p className="text-sm text-white">{goal}</p>
                        <div className="mt-3 h-2 rounded-full bg-zinc-800">
                          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                        </div>
                      </div>
                    )
                  )}
                </Panel>
              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-black p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400">
                      <TimerReset className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">Deep Work Session</p>
                      <p className="text-2xl font-semibold">01:24:18</p>
                    </div>
                  </div>
                  <button className="h-10 w-10 rounded-xl bg-red-500/15 text-red-300">
                    ■
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="github" className="relative z-10 border-t border-white/10">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-28 lg:grid-cols-2 lg:items-center">
            <div className="rounded-[32px] border border-white/10 bg-zinc-950/80 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Contribution Graph</p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    GitHub signal, not guesswork
                  </h3>
                </div>
                <GitBranch className="h-6 w-6 text-emerald-400" />
              </div>

              <div className="grid gap-2 [grid-template-columns:repeat(14,minmax(0,1fr))]">
                {Array.from({ length: 84 }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-7 rounded-md transition hover:scale-110 ${
                      index % 7 === 0 || index % 11 === 0
                        ? "bg-emerald-500"
                        : index % 5 === 0
                        ? "bg-emerald-700"
                        : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionIntro
                eyebrow="GitHub Analytics"
                title="Frequency based on your contribution calendar"
                description="DevTracker reads the GitHub GraphQL contribution calendar so streaks and frequency follow the same source of truth you see on GitHub."
              />

              <div className="mt-10 space-y-4">
                {githubSignals.map((signal) => (
                  <div
                    key={signal}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950/70 p-4 text-sm text-zinc-300"
                  >
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    {signal}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="relative z-10 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-28">
            <SectionIntro
              eyebrow="Workflow"
              title="From intent to visible progress"
              description="A clean daily loop for developers who want to measure consistency without turning their study routine into admin work."
            />

            <div className="mt-16 grid gap-5 lg:grid-cols-4">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 transition hover:-translate-y-1 hover:border-violet-400/30"
                >
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-28">
            <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-zinc-950 to-black p-8 shadow-[0_30px_120px_rgba(79,70,229,0.16)] md:p-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
                    <Sparkles className="h-4 w-4" />
                    Ready for your next sprint
                  </div>

                  <h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                    Build consistency before you need motivation.
                  </h2>

                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
                    Start with focus areas, connect GitHub, track real work
                    sessions and let the overview show your technical momentum.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                  <Link
                    to="/register"
                    className="group flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-semibold text-black transition hover:scale-[1.02]"
                  >
                    Create account
                    <Rocket className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>

                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
                  >
                    <LockKeyhole className="h-4 w-4" />
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
                <img
                  src={DevLogo}
                  alt="DevTracker Logo"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold">DevTracker</h3>
                <p className="text-xs text-zinc-500">
                  Technical Evolution Platform
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500">
              A modern SaaS platform focused on developer growth, consistency,
              productivity and technical evolution.
            </p>
          </div>

          <div className="flex flex-col gap-6 md:items-end">
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <a href="#platform" className="transition hover:text-white">
                Platform
              </a>
              <a href="#github" className="transition hover:text-white">
                GitHub
              </a>
              <a href="#workflow" className="transition hover:text-white">
                Workflow
              </a>
              <a
                href="https://www.linkedin.com/in/daniel-breves/"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                Developer's LinkedIn
              </a>
            </div>

            <p className="text-xs text-zinc-600">
              2026 DevTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, tone }) {
  const toneClass =
    tone === "orange"
      ? "bg-orange-500/10 text-orange-400"
      : "bg-blue-500/10 text-blue-400";

  return (
    <div className="rounded-3xl border border-white/10 bg-black p-5">
      <div className="flex items-center gap-4">
        <div className={`rounded-2xl p-3 ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-zinc-950/80 p-6 transition hover:-translate-y-1 hover:border-blue-400/30">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black transition group-hover:border-blue-400/30">
        <Icon className="h-5 w-5 text-blue-400" />
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-500">
        {description}
      </p>
    </div>
  );
}

function SectionIntro({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-blue-400">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
        {title}
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-zinc-400">
        {description}
      </p>
    </div>
  );
}

function Panel({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-white/5 p-3 text-blue-400">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
