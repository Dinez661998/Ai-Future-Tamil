import { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { supabase } from "../supabase/client";

export default function AdminRoute({
  children,
}) {
  const location = useLocation();

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState(null);

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      try {

        // =========================================
        // GET CURRENT LOGGED-IN USER
        // =========================================

        const {
          data: {
            user: currentUser,
          },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error(
            "AdminRoute user error:",
            userError
          );
        }

        if (!mounted) return;

        // =========================================
        // NOT LOGGED IN
        // =========================================

        if (!currentUser) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setUser(currentUser);

        // =========================================
        // CHECK ADMIN ROLE
        // =========================================

        const {
          data,
          error,
        } = await supabase.rpc(
          "is_admin"
        );

        if (!mounted) return;

        if (error) {
          console.error(
            "Admin role check error:",
            error
          );

          setIsAdmin(false);
          setLoading(false);

          return;
        }

        setIsAdmin(data === true);

      } catch (error) {

        console.error(
          "AdminRoute error:",
          error
        );

        if (mounted) {
          setIsAdmin(false);
        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }
    }

    checkAdmin();

    // =========================================
    // AUTH STATE CHANGES
    // =========================================

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        () => {
          checkAdmin();
        }
      );

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };

  }, []);

  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#050816]
          px-6
          text-white
        "
      >
        <div className="text-center">

          <div
            className="
              mx-auto
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-white/10
              border-t-cyan-400
            "
          />

          <h2
            className="
              mt-5
              text-xl
              font-black
            "
          >
            Checking Admin Access...
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-gray-400
            "
          >
            AI Future Tamil
          </p>

        </div>
      </div>
    );
  }

  // =========================================
  // NOT LOGGED IN
  // =========================================

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =========================================
  // LOGGED IN BUT NOT ADMIN
  // =========================================

  if (!isAdmin) {
    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#050816]
          px-5
          text-white
        "
      >
        <div
          className="
            w-full
            max-w-lg
            rounded-[30px]
            border
            border-red-500/20
            bg-black/40
            p-8
            text-center
            shadow-2xl
            backdrop-blur-xl
          "
        >

          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-red-500/20
              bg-red-500/10
              text-4xl
            "
          >
            🔒
          </div>

          <p
            className="
              mt-6
              text-sm
              font-black
              uppercase
              tracking-[0.2em]
              text-red-400
            "
          >
            Access Denied
          </p>

          <h1
            className="
              mt-3
              text-3xl
              font-black
            "
          >
            Admin Access Only
          </h1>

          <p
            className="
              mt-4
              leading-7
              text-gray-400
            "
          >
            Indha page AI Future Tamil
            administrator-ku mattum.
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/dashboard";
            }}
            className="
              mt-7
              w-full
              rounded-xl
              bg-white
              px-5
              py-3
              font-black
              text-black
              transition
              hover:bg-gray-200
            "
          >
            Go to Dashboard →
          </button>

        </div>
      </div>
    );
  }

  // =========================================
  // ADMIN
  // =========================================

  return children;
}