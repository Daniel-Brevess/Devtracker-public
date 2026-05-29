import { useEffect, useState } from "react";
import {
  Activity,
  GitBranch,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { getAdminAnalytics } from "../../../services/admin/adminService";
import { getApiErrorMessage } from "../../../utils/apiError";

function AdminStatCard({ colorClassName, icon: Icon, label, sub, value }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-zinc-950/50 p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <h3 className={`mt-3 text-3xl font-bold ${colorClassName}`}>
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-600">{sub}</p>
    </article>
  );
}

export default function AdminAnalyticsSection() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadAdminAnalytics() {
      setIsLoading(true);
      setMessage("");

      try {
        const adminAnalytics = await getAdminAnalytics();
        setAnalytics(adminAnalytics);
      } catch (error) {
        setMessage(
          getApiErrorMessage(
            error,
            "Could not load admin analytics. Try again."
          )
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAdminAnalytics();
  }, []);

  if (isLoading) {
    return (
      <section className="flex flex-1 items-center justify-center px-8">
        <p className="text-sm text-zinc-500">Loading admin analytics...</p>
      </section>
    );
  }

  if (message) {
    return (
      <section className="flex flex-1 items-center justify-center px-8">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-sm text-red-300">{message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-y-auto px-8 py-8">
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                Admin Analytics
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-zinc-500">
                Platform health, account sources, and recent user activity.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AdminStatCard
            colorClassName="text-blue-400"
            icon={Users}
            label="Total Users"
            sub="Accounts created in DevTracker"
            value={analytics.totalUsers}
          />
          <AdminStatCard
            colorClassName="text-emerald-400"
            icon={Activity}
            label="Active Now"
            sub="Users active in the last 5 minutes"
            value={analytics.activeUsers}
          />
          <AdminStatCard
            colorClassName="text-violet-400"
            icon={GitBranch}
            label="GitHub Users"
            sub="Accounts created with GitHub OAuth"
            value={analytics.githubUsers}
          />
          <AdminStatCard
            colorClassName="text-sky-400"
            icon={UserCheck}
            label="Local Users"
            sub="Accounts created with email and password"
            value={analytics.localUsers}
          />
          <AdminStatCard
            colorClassName="text-orange-400"
            icon={UserPlus}
            label="Created Today"
            sub="New accounts since today's start"
            value={analytics.usersCreatedToday}
          />
          <AdminStatCard
            colorClassName="text-indigo-400"
            icon={UserPlus}
            label="Last 7 Days"
            sub="New accounts in the current 7-day window"
            value={analytics.usersCreatedLastSevenDays}
          />
        </div>
      </div>
    </section>
  );
}
