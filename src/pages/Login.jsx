import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        navigate("/dashboard");
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-white flex items-center justify-center px-6 py-20">

      <div className="w-full max-w-md">

        <div className="text-center mb-10">

          <Link
            to="/"
            className="text-2xl font-bold"
          >
            AI Future Tamil
          </Link>

          <h1 className="text-4xl font-bold mt-8 mb-3">
            Welcome Back
          </h1>

          <p className="text-gray-400">
            Login to continue your AI journey.
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
        >

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          <div className="mb-5">

            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>

          <div className="mb-6">

            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center gap-4 my-7">

            <div className="flex-1 border-t border-zinc-800" />

            <span className="text-gray-500 text-sm">
              OR
            </span>

            <div className="flex-1 border-t border-zinc-800" />

          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-zinc-700 py-3 rounded-xl font-semibold hover:border-white transition"
          >
            Continue with Google
          </button>

        </form>

        <p className="text-center text-gray-400 mt-7">

          Don't have an account?

          <Link
            to="/signup"
            className="text-blue-400 ml-2 hover:text-blue-300"
          >
            Create Account
          </Link>

        </p>

      </div>

    </main>
  );
}

export default Login;