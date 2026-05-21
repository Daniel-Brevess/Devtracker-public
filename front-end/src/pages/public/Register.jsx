import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

import DevLogo from "../../assets/DevLogoBranco.png";
import {
  isValidEmail,
  isValidName,
  validatePassword,
  isValidUsername,
} from "../../utils/validator";
import { getApiErrorMessage } from "../../utils/apiError";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [githubMessage, setGithubMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleGithubRegister = () => {
    setSubmitError("");
    setSuccessMessage("");
    setGithubMessage("Registration with GitHub is still under development.");
  };

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSubmitError("");
    setSuccessMessage("");
  }

  function validateForm() {
    const newErrors = {};

    if (!isValidName(formData.name)) {
      newErrors.name = "Enter a name with at least 3 characters.";
    }

    if (!isValidUsername(formData.username)) {
      newErrors.username = "Use 3 to 20 characters, without spaces.";
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    const passwordErrors = validatePassword(formData.password);

    if (passwordErrors.length > 0) {
      newErrors.password =
        "The password needs to have: " + passwordErrors.join(", ") + ".";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setGithubMessage("");
    setSubmitError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);

    const payload = {
      name: formData.name.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    try {
      await api.post("/user/register", payload);

      setSuccessMessage(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "Could not create account. Try again.")
      );
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = (field) =>
    `w-full rounded-2xl border bg-black/40 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 ${
      errors[field]
        ? "border-red-500/60 focus:border-red-500"
        : "border-white/10 focus:border-blue-500/50"
    }`;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-8 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-zinc-950/90 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-4">
          <Link
            to="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/40 text-zinc-400 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
              <img
                src={DevLogo}
                alt="DevTracker Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-lg font-semibold">Create account</h1>
              <p className="text-xs text-zinc-500">
                Start tracking your evolution.
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGithubRegister}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-medium text-white transition hover:border-blue-500/40 hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue with GitHub
          </button>

          {githubMessage && (
            <p className="mt-2 text-center text-xs text-blue-400">
              {githubMessage}
            </p>
          )}
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-wider text-zinc-500">
            or
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={inputClass("name")}
            />
            {errors.name && (
              <p className="mt-2 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Username
            </label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              className={inputClass("username")}
            />
            {errors.username && (
              <p className="mt-2 text-xs text-red-400">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@email.com"
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="mt-2 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass("password")}
            />
            {errors.password && (
              <p className="mt-2 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>

          {successMessage && (
            <p className="text-center text-xs text-blue-400">
              {successMessage}
            </p>
          )}

          {submitError && (
            <p className="text-center text-xs text-red-400">
              {submitError}
            </p>
          )}
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <span className="text-zinc-500">Already have an account?</span>
          <Link
            to="/login"
            className="font-medium text-blue-400 transition hover:text-blue-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
