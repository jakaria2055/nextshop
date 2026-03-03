"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Package,
  ShoppingBag,
  Clock,
} from "lucide-react";
import Link from "next/link";

function OrderSuccess() {
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-blue-50 via-white to-blue-50/30 relative overflow-hidden"
    >
      {/* Animated background elements */}
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

      

      {screenSize.width > 0 &&
        [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * screenSize.width,
              y: -20,
              opacity: 1,
            }}
            animate={{
              y: screenSize.height + 100,
              x: Math.random() * screenSize.width,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
          />
        ))}




      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Success Icon with Rings */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{
            type: "spring",
            damping: 8,
            stiffness: 100,
            delay: 0.2,
          }}
          className="relative mb-8"
        >
          {/* Outer rings */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full rounded-full bg-blue-200 blur-xl"></div>
          </motion.div>

          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            <div className="w-full h-full rounded-full bg-blue-300 blur-xl"></div>
          </motion.div>

          {/* Main Icon */}
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <CheckCircle className="text-blue-600 w-28 h-28 md:w-32 md:h-32" />
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mt-6"
        >
          Order Placed Successfully!
        </motion.h1>

        {/* Order Info Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-4"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
          >
            <Clock size={14} />
            Estimated Delivery: 2-3 Days
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
          >
            <ShoppingBag size={14} />
            Order Confirmed
          </motion.span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-base md:text-lg max-w-md text-gray-600 text-center mx-auto leading-relaxed"
        >
          Thank you for shopping with us! Your order has been placed and is
          being processed. You can track its progress in your{" "}
          <span className="font-semibold text-blue-600">My Orders</span>{" "}
          section.
        </motion.p>

        {/* Order Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100 max-w-md mx-auto"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Order Number</span>
            <span className="font-mono font-bold text-blue-700">
              #ORD-{Math.floor(Math.random() * 10000)}
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Order Date</span>
            <span className="font-semibold text-gray-800">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-blue-100">
            <span className="text-gray-600 font-semibold">Status</span>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-green-600 font-bold flex items-center gap-1"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Processing
            </motion.span>
          </div>
        </motion.div>

        {/* Package Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <Package className="w-20 h-20 md:w-24 md:h-24 text-blue-500 mx-auto" />
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href={"/user/my-orders"}>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white text-base font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
            >
              Track My Order
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </motion.button>
          </Link>

          <Link href={"/"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-50 text-base font-semibold px-8 py-3 rounded-full shadow-lg transition-all"
            >
              Continue Shopping
              <ShoppingBag size={18} />
            </motion.button>
          </Link>
        </motion.div>

        {/* Delivery Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-sm text-gray-500"
        >
          📱 You will receive updates about your order delivery in Order page
        </motion.p>
      </div>
    </motion.div>
  );
}

export default OrderSuccess;
