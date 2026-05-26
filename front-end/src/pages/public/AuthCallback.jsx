import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getMe } from "../../services/user/userService";
import { saveToken, saveUser } from "../../services/tokenService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Finishing authentication...");

  useEffect(() => {
    async function finishAuth() {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        setMessage(error);
        return;
      }

      if (!token) {
        setMessage("Authentication token was not received.");
        return;
      }

      try {
        saveToken(token);

        const user = await getMe();

        saveUser(user);
        navigate("/dashboard22", { replace: true });
      } catch (requestError) {
        setMessage(
          getApiErrorMessage(
            requestError,
            "Could not finish authentication. Try again."
          )
        );
      }
    }

    finishAuth();
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-zinc-950/90 p-6 text-center backdrop-blur-xl">
        <h1 className="text-lg font-semibold">GitHub Authentication</h1>
        <p className="mt-3 text-sm text-zinc-500">{message}</p>
      </div>
    </div>
  );
}
