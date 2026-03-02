"use client";

import {
  ArrowLeft,
  Leaf,
  Loader2,
  LogIn,
  Mail,
  RectangleEllipsis,
  User,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image";
import googleIMG from "@/assets/google.webp";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type propType = {
  prevStep: (s: number) => void;
};

function RegisterForm({ prevStep }: propType) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-br from-blue-50 via-white to-blue-50/30 relative overflow-hidden"
    >
      {/* Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-blue-300 rounded-full blur-3xl"
      />

      {/* Floating Icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.2, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-40 left-10 hidden lg:block"
      >
        <Sparkles className="w-12 h-12 text-blue-300" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.2, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-40 right-10 hidden lg:block"
      >
        <Leaf className="w-16 h-16 text-blue-300 rotate-12" />
      </motion.div>

      {/* Back Button */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-6 z-10"
        onClick={() => prevStep(1)}
      >
        <div className="flex items-center gap-2 text-blue-700 cursor-pointer bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-blue-100">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-sm">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="text-center mb-8"
        >
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2"
          >
            Create Account
          </motion.h1>

          {/* ✅ FIXED (span instead of div inside p) */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 flex items-center justify-center gap-2"
          >
            Join NextShop today
            <motion.span
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="inline-block"
            >
              <Leaf className="w-5 h-5 text-blue-600" />
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.4 }}
          onSubmit={handleRegister}
          className="flex flex-col gap-5 w-full"
        >
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-blue-400" />
            <input
              type="text"
              required
              placeholder="Your Name"
              className="w-full border border-gray-200 bg-white rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

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

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Register"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
            <span className="flex-1 h-px bg-gray-300"></span>
            OR
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          {/* Google Sign In */}
          <div
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 border-2 border-blue-200 bg-white rounded-xl py-3 text-gray-700 font-medium cursor-pointer hover:bg-blue-50 transition"
          >
            <Image src={googleIMG} width={20} height={20} alt="Google" />
            Continue with Google
          </div>
        </motion.form>

        {/* Sign In */}
        <p
          onClick={() => router.push("/login")}
          className="cursor-pointer text-gray-600 mt-6 text-sm flex items-center justify-center gap-1"
        >
          Already have an account?
          <LogIn className="w-4 h-4 text-blue-600" />
          <span className="text-blue-600 font-semibold">Sign In</span>
        </p>
      </div>
    </motion.div>
  );
}

export default RegisterForm;