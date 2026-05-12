import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Settings, 
  MapPin, 
  Link as LinkIcon, 
  Mail, 
  Calendar,
  Code2,
  Award,
  ShieldCheck
} from "lucide-react";

export default function Profile() {
  // SVG do GitHub que já usamos para manter a consistência e evitar erros
  const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      {/* Header/Nav */}
      <nav className="relative z-10 flex h-20 items-center justify-between px-8 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <Link to="/dashboard22" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>
        <button className="rounded-xl border border-white/10 bg-white/5 p-2.5 hover:bg-white/10 transition-all">
          <Settings className="h-5 w-5 text-zinc-400" />
        </button>
      </nav>

      <main className="relative z-10 mx-auto max-w-5xl px-8 py-12">
        {/* Profile Hero Card */}
        <div className="rounded-[40px] border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar com gradiente de borda */}
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-2 border-white/10 bg-gradient-to-tr from-blue-500 to-violet-500 p-1">
                <div className="h-full w-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                   {/* Placeholder para foto do usuário */}
                   <span className="text-4xl font-bold">JD</span>
                </div>
              </div>
              <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-zinc-950 bg-green-500" title="Online" />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-4xl font-bold">John Doe</h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Developer
                </span>
              </div>
              <p className="mt-2 text-zinc-400 text-lg">Fullstack Developer | React & Node.js Specialist</p>
              
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> São Paulo, Brazil
                </div>
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="h-4 w-4" /> jdoe.dev
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> Joined May 2026
                </div>
              </div>
            </div>

            {/* GitHub Connect Status */}
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-center">
              <div className="flex justify-center text-white mb-3">
                <GitHubIcon />
              </div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">GitHub Status</p>
              <p className="text-sm font-semibold text-green-400 mt-1">Connected</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: About & Skills */}
          <div className="space-y-8 lg:col-span-1">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" /> Bio
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                Passionate about clean code and modern architectures. Currently focusing on building scalable technical evolution tools for the dev community.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code2 className="h-4 w-4 text-violet-400" /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Node.js", "Tailwind", "Next.js", "PostgreSQL", "Docker"].map(skill => (
                  <span key={skill} className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Achievements & Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-400" /> Achievements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Early Adopter", desc: "One of the first 100 users.", date: "May 2026", icon: "🚀" },
                  { title: "7 Day Streak", desc: "Consistent daily study session.", date: "Active", icon: "🔥" },
                  { title: "Open Source", desc: "Connected 5+ repositories.", date: "Jun 2026", icon: "📦" },
                  { title: "Fast Learner", desc: "Completed 20h of React.", date: "Jun 2026", icon: "🧠" }
                ].map((ach, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-black/40 p-4 transition-hover hover:border-white/20">
                    <div className="text-2xl">{ach.icon}</div>
                    <div>
                      <h4 className="text-sm font-bold">{ach.title}</h4>
                      <p className="text-xs text-zinc-500">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Activity Preview */}
            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-8">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Recent Evolution</h3>
                  <button className="text-xs text-blue-400 hover:underline">View History</button>
               </div>
               <div className="space-y-6">
                  {[
                    { activity: "Completed 'Advanced TypeScript' session", time: "2 hours ago", xp: "+450 XP" },
                    { activity: "Updated GitHub Repository: 'dev-tracker-pro'", time: "Yesterday", xp: "+120 XP" },
                    { activity: "Reached 18 days streak milestone", time: "2 days ago", xp: "+1000 XP" }
                  ].map((act, i) => (
                    <div key={i} className="flex items-center justify-between border-l-2 border-white/10 pl-4 py-1">
                      <div>
                        <p className="text-sm font-medium">{act.activity}</p>
                        <p className="text-xs text-zinc-500">{act.time}</p>
                      </div>
                      <span className="text-xs font-mono text-green-400">{act.xp}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}