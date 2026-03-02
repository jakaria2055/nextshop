"use client";

import {
  Leaf,
  Loader2,
  LogIn,
  Mail,
  RectangleEllipsis,
} from "lucide-react";
import { motion } from "framer-motion";
import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import googleIMG from "@/assets/google.webp";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { status } = useSession();

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // 👈 prevent auto reload
      });

      if (res?.ok) {
        router.push("/"); // ✅ redirect to homepage/dashboard
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-br from-blue-50 via-white to-blue-50/30 relative overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            Sign in to NextShop
            <Leaf className="w-5 h-5 text-blue-600" />
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5 w-full"
        >
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-blue-400" />
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full border border-gray-200 bg-white rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <RectangleEllipsis className="absolute left-3 top-3.5 w-5 h-5 text-blue-400" />
            <input
              type="password"
              required
              placeholder="••••••"
              className="w-full border border-gray-200 bg-white rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
            <span className="flex-1 h-px bg-gray-300"></span>
            OR
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          {/* Google Login */}
          <div
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 border-2 border-blue-200 bg-white rounded-xl py-3 text-gray-700 font-medium cursor-pointer hover:bg-blue-50 transition"
          >
            <Image src={googleIMG} width={20} height={20} alt="Google" />
            Continue with Google
          </div>
        </form>

        {/* Register */}
        <p
          onClick={() => router.push("/register")}
          className="cursor-pointer text-gray-600 mt-6 text-sm flex items-center justify-center gap-1"
        >
          Don't have an account?
          <LogIn className="w-4 h-4 text-blue-600" />
          <span className="text-blue-600 font-semibold">
            Sign Up
          </span>
        </p>

        {/* Forgot Password */}
        <p className="text-center mt-4">
          <span className="text-sm text-blue-600 cursor-pointer hover:underline">
            Forgot Password?
          </span>
        </p>
      </div>
    </motion.div>
  );
}

export default Login;