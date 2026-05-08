import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  Flame,
  Settings,
  LogOut,
  Bell,
  User,
  Terminal,
} from "lucide-react";

import DevLogo from "../../assets/DevLogoBranco.png";

export default function Dashboard2() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Target, label: "Goals", active: false },
    { icon: Flame, label: "Streaks", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/10 bg-zinc-950/50 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
              <img
                src={DevLogo}
                alt="DevTracker Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <span className="font-semibold tracking-tight">
              DevTracker
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                item.active
                  ? "border border-white/10 bg-white/10 text-white"
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            to="/"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="relative z-10 ml-64 flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-end border-b border-white/10 bg-black/20 px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-400 transition-all hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
            </button>

            <Link
              to="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all hover:text-white"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </header>

        {/* Empty Center */}
        <section className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-zinc-950/70 text-blue-400 backdrop-blur-sm">
              <Terminal className="h-12 w-12" />
            </div>

            <h1 className="mt-6 text-2xl font-semibold">
              DevTracker Workspace
            </h1>

            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Dashboard base ready to receive the next MVP features.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}