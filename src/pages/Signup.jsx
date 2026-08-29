import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Email confirmation ON
      if (data.user && !data.session) {
        setSuccess(
          "Account created! Please check your Gmail and confirm your email."
        );

        setTimeout(() => {
          navigate("/login");
        }, 2500);

        return;
      }

      // Email confirmation OFF
      if (data.session) {
        setSuccess("Account created successfully!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">

          <Link
            to="/"
            className="text-2xl font-bold"
          >
            AI Future Tamil
          </Link>

          <h1 className="text-4xl font-bold mt-8 mb-3">
            Create Account
          </h1>

          <p className="text-gray-400">
            Join AI Future Tamil today.
          </p>

        </div>

        <form
          onSubmit={handleSignup}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
        >

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-green-400">
              {success}
            </div>
          )}

          <div className="mb-5">

            <label className="block text-sm font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>

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

          <div className="mb-5">

            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>

          <div className="mb-7">

            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="text-center text-gray-400 mt-7">

          Already have an account?

          <Link
            to="/login"
            className="text-blue-400 ml-2 hover:text-blue-300"
          >
            Login
          </Link>

        </p>

      </div>
    </main>
  );
}

export default Signup;