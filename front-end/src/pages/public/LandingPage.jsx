import { Link } from "react-router-dom";

import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Flame,
  Target,
} from "lucide-react";

import DevLogo from "../../assets/DevLogoBranco.png";

export default function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
<div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
  <img
    src={DevLogo}
    alt="DevTrack Logo"
    className="h-full w-full object-cover"
  />
</div>

            <div>
              <h1 className="text-sm font-semibold tracking-wide">
                DevTracker
              </h1>

              <p className="text-[11px] text-zinc-500">
                Technical Evolution Platform
              </p>
            </div>
          </div>
                        <Link
  to="/login" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10">
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
<section className="relative z-10 pt-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 pb-24 pt-20 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Built for developers
            </div>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              Track your
              <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                technical evolution
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">
              Monitor study sessions, streaks, goals, GitHub
              analytics and productivity metrics inside one modern
              developer-focused dashboard.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
  to="/register" className="group flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]">
                Start Tracking

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>

              <Link
  to="/register" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10">
                Connect GitHub
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                {
                  value: "120h+",
                  label: "Study Hours",
                },
                {
                  value: "43",
                  label: "Tasks Done",
                },
                {
                  value: "18",
                  label: "Day Streak",
                },
                {
                  value: "+74%",
                  label: "Consistency",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-zinc-950 p-5"
                >
                  <p className="text-2xl font-semibold">
                    {item.value}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard */}
          <div className="w-full max-w-xl">
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    Dashboard Overview
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold">
                    Your progress
                  </h2>
                </div>

                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                  Active Streak
                </div>
              </div>

              {/* Fake Chart */}
              <div className="flex h-52 items-end gap-3 rounded-2xl border border-white/10 bg-black p-4">
                {[45, 70, 60, 90, 55, 120, 85].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex flex-1 flex-col justify-end"
                    >
                      <div
                        style={{ height }}
                        className="rounded-t-xl bg-gradient-to-t from-blue-500 to-violet-500"
                      />
                    </div>
                  )
                )}
              </div>

              {/* Cards */}
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                      <BarChart3 className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">
                        Weekly Growth
                      </p>

                      <h3 className="text-xl font-semibold">
                        +23%
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
                      <Flame className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm text-zinc-500">
                        Current Streak
                      </p>

                      <h3 className="text-xl font-semibold">
                        18 Days
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Grid */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-black p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">
                      GitHub Integration
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      Connected Successfully
                    </h3>
                  </div>

                  <div className="text-sm text-zinc-500">
                    GitHub
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {Array.from({ length: 18 }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-8 w-8 rounded-md ${
                        index % 4 === 0
                          ? "bg-green-500/80"
                          : index % 3 === 0
                          ? "bg-green-500/50"
                          : "bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-blue-400">
              FEATURES
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              Built for focused technical growth
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              DevTrack combines productivity, analytics and
              developer-focused metrics into one premium platform.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: CheckCircle2,
                title: "Study Sessions",
                description:
                  "Track coding sessions and learning hours.",
              },
              {
                icon: Target,
                title: "Goals System",
                description:
                  "Set goals and monitor technical growth.",
              },
              {
                icon: Flame,
                title: "Consistency",
                description:
                  "Build streaks and maintain discipline.",
              },
              {
                icon: Activity,
                title: "Analytics",
                description:
                  "Monitor developer activity and evolution.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-zinc-950 p-6 transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black">
                  <feature.icon className="h-5 w-5 text-blue-400" />
                </div>

                <h3 className="text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
<footer className="relative z-10 border-t border-white/10">
  <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 md:flex-row md:items-center md:justify-between">
    {/* Left */}
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
          <img
            src={DevLogo}
            alt="DevTrack Logo"
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            DevTrack
          </h3>

          <p className="text-xs text-zinc-500">
            Technical Evolution Platform
          </p>
        </div>
      </div>

      <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500">
        A modern SaaS platform focused on developer growth,
        consistency, productivity and technical evolution.
      </p>
    </div>

    {/* Right */}
    <div className="flex flex-col gap-6 md:items-end">
      <div className="flex items-center gap-6 text-sm text-zinc-500">
        <a
          href="#"
          className="transition hover:text-white"
        >
          Features
        </a>

        <a
          href="#"
          className="transition hover:text-white"
        >
          Dashboard
        </a>

        <a
          href="#"
          className="transition hover:text-white"
        >
          Contact
        </a>
      </div>

      <p className="text-xs text-zinc-600">
        © 2026 DevTrack. All rights reserved.
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}