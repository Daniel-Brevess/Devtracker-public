import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  ListChecks,
  Target,
  Timer,
  Settings,
  LogOut,
  Bell,
  CreditCard,
  UserCircle2,
  Lock,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import api from "../../services/api";
import { logout } from "../../services/tokenService";
import { getCurrentUser, getUserInitials } from "../../services/user/userService";
import { getApiErrorMessage } from "../../utils/apiError";

import DevLogo from "../../assets/DevLogoBranco.png";
import GoalsSection from "./sections/GoalsSection";
import OverviewSection from "./sections/OverviewSection";
import SessionsSection from "./sections/SessionsSection";
import TasksSection from "./sections/TasksSection";

export default function Dashboard2() {
  const navigate = useNavigate();

  const user = getCurrentUser();
  const userInitials = getUserInitials();

  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const [isSettingsCardOpen, setIsSettingsCardOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteAccountMessage, setDeleteAccountMessage] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const profileCardRef = useRef(null);
  const settingsCardRef = useRef(null);

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
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function openDeleteAccountModal() {
    setDeletePassword("");
    setDeleteAccountMessage("");
    setIsSettingsCardOpen(false);
    setIsAccountOpen(false);
    setIsDeleteAccountModalOpen(true);
  }

  function closeDeleteAccountModal() {
    if (isDeletingAccount) return;

    setDeletePassword("");
    setDeleteAccountMessage("");
    setIsDeleteAccountModalOpen(false);
  }

  async function handleDeleteAccount(event) {
    event.preventDefault();

    setDeleteAccountMessage("");

    if (!deletePassword) {
      setDeleteAccountMessage("Insert your current password.");
      return;
    }

    setIsDeletingAccount(true);

    try {
      await api.delete("/user/delete", {
        data: {
          password: deletePassword,
        },
      });

      logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setDeleteAccountMessage(
        getApiErrorMessage(
          error,
          "The password is not correct. Account could not be deleted."
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
    { icon: Settings, id: "settings", label: "Settings" },
  ];

  const sectionById = {
    overview: <OverviewSection />,
    tasks: <TasksSection />,
    goals: <GoalsSection />,
    sessions: <SessionsSection />,
  };

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
          Edit profile
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
                  Enter your current password to permanently delete your
                  account.
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
                  Current Password
                </label>

                <input
                  name="deletePassword"
                  type="password"
                  value={deletePassword}
                  onChange={(event) => {
                    setDeletePassword(event.target.value);
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
      <main className="relative z-10 ml-64 flex flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-end border-b border-white/10 bg-black/20 px-8 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-400 transition-all hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
            </button>

            {/* Profile Button + Card */}
            <div ref={profileCardRef} className="relative">
              <button
                type="button"
                onClick={() =>
                  setIsProfileCardOpen((currentState) => !currentState)
                }
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
                        @{user?.username || "username"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/5 bg-black/40 p-3">
                    <p className="text-xs leading-relaxed text-zinc-500">
                      Profile overview. More account details and profile
                      settings will be available soon.
                    </p>
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
