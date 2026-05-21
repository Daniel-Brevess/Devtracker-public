import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  AtSign,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { getCurrentUser, getUserInitials } from "../../services/userService";
import api from "../../services/api";
import { saveUser } from "../../services/tokenService";
import { logout } from "../../services/tokenService";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../../utils/validator";
import { getApiErrorMessage } from "../../utils/apiError";

export default function ProfileEdit22() {
  const user = getCurrentUser();
  const userInitials = getUserInitials();
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isPasswordCardOpen, setIsPasswordCardOpen] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setProfileMessage("");
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordMessage("");
  }

async function handleSubmit(event) {
  event.preventDefault();

  setProfileMessage("");

  const oldEmail = user?.email;
  const newEmail = formData.email.trim();

  const emailChanged = oldEmail !== newEmail;

  const payload = {
    name: formData.name.trim(),
    username: formData.username.trim(),
    email: newEmail,
  };

  try {
    const response = await api.put("/user/update", payload);

    const updatedUser = response.data;

    const userToSave = {
      ...user,
      name: updatedUser.name || formData.name.trim(),
      username: updatedUser.username || formData.username.trim(),
      email: updatedUser.email || formData.email.trim(),
    };

    saveUser(userToSave);

    if (emailChanged) {
      setProfileMessage("Email updated successfully. Please login again.");

      setTimeout(() => {
        logout();
        navigate("/login", { replace: true });
      }, 1200);

      return;
    }

    setProfileMessage("Profile updated successfully.");
  } catch (error) {
    setProfileMessage(
      getApiErrorMessage(error, "Could not update profile. Try again.")
    );
  }
}

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    if (!passwordData.currentPassword) {
      setPasswordMessage("Insert your current password.");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordMessage("Insert your new password.");
      return;
    }

    const passwordErrors = validatePassword(passwordData.newPassword);

    if (passwordErrors.length > 0) {
      setPasswordMessage(
        "The password needs to have: " + passwordErrors.join(", ") + "."
      );
      return;
    }

    if (!passwordData.confirmPassword) {
      setPasswordMessage("Confirm your new password.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("New password and confirmation do not match.");
      return;
    }

    const payload = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    };

    setIsPasswordLoading(true);

    try {
      const response = await api.put("/user/update-password", payload);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage(
        response.data?.message || "Password updated successfully."
      );
    } catch (error) {
      setPasswordMessage(
        getApiErrorMessage(error, "Could not update password. Try again.")
      );
    } finally {
      setIsPasswordLoading(false);
    }
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
      </nav>

      <main className="relative z-10 mx-auto max-w-3xl px-8 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Edit Profile</h1>
          <p className="mt-2 text-zinc-500">
            Update your account information and security settings.
          </p>
        </header>

        <section className="mb-8 rounded-[28px] border border-white/10 bg-zinc-950/50 p-6 backdrop-blur-xl">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Profile Preview
          </h2>

          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full border-2 border-white/10 bg-gradient-to-tr from-blue-500 to-violet-500 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900">
                <span className="text-xl font-bold">{userInitials}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {formData.name || "User"}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                @{formData.username || "username"}
              </p>
            </div>
          </div>
        </section>

        <form
          id="edit-profile-form"
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <section className="space-y-6 rounded-[32px] border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Account Information
              </h2>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-sm font-bold text-black transition-all hover:scale-[1.02]"
              >
                <Save className="h-4 w-4" />
                Save Profile
              </button>
            </div>

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

            {profileMessage && (
              <p className="text-sm text-blue-400">{profileMessage}</p>
            )}
          </section>
        </form>

        <section className="mt-8 rounded-[32px] border border-white/10 bg-zinc-950/50 p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                Security
              </h2>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
                Password changes are handled separately to keep your account
                update flow safer and more predictable.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsPasswordCardOpen((currentState) => !currentState)
              }
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-blue-500/40 hover:bg-blue-500/10"
            >
              Change password
            </button>
          </div>

          {isPasswordCardOpen && (
            <form
              onSubmit={handlePasswordSubmit}
              className="mt-8 space-y-6 rounded-[28px] border border-white/10 bg-black/40 p-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-zinc-400">
                    <Lock className="h-3 w-3" />
                    Current Password
                  </label>

                  <input
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-zinc-400">
                    <Lock className="h-3 w-3" />
                    New Password
                  </label>

                  <input
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <Lock className="h-3 w-3" />
                  Confirm New Password
                </label>

                <input
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500/50"
                />
              </div>

              {passwordMessage && (
                <p className="text-sm text-blue-400">{passwordMessage}</p>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPasswordLoading}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-[1.02]"
                >
                  {isPasswordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
