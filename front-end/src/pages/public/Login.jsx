import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import DevLogo from "../../assets/DevLogoBranco.png";
import { login } from "../../services/auth/authService";
import { saveToken, saveUser } from "../../services/tokenService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [githubMessage, setGithubMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleGithubLogin = () => {
    setSubmitError("");
    setGithubMessage("Login com GitHub ainda está em desenvolvimento.");
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
  }

  function validateLogin() {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Insert your email.";
    }

    if (formData.email.length > 100) {
      newErrors.email = "The field must have at most 100 characters.";
    }

    if (!formData.password) {
      newErrors.password = "Insert your password.";
    }

    if (formData.password.length > 128) {
      newErrors.password = "The password must have at most 128 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setGithubMessage("");
    setSubmitError("");

    if (!validateLogin()) return;

    setIsLoading(true);

    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, id, name, username, email } = response;

      if (!token) {
        throw new Error("Token não recebido pelo backend.");
      }

      saveToken(token);

      saveUser({
        id,
        name,
        username,
        email,
      });

      navigate("/dashboard22");
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Email ou senha inválidos."));
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
        <div className="absolute right-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-120px] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-3xl" />
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
                alt="DevTrack Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-lg font-semibold">Welcome back</h1>
              <p className="text-xs text-zinc-500">
                Continue your developer journey.
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-medium text-white transition hover:border-blue-500/40 hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Login with GitHub
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
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="johndoe@email.com"
              className={inputClass("email")}
            />
            {errors.email && (
              <p className="mt-2 text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-zinc-400">Password</label>
              <button
                type="button"
                className="text-xs text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass("password")}
            />
            {errors.password && (
              <p className="mt-2 text-xs text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {submitError && (
            <p className="text-center text-xs text-red-400">
              {submitError}
            </p>
          )}
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <span className="text-zinc-500">Don't have an account?</span>
          <Link
            to="/register"
            className="font-medium text-blue-400 transition hover:text-blue-300"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
