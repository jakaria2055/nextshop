"use client";
import React from "react";
import { motion } from "motion/react";

function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <motion.div
        initial={{
          opacity: 0,
          y:-20
        }}
        animate={{
          opacity: 1,
          y:0
        }}
        transition={{
          duration: 2,
        }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800">NextShop</h1>
      </motion.div>
    </div>
  );
}

export default Welcome;

// Next: 3:01:00
