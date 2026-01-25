"use client";
import { Leaf, Loader2, LogIn, Mail, RectangleEllipsis } from "lucide-react";
import { motion } from "framer-motion";
import React, { FormEvent, useState } from "react";
import Image from "next/image";
import googleIMG from "@/assets/google.webp";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();

  console.log(session);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn("credentials", {
        email,
        password,
      });
      router.push("/login")
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <motion.h1 className="text-4xl font-extrabold text-blue-700 mb-2">
        Welcome Back
      </motion.h1>
      <p className="text-gray-700 mb-8 flex items-center">
        Signin NextShop just now <Leaf className="w-5 h-5 text-blue-600" />
      </p>

      <motion.form
        onSubmit={handleLogin}
        className="flex flex-col gap-5 w-full max-w-sm"
      >
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Mail Address"
            className="w-full border-gray-300 bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <RectangleEllipsis className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="password"
            placeholder="******"
            className="w-full border-gray-300 bg-gray-100 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        {/* Button */}
        {(() => {
          const formValidation = email !== "" && password !== "";
          return (
            <button
              disabled={!formValidation || loading}
              className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-md inline-flex items justify-center gap-2 ${formValidation ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>
          );
        })()}

        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="bg-gray-200 flex-1 h-px"></span>
          OR
          <span className="bg-gray-200 flex-1 h-px"></span>
        </div>

        <div className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 text-gray-700 font-medium transition-all duration-200"  onClick={()=>signIn("google", {callbackUrl: "/"})}>
          <Image src={googleIMG} width={20} height={20} alt={"Google PNG"} />
          Continue With Google
        </div>
      </motion.form>

      <p
        className="cursor-pointer text-gray-600 mt-6 text-sm flex items-center justify-center gap-1"
        onClick={() => router.push("/register")}
      >
        Do no have an account? <LogIn className="w-4 h-4" />
        <span className="text-blue-600 font-semibold">Sign Up</span>
      </p>
    </div>
  );
}

export default Login;
