import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Lock,
  AtSign,
} from "lucide-react";

import { getCurrentUser, getUserInitials } from "../../services/userService";

export default function ProfileEdit22() {
  const user = getCurrentUser();
  const userInitials = getUserInitials();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Dados para atualizar:", formData);

    setMessage("Profile update is not connected to the backend yet.");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-5%] top-[-5%] h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      <nav className="relative z-10 flex h-20 items-center justify-between border-b border-white/5 bg-black/20 px-8 backdrop-blur-md">
        <Link
          to="/dashboard22"
          className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </Link>

        <button
          type="submit"
          form="edit-profile-form"
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-bold text-black transition-all hover:scale-[1.02]"
        >
          <Save className="h-4 w-4" />
          Save Profile
        </button>
      </nav>

      <main className="relative z-10 mx-auto max-w-3xl px-8 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="mt-2 text-zinc-500">
            Update your basic account information.
          </p>
        </header>

        <form
          id="edit-profile-form"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <section className="rounded-[32px] border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-xl">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Profile Preview
            </h2>

            <div className="flex items-center gap-5">
              <div className="h-24 w-24 rounded-full border-2 border-white/10 bg-gradient-to-tr from-blue-500 to-violet-500 p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900">
                  <span className="text-2xl font-bold">
                    {userInitials}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold">
                  {formData.name || "User"}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  @{formData.username || "username"}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6 rounded-[32px] border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Account Information
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <User className="h-3 w-3" />
                  Full Name
                </label>

                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <AtSign className="h-3 w-3" />
                  Username
                </label>

                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                <Mail className="h-3 w-3" />
                Email Address
              </label>

              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                <Lock className="h-3 w-3" />
                New Password
              </label>

              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave empty to keep current password"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-600 focus:border-blue-500/50"
              />
            </div>

            {message && (
              <p className="text-sm text-blue-400">
                {message}
              </p>
            )}
          </section>
        </form>
      </main>
    </div>
  );
}