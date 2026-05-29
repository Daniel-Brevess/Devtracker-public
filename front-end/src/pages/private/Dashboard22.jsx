import { useCallback, useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  ListChecks,
  Target,
  Timer,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  CreditCard,
  Play,
  Square,
  UserCircle2,
  Lock,
  X,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import api from "../../services/api";
import { createSession } from "../../services/session/sessionService";
import { getOverviewData } from "../../services/overview/overviewService";
import { logout } from "../../services/tokenService";
import {
  getCurrentUser,
  getDisplayUsername,
  getUserInitials,
  isGitHubUser,
} from "../../services/user/userService";
import { getApiErrorMessage } from "../../utils/apiError";

import DevLogo from "../../assets/DevLogoBranco.png";
import GoalsSection from "./sections/GoalsSection";
import OverviewSection from "./sections/OverviewSection";
import TasksSection from "./sections/TasksSection";
import AdminAnalyticsSection from "./sections/AdminAnalyticsSection";
import { isAdminUser } from "../../services/admin/adminService";

const activeSessionStorageKey = "devtracker.activeSession";

const sessionTypeOptions = [
  { label: "Focus", value: "FOCUS" },
  { label: "Study", value: "STUDY" },
  { label: "Deep Work", value: "DEEP_WORK" },
  { label: "Break", value: "BREAK" },
];

const sessionDurationOptions = [
  { label: "15 min", value: 900 },
  { label: "25 min", value: 1500 },
  { label: "45 min", value: 2700 },
  { label: "60 min", value: 3600 },
];

function getSessionTypeLabel(type) {
  return (
    sessionTypeOptions.find((option) => option.value === type)?.label ||
    "Session"
  );
}

function formatSessionDuration(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function formatProfileHours(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds || 0);
  const hours = safeSeconds / 3600;

  if (hours < 1) {
    return `${Math.round(safeSeconds / 60)}m`;
  }

  return `${hours.toFixed(hours >= 10 ? 0 : 1)}h`;
}

function getSessionElapsedSeconds(session) {
  if (!session?.startedAt) return 0;

  return Math.max(
    0,
    Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 1000)
  );
}

function readStoredActiveSession() {
  try {
    const storedSession = localStorage.getItem(activeSessionStorageKey);

    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    localStorage.removeItem(activeSessionStorageKey);

    return null;
  }
}

export default function Dashboard2() {
  const navigate = useNavigate();

  const user = getCurrentUser();
  const userInitials = getUserInitials();
  const isGitHubAccount = isGitHubUser(user);
  const isAdminAccount = isAdminUser(user);
  const displayUsername = getDisplayUsername(user);

  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [profileStats, setProfileStats] = useState(null);
  const [isProfileStatsLoading, setIsProfileStatsLoading] = useState(false);
  const [isSettingsCardOpen, setIsSettingsCardOpen] = useState(false);
  const [isSessionCardOpen, setIsSessionCardOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedSessionType, setSelectedSessionType] = useState("FOCUS");
  const [selectedSessionDuration, setSelectedSessionDuration] = useState(1500);
  const [activeSession, setActiveSession] = useState(readStoredActiveSession);
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    getSessionElapsedSeconds(readStoredActiveSession())
  );
  const [sessionMessage, setSessionMessage] = useState("");
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteAccountMessage, setDeleteAccountMessage] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const profileCardRef = useRef(null);
  const settingsCardRef = useRef(null);
  const sessionCardRef = useRef(null);

  const finishActiveSession = useCallback(
    async (durationSeconds) => {
      if (!activeSession || isSavingSession) return;

      const realDuration = Math.max(0, durationSeconds);
      setIsSavingSession(true);
      setSessionMessage("");

      try {
        await createSession({
          type: activeSession.type,
          duration: realDuration,
        });

        setActiveSession(null);
      } catch (error) {
        setSessionMessage(
          getApiErrorMessage(error, "Could not save session. Try again.")
        );
      } finally {
        setIsSavingSession(false);
      }
    },
    [activeSession, isSavingSession]
  );

    useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileCardRef.current &&
        !profileCardRef.current.contains(event.target)
      ) {
        setIsProfileCardOpen(false);
      }

      if (
        settingsCardRef.current &&
        !settingsCardRef.current.contains(event.target)
      ) {
        setIsSettingsCardOpen(false);
        setIsAccountOpen(false);
      }

      if (
        sessionCardRef.current &&
        !sessionCardRef.current.contains(event.target)
      ) {
        setIsSessionCardOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!activeSession) {
      localStorage.removeItem(activeSessionStorageKey);
      return;
    }

    localStorage.setItem(
      activeSessionStorageKey,
      JSON.stringify(activeSession)
    );
  }, [activeSession]);

  useEffect(() => {
    if (!activeSession) return;

    const intervalId = window.setInterval(() => {
      const nextElapsedSeconds = getSessionElapsedSeconds(activeSession);
      setElapsedSeconds(nextElapsedSeconds);

      if (
        !isSavingSession &&
        nextElapsedSeconds >= activeSession.plannedDuration
      ) {
        finishActiveSession(activeSession.plannedDuration);
      }
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeSession, finishActiveSession, isSavingSession]);

  const loadProfileStats = useCallback(async () => {
    if (profileStats || isProfileStatsLoading) return;

    setIsProfileStatsLoading(true);

    try {
      const overviewData = await getOverviewData();

      setProfileStats({
        commits: overviewData.github.commitsLastSevenDays,
        repositories:
          overviewData.github.totalRepos ?? overviewData.github.publicRepos,
        sessionDuration: overviewData.sessions.totalDuration,
        streak: overviewData.streak.currentStreak,
      });
    } catch {
      setProfileStats({
        commits: 0,
        repositories: 0,
        sessionDuration: 0,
        streak: 0,
      });
    } finally {
      setIsProfileStatsLoading(false);
    }
  }, [isProfileStatsLoading, profileStats]);

  function handleProfileCardToggle() {
    const nextIsOpen = !isProfileCardOpen;

    setIsProfileCardOpen(nextIsOpen);

    if (nextIsOpen) {
      loadProfileStats();
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function startSession() {
    setActiveSession({
      type: selectedSessionType,
      plannedDuration: selectedSessionDuration,
      startedAt: new Date().toISOString(),
    });
    setElapsedSeconds(0);
    setSessionMessage("");
    setIsSessionCardOpen(false);
  }

  function stopActiveSession() {
    if (!activeSession) return;

    finishActiveSession(getSessionElapsedSeconds(activeSession));
  }

  function openDeleteAccountModal() {
    setDeleteConfirmation("");
    setDeleteAccountMessage("");
    setIsSettingsCardOpen(false);
    setIsAccountOpen(false);
    setIsDeleteAccountModalOpen(true);
  }

  function closeDeleteAccountModal() {
    if (isDeletingAccount) return;

    setDeleteConfirmation("");
    setDeleteAccountMessage("");
    setIsDeleteAccountModalOpen(false);
  }

  async function handleDeleteAccount(event) {
    event.preventDefault();

    setDeleteAccountMessage("");

    if (!deleteConfirmation) {
      setDeleteAccountMessage(
        isGitHubAccount
          ? "Type your account email to confirm."
          : "Insert your current password."
      );
      return;
    }

    const deletePayload = isGitHubAccount
      ? { confirmationEmail: deleteConfirmation.trim() }
      : { password: deleteConfirmation };

    setIsDeletingAccount(true);

    try {
      await api.delete("/user/delete", {
        data: deletePayload,
      });

      logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setDeleteAccountMessage(
        getApiErrorMessage(
          error,
          isGitHubAccount
            ? "The email confirmation does not match. Account could not be deleted."
            : "The password is not correct. Account could not be deleted."
        )
      );
    } finally {
      setIsDeletingAccount(false);
    }
  }

  const menuItems = [
    { icon: LayoutDashboard, id: "overview", label: "Overview" },
    { icon: ListChecks, id: "tasks", label: "Tasks" },
    { icon: Target, id: "goals", label: "Goals" },
    { icon: Timer, id: "sessions", label: "Sessions" },
    ...(isAdminAccount
      ? [{ icon: ShieldCheck, id: "admin", label: "Admin" }]
      : []),
    { icon: Settings, id: "settings", label: "Settings" },
  ];

  const sectionById = {
    overview: <OverviewSection />,
    tasks: <TasksSection />,
    goals: <GoalsSection />,
    admin: <AdminAnalyticsSection />,
  };
  const remainingSessionSeconds = activeSession
    ? Math.max(activeSession.plannedDuration - elapsedSeconds, 0)
    : 0;
  const sessionTimerLabel = formatSessionDuration(remainingSessionSeconds);

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
  {menuItems.map((item) => {
    const Icon = item.icon;

    if (item.id === "sessions") {
      return (
        <div ref={sessionCardRef} key={item.label} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsSessionCardOpen((currentState) => !currentState);
              setIsSettingsCardOpen(false);
              setIsAccountOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isSessionCardOpen || activeSession
                ? "border border-white/10 bg-white/10 text-white"
                : "text-zinc-500 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </button>

          {isSessionCardOpen && (
            <div className="absolute left-full top-0 z-[80] ml-3 w-80 rounded-3xl border border-white/10 bg-zinc-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Start session
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                    Choose a type and time. The real duration is saved when it
                    stops.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSessionCardOpen(false)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white"
                  aria-label="Close session card"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <label className="block space-y-2">
                  <span className="text-xs font-medium text-zinc-500">
                    Type
                  </span>
                  <div className="relative">
                    <select
                      value={selectedSessionType}
                      onChange={(event) =>
                        setSelectedSessionType(event.target.value)
                      }
                      disabled={Boolean(activeSession)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sessionTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  </div>
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-medium text-zinc-500">
                    Time
                  </span>
                  <div className="relative">
                    <select
                      value={selectedSessionDuration}
                      onChange={(event) =>
                        setSelectedSessionDuration(Number(event.target.value))
                      }
                      disabled={Boolean(activeSession)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {sessionDurationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  </div>
                </label>

                {sessionMessage && (
                  <span className="block text-xs text-red-400">
                    {sessionMessage}
                  </span>
                )}

                <button
                  type="button"
                  onClick={startSession}
                  disabled={Boolean(activeSession)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Play className="h-4 w-4" />
                  {activeSession ? "Session running" : "Start"}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (item.id === "settings") {
      return (
        <div ref={settingsCardRef} key={item.label}>
          <button
            type="button"
            onClick={() =>
              setIsSettingsCardOpen((currentState) => !currentState)
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 transition-all hover:bg-white/5 hover:text-white"
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </button>

{isSettingsCardOpen && (
  <div className="mt-2 rounded-3xl border border-white/10 bg-zinc-950/95 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
    <div className="space-y-1">
      {/* Account */}
      <div>
        <button
          type="button"
          onClick={() =>
            setIsAccountOpen((currentState) => !currentState)
          }
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-400 transition-all hover:bg-white/5 hover:text-white"
        >
          <UserCircle2 className="h-4 w-4" />
          Account
        </button>

        {isAccountOpen && (
          <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
        <Link
          to="/profileedit22"
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-500 transition-all hover:bg-white/5 hover:text-white"
        >
          <span className="font-mono text-blue-400">{">"}</span>
          {isGitHubAccount ? "Account data" : "Edit profile"}
        </Link>

            <button
              type="button"
              onClick={openDeleteAccountModal}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-400"
            >
              <span className="font-mono text-red-400">{">"}</span>
              Delete account
            </button>
          </div>
        )}
      </div>

      {/* Plan */}
      <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-400 transition-all hover:bg-emerald-500/10 hover:text-emerald-400">
        <CreditCard className="h-4 w-4" />
        Plan
      </button>

      <div className="my-2 h-px bg-white/5" />

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  </div>
)}
        </div>
      );
    }

    return (
      <button
        key={item.label}
        type="button"
        onClick={() => {
          setActiveSection(item.id);
          setIsSettingsCardOpen(false);
          setIsAccountOpen(false);
        }}
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
          activeSection === item.id
            ? "border border-white/10 bg-white/10 text-white"
            : "text-zinc-500 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon className="h-5 w-5" />
        {item.label}
      </button>
    );
  })}
</nav>
      </aside>

      {isDeleteAccountModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Delete account
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {isGitHubAccount
                    ? "Type your account email to permanently delete your GitHub-linked account."
                    : "Enter your current password to permanently delete your account."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDeleteAccountModal}
                disabled={isDeletingAccount}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleDeleteAccount} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <Lock className="h-3 w-3" />
                  {isGitHubAccount ? "Confirmation Email" : "Current Password"}
                </label>

                <input
                  name="deleteConfirmation"
                  type={isGitHubAccount ? "email" : "password"}
                  value={deleteConfirmation}
                  onChange={(event) => {
                    setDeleteConfirmation(event.target.value);
                    setDeleteAccountMessage("");
                  }}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition-all focus:border-red-500/50"
                />
              </div>

              {deleteAccountMessage && (
                <span className="block text-sm text-red-400">
                  {deleteAccountMessage}
                </span>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteAccountModal}
                  disabled={isDeletingAccount}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isDeletingAccount}
                  className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeletingAccount ? "Deleting..." : "Delete account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="relative z-10 ml-64 flex h-screen flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center justify-end border-b border-white/10 bg-black/10 px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {activeSession && (
              <div className="flex items-center gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-blue-100 shadow-lg shadow-blue-500/10">
                <div className="flex min-w-0 flex-col">
                  <span className="max-w-32 truncate text-xs font-medium text-blue-200">
                    {getSessionTypeLabel(activeSession.type)}
                  </span>
                  <span className="font-mono text-sm font-semibold text-white">
                    {sessionTimerLabel}
                  </span>
                </div>

                {sessionMessage && (
                  <span className="hidden max-w-44 truncate text-xs text-red-300 lg:block">
                    {sessionMessage}
                  </span>
                )}

                <button
                  type="button"
                  onClick={stopActiveSession}
                  disabled={isSavingSession}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-black transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Stop session"
                >
                  <Square className="h-4 w-4 fill-current" />
                </button>
              </div>
            )}

            <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-400 transition-all hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
            </button>

            {/* Profile Button + Card */}
            <div ref={profileCardRef} className="relative">
              <button
                type="button"
                onClick={handleProfileCardToggle}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-tr from-blue-500 to-violet-500 p-[2px] transition-all hover:scale-[1.03]"
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white">
                  {userInitials}
                </div>
              </button>

              {isProfileCardOpen && (
                <div className="absolute right-0 top-14 w-72 rounded-3xl border border-white/10 bg-zinc-950/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-tr from-blue-500 to-violet-500 p-[2px]">
                      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-zinc-950 text-sm font-bold text-white">
                        {userInitials}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {user?.name || "User"}
                      </h3>

                      <p className="mt-1 truncate text-xs text-zinc-500">
                        @{displayUsername}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      ["Streak", `${profileStats?.streak ?? 0}d`],
                      ["Commits", profileStats?.commits ?? 0],
                      ["Repos", profileStats?.repositories ?? 0],
                      [
                        "Sessions",
                        formatProfileHours(profileStats?.sessionDuration),
                      ],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/5 bg-black/40 p-3"
                      >
                        <p className="text-[11px] text-zinc-600">{label}</p>
                        <p className="mt-1 truncate text-lg font-semibold text-white">
                          {isProfileStatsLoading ? "--" : value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {sectionById[activeSection]}
      </main>
    </div>
  );
}
