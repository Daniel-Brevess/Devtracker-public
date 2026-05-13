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
  ShieldCheck,
} from "lucide-react";

import { getCurrentUser, getUserInitials } from "../../services/userService";

export default function Profile() {
  const user = getCurrentUser();
  const userInitials = getUserInitials();

  const stacks = user?.stacks || [];
  const achievements = user?.achievements || [];
  const recentEvolution = user?.recentEvolution || [];

  const bio =
    user?.bio ||
    "Nenhuma bio adicionada ainda. Edite seu perfil para adicionar uma descrição.";

  const location = user?.location || "Localização não adicionada";
  const website = user?.website || "Website não adicionado";
  const joinedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : "Data de entrada indisponível";

  const GitHubIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-current"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <nav className="relative z-10 flex h-20 items-center justify-between border-b border-white/5 bg-black/20 px-8 backdrop-blur-md">
        <Link
          to="/dashboard22"
          className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>

        <Link
          to="/profileedit"
          className="rounded-xl border border-white/10 bg-white/5 p-2.5 transition-all hover:bg-white/10"
        >
          <Settings className="h-5 w-5 text-zinc-400" />
        </Link>
      </nav>

      <main className="relative z-10 mx-auto max-w-5xl px-8 py-12">
        <div className="rounded-[40px] border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-2xl">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-2 border-white/10 bg-gradient-to-tr from-blue-500 to-violet-500 p-1">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-zinc-900">
                  <span className="text-4xl font-bold">
                    {userInitials}
                  </span>
                </div>
              </div>

              <div
                className="absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-zinc-950 bg-green-500"
                title="Online"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <h1 className="text-4xl font-bold">
                  {user?.name || "Usuário"}
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                  <ShieldCheck className="h-3 w-3" />
                  Verified Developer
                </span>
              </div>

              <p className="mt-2 text-lg text-zinc-400">
                @{user?.username || "username"}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-zinc-500 md:justify-start">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {location}
                </div>

                <div className="flex items-center gap-1.5">
                  <LinkIcon className="h-4 w-4" />
                  {website}
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Joined {joinedAt}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 text-center">
              <div className="mb-3 flex justify-center text-white">
                <GitHubIcon />
              </div>

              <p className="text-xs uppercase tracking-widest text-zinc-500">
                GitHub Status
              </p>

              <p className="mt-1 text-sm font-semibold text-zinc-500">
                Not connected
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-1">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Mail className="h-4 w-4 text-blue-400" />
                Bio
              </h3>

              <p className="text-sm leading-relaxed text-zinc-400">
                {bio}
              </p>

              {user?.email && (
                <p className="mt-4 text-xs text-zinc-600">
                  {user.email}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Code2 className="h-4 w-4 text-violet-400" />
                Stacks
              </h3>

              {stacks.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {stacks.map((stack) => (
                    <span
                      key={stack}
                      className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-zinc-300"
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  Você ainda não adicionou nenhuma stack.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-8">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                <Award className="h-5 w-5 text-orange-400" />
                Achievements
              </h3>

              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-2xl border border-white/5 bg-black/40 p-4 transition hover:border-white/20"
                    >
                      <div className="text-2xl">
                        {achievement.icon || "🏆"}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold">
                          {achievement.title}
                        </h4>

                        <p className="text-xs text-zinc-500">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-black/40 p-6">
                  <p className="text-sm text-zinc-500">
                    Você ainda não possui conquistas. Complete sessões,
                    metas e atividades para desbloquear achievements.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Recent Evolution
                </h3>

                <button className="text-xs text-blue-400 hover:underline">
                  View History
                </button>
              </div>

              {recentEvolution.length > 0 ? (
                <div className="space-y-6">
                  {recentEvolution.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-l-2 border-white/10 py-1 pl-4"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {item.activity}
                        </p>

                        <p className="text-xs text-zinc-500">
                          {item.time}
                        </p>
                      </div>

                      <span className="font-mono text-xs text-green-400">
                        {item.xp}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-black/40 p-6">
                  <p className="text-sm text-zinc-500">
                    Nenhuma evolução registrada ainda. Quando você
                    registrar sessões, tarefas ou metas, elas aparecerão aqui.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}