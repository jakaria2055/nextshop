"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Package } from "lucide-react";
import Link from "next/link";

function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center bg-gradient-to-b from-blue-50 to-white">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.2, rotate: 10 }}
        transition={{
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
        className="relative"
      >
        <CheckCircle className="text-blue-700 w-24 h-24 md:w-28 md:h-28" />

        {/* Pulsing glow */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full rounded-full bg-blue-400 blur-2xl"></div>
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-blue-700 mt-6"
      >
        Order Placed Successfully.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-3 text-sm md:text-base max-w-md text-gray-700 text-center"
      >
        Thanks for Shopping with Us. Your order has been placed and is being
        processed. You can track its progress in your{" "}
        <span className="font-semibold text-blue-700">My Orders</span> section.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-10"
      >
        <Package className="w-16 h-16 md:w-20 md:h-20 text-blue-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-12"
      >
        <Link href={"/user/my-orders"}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
          >
            Go to My Orders <ArrowRight />
          </motion.div>
        </Link>
      </motion.div>

      {/* Floating dots */}
      <motion.div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {[
          { top: "top-20", left: "left-[10%]", delay: 0 },
          { top: "top-32", left: "left-[30%]", delay: 0.3 },
          { top: "top-40", left: "left-[50%]", delay: 0.6 },
          { top: "top-48", left: "left-[70%]", delay: 0.9 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className={`absolute ${dot.top} ${dot.left} w-2 h-2 bg-blue-400 rounded-full`}
            animate={{ y: [0, -10, 0], opacity: [1, 0.5, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: dot.delay,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

export default OrderSuccess;