import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  supabase,
} from "../supabase/client";

function EyeOpenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle
        cx="12"
        cy="12"
        r="2.7"
      />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A10.5 10.5 0 0 1 12 6c6 0 9.5 6 9.5 6a16.4 16.4 0 0 1-2.2 3" />
      <path d="M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6a10.7 10.7 0 0 0 4.2-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
  autoComplete,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">
        {label}
      </label>

      <div className="group relative">
        <input
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={
            autoComplete
          }
          className="
            w-full
            rounded-xl
            border
            border-zinc-700
            bg-black
            px-4
            py-3
            pr-14
            text-white
            outline-none

            transition-all
            duration-200

            placeholder:text-zinc-600

            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/10

            group-hover:border-zinc-600
          "
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={
            visible
              ? "Hide password"
              : "Show password"
          }
          title={
            visible
              ? "Hide password"
              : "Show password"
          }
          className="
            absolute
            right-2
            top-1/2

            flex
            h-10
            w-10
            -translate-y-1/2
            items-center
            justify-center

            rounded-lg

            text-zinc-500

            transition-all
            duration-200

            hover:bg-white/[0.06]
            hover:text-blue-400

            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/30
          "
        >
          {visible ? (
            <EyeClosedIcon />
          ) : (
            <EyeOpenIcon />
          )}
        </button>
      </div>
    </div>
  );
}

function Login() {
  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    resetLoading,
    setResetLoading,
  ] = useState(false);

  const [
    updateLoading,
    setUpdateLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    recoveryMode,
    setRecoveryMode,
  ] = useState(false);

  /* =========================================================
     PASSWORD RECOVERY DETECTION
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const checkRecovery =
      async () => {
        try {
          const params =
            new URLSearchParams(
              window.location.search
            );

          const resetParam =
            params.get("reset");

          if (
            resetParam ===
              "1" &&
            mounted
          ) {
            setRecoveryMode(
              true
            );
          }

          const {
            data: {
              session,
            },
          } =
            await supabase.auth.getSession();

          if (
            resetParam ===
              "1" &&
            session &&
            mounted
          ) {
            setRecoveryMode(
              true
            );
          }
        } catch (
          err
        ) {
          console.error(
            "Recovery check error:",
            err
          );
        }
      };

    checkRecovery();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          event
        ) => {
          if (
            event ===
            "PASSWORD_RECOVERY"
          ) {
            setRecoveryMode(
              true
            );

            setError("");

            setSuccess(
              "Reset link verified. Please create your new password."
            );
          }
        }
      );

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };
  }, []);

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin =
    async (e) => {
      e.preventDefault();

      setError("");
      setSuccess("");

      if (
        !email.trim() ||
        !password
      ) {
        setError(
          "Please enter email and password."
        );

        return;
      }

      try {
        setLoading(true);

        const {
          data,
          error,
        } =
          await supabase.auth.signInWithPassword(
            {
              email:
                email.trim(),

              password,
            }
          );

        if (error) {
          setError(
            error.message
          );

          return;
        }

        if (
          data?.user
        ) {
          navigate(
            "/dashboard"
          );
        }
      } catch (
        err
      ) {
        console.error(
          "Login error:",
          err
        );

        setError(
          "Something went wrong. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================================================
     FORGOT PASSWORD
  ========================================================= */

  const handleForgotPassword =
    async () => {
      setError("");
      setSuccess("");

      if (
        !email.trim()
      ) {
        setError(
          "First enter your email address, then click Forgot Password."
        );

        return;
      }

      try {
        setResetLoading(
          true
        );

        const redirectUrl =
          `${window.location.origin}/login?reset=1`;

        const {
          error,
        } =
          await supabase.auth.resetPasswordForEmail(
            email.trim(),
            {
              redirectTo:
                redirectUrl,
            }
          );

        if (error) {
          setError(
            error.message
          );

          return;
        }

        setSuccess(
          "Password reset email sent successfully. Check your inbox and spam folder."
        );
      } catch (
        err
      ) {
        console.error(
          "Reset email error:",
          err
        );

        setError(
          "Unable to send reset email. Please try again."
        );
      } finally {
        setResetLoading(
          false
        );
      }
    };

  /* =========================================================
     UPDATE PASSWORD
  ========================================================= */

  const handleUpdatePassword =
    async (e) => {
      e.preventDefault();

      setError("");
      setSuccess("");

      if (
        !newPassword ||
        !confirmPassword
      ) {
        setError(
          "Please enter your new password in both fields."
        );

        return;
      }

      if (
        newPassword.length <
        6
      ) {
        setError(
          "Password must contain at least 6 characters."
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );

        return;
      }

      try {
        setUpdateLoading(
          true
        );

        const {
          data: {
            session,
          },
        } =
          await supabase.auth.getSession();

        if (!session) {
          setError(
            "Your reset link has expired or is invalid. Please request a new password reset email."
          );

          return;
        }

        const {
          error,
        } =
          await supabase.auth.updateUser(
            {
              password:
                newPassword,
            }
          );

        if (error) {
          setError(
            error.message
          );

          return;
        }

        setSuccess(
          "Password changed successfully!"
        );

        setNewPassword("");
        setConfirmPassword("");

        setShowNewPassword(
          false
        );

        setShowConfirmPassword(
          false
        );

        await supabase.auth.signOut();

        setTimeout(() => {
          setRecoveryMode(
            false
          );

          window.history.replaceState(
            {},
            "",
            "/login"
          );

          setSuccess(
            "Password updated successfully. Login with your new password."
          );
        }, 1200);
      } catch (
        err
      ) {
        console.error(
          "Password update error:",
          err
        );

        setError(
          "Unable to update password. Please request a new reset link."
        );
      } finally {
        setUpdateLoading(
          false
        );
      }
    };

  /* =========================================================
     GOOGLE LOGIN
  ========================================================= */

  const handleGoogleLogin =
    async () => {
      setError("");
      setSuccess("");

      try {
        const {
          error,
        } =
          await supabase.auth.signInWithOAuth(
            {
              provider:
                "google",

              options: {
                redirectTo:
                  window.location
                    .origin +
                  "/dashboard",
              },
            }
          );

        if (error) {
          setError(
            error.message
          );
        }
      } catch (
        err
      ) {
        console.error(
          "Google login error:",
          err
        );

        setError(
          "Google login failed. Please try again."
        );
      }
    };

  /* =========================================================
     RESET PASSWORD SCREEN
  ========================================================= */

  if (
    recoveryMode
  ) {
    return (
      <main className="min-h-screen bg-transparent text-white flex items-center justify-center px-6 py-20">

        <div className="w-full max-w-md">

          <div className="mb-10 text-center">

            <Link
              to="/"
              className="text-2xl font-bold"
            >
              AI Future Tamil
            </Link>

            <div className="mt-8 mb-5 flex items-center justify-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-3xl">
                🔐
              </div>

            </div>

            <h1 className="mb-3 text-4xl font-bold">
              Create New Password
            </h1>

            <p className="text-gray-400">
              Enter and confirm your new password.
            </p>

          </div>

          <form
            onSubmit={
              handleUpdatePassword
            }
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
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
              <PasswordInput
                label="New Password"
                value={
                  newPassword
                }
                onChange={(
                  e
                ) =>
                  setNewPassword(
                    e.target
                      .value
                  )
                }
                placeholder="Enter new password"
                visible={
                  showNewPassword
                }
                onToggle={() =>
                  setShowNewPassword(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                autoComplete="new-password"
              />

              <p className="mt-2 text-xs text-gray-500">
                Minimum 6 characters.
              </p>
            </div>

            <div className="mb-6">
              <PasswordInput
                label="Confirm New Password"
                value={
                  confirmPassword
                }
                onChange={(
                  e
                ) =>
                  setConfirmPassword(
                    e.target
                      .value
                  )
                }
                placeholder="Enter password again"
                visible={
                  showConfirmPassword
                }
                onToggle={() =>
                  setShowConfirmPassword(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={
                updateLoading
              }
              className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
            >
              {updateLoading
                ? "Updating Password..."
                : "Update Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setRecoveryMode(
                  false
                );

                setError("");
                setSuccess("");

                setShowNewPassword(
                  false
                );

                setShowConfirmPassword(
                  false
                );

                window.history.replaceState(
                  {},
                  "",
                  "/login"
                );
              }}
              className="mt-4 w-full rounded-xl border border-zinc-700 py-3 font-semibold text-gray-300 transition hover:border-white hover:text-white"
            >
              ← Back to Login
            </button>

          </form>

        </div>

      </main>
    );
  }

  /* =========================================================
     LOGIN SCREEN
  ========================================================= */

  return (
    <main className="min-h-screen bg-transparent text-white flex items-center justify-center px-6 py-20">

      <div className="w-full max-w-md">

        <div className="mb-10 text-center">

          <Link
            to="/"
            className="text-2xl font-bold"
          >
            AI Future Tamil
          </Link>

          <h1 className="mt-8 mb-3 text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="text-gray-400">
            Login to continue your AI journey.
          </p>

        </div>

        <form
          onSubmit={
            handleLogin
          }
          className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
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

          {/* EMAIL */}

          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(
                e
              ) =>
                setEmail(
                  e.target
                    .value
                )
              }
              autoComplete="email"
              className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-black
                px-4
                py-3
                text-white
                outline-none

                transition

                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/10
              "
            />

          </div>

          {/* PASSWORD WITH EYE */}

          <div className="mb-3">

            <PasswordInput
              label="Password"
              value={
                password
              }
              onChange={(
                e
              ) =>
                setPassword(
                  e.target
                    .value
                )
              }
              placeholder="••••••••"
              visible={
                showPassword
              }
              onToggle={() =>
                setShowPassword(
                  (
                    current
                  ) =>
                    !current
                )
              }
              autoComplete="current-password"
            />

          </div>

          {/* FORGOT PASSWORD */}

          <div className="mb-6 flex items-center justify-between">

            <span className="text-xs text-zinc-600">
              {showPassword
                ? "Password visible"
                : "Password hidden"}
            </span>

            <button
              type="button"
              onClick={
                handleForgotPassword
              }
              disabled={
                resetLoading
              }
              className="text-sm text-blue-400 transition hover:text-blue-300 disabled:opacity-50"
            >
              {resetLoading
                ? "Sending..."
                : "Forgot Password?"}
            </button>

          </div>

          {/* LOGIN */}

          <button
            type="submit"
            disabled={
              loading
            }
            className="w-full rounded-xl bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          {/* OR */}

          <div className="my-7 flex items-center gap-4">

            <div className="flex-1 border-t border-zinc-800" />

            <span className="text-sm text-gray-500">
              OR
            </span>

            <div className="flex-1 border-t border-zinc-800" />

          </div>

          {/* GOOGLE */}

          <button
            type="button"
            onClick={
              handleGoogleLogin
            }
            className="w-full rounded-xl border border-zinc-700 py-3 font-semibold transition hover:border-white"
          >
            Continue with Google
          </button>

        </form>

        <p className="mt-7 text-center text-gray-400">

          Don't have an account?

          <Link
            to="/signup"
            className="ml-2 text-blue-400 hover:text-blue-300"
          >
            Create Account
          </Link>

        </p>

      </div>

    </main>
  );
}

export default Login;