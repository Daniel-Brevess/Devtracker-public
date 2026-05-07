import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Target,
  Flame,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus
} from "lucide-react";

import DevLogo from "../../assets/DevLogoBranco.png";

export default function Dashboard() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: Target, label: "Goals", active: false },
    { icon: Flame, label: "Streaks", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Background Glows Fixo */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      {/* --- SIDEBAR --- */}
      <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/10 bg-zinc-950/50 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
              <img src={DevLogo} alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-semibold tracking-tight">DevTrack</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                item.active 
                  ? "bg-white/10 text-white border border-white/10" 
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="ml-64 flex-1 relative z-10">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between border-b border-white/10 px-8 bg-black/20 backdrop-blur-md">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search analytics..." 
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-400 hover:text-white transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
            </button>
            <div className="h-10 w-10 rounded-full border border-white/10 bg-gradient-to-tr from-blue-500 to-violet-500 p-[2px]">
              <div className="h-full w-full rounded-full bg-zinc-950 flex items-center justify-center text-xs font-bold">
                DN
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Overview</h2>
              <p className="text-zinc-500">Welcome back, John. Here is your evolution today.</p>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-black hover:scale-[1.02] transition-all">
              <Plus className="h-4 w-4" />
              New Goal
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Study Hours", value: "120h+", sub: "+12% from last week", color: "text-blue-400" },
              { label: "Day Streak", value: "18 Days", sub: "Personal Best: 24", color: "text-orange-400" },
              { label: "Consistency", value: "94%", sub: "Top 5% of devs", color: "text-green-400" },
              { label: "Tasks Done", value: "43", sub: "8 pending for today", color: "text-violet-400" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-sm">
                <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                <h3 className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
                <p className="mt-2 text-xs text-zinc-600">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Chart */}
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-zinc-950/50 p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Technical Evolution</h3>
                <select className="bg-transparent text-sm text-zinc-500 outline-none">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="flex h-64 items-end gap-3 px-2">
                {[40, 65, 45, 90, 55, 100, 80].map((h, i) => (
                  <div key={i} className="group relative flex-1">
                    <div 
                      style={{ height: `${h}%` }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-600/40 to-blue-400 transition-all group-hover:to-violet-400"
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600">Day {i+1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Style Grid */}
            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-8">
              <h3 className="mb-6 text-lg font-semibold">Contributions</h3>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-12 rounded-lg transition-all hover:scale-110 ${
                      i % 5 === 0 ? "bg-green-500/60" : i % 3 === 0 ? "bg-green-500/20" : "bg-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Total Commits</span>
                  <span className="font-mono">842</span>
                </div>
                <div className="h-[1px] w-full bg-white/5" />
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Repositories</span>
                  <span className="font-mono">24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}