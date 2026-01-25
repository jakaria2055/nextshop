"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bike, ShoppingCart, Sparkles, CheckCircle } from "lucide-react";

type propType = {
  nextStep: (s: number) => void;
};

function Welcome({ nextStep }: propType) {

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-orange-50/50" />

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Logo section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <ShoppingCart className="w-10 h-10 text-blue-900" />
            </motion.div>
            <h1 className="text-4xl font-bold text-blue-900">NextShop</h1>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="ml-1"
            >
              <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </motion.div>
          </div>
          
          <p className="text-lg text-gray-600 mb-2">
            Your destination for fresh groceries & daily essentials
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {["Fresh groceries", "Organic produce", "Fast delivery"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-center gap-2 p-3 bg-white rounded-lg shadow-sm"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 font-medium text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Animated icons section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative flex items-center justify-center my-10"
        >
          {/* Simple connecting line */}
          <div className="absolute h-px w-48 bg-gradient-to-r from-blue-200 to-orange-200" />
          
          <motion.div
            animate={{
              x: [0, 30, 0],
            }}
            transition={{
              x: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="relative z-10 p-4"
          >
            <ShoppingCart className="w-16 h-16 text-blue-600" />
          </motion.div>

          <motion.div
            animate={{
              x: [0, -30, 0],
            }}
            transition={{
              x: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }
            }}
            className="relative z-10 p-4"
          >
            <Bike className="w-16 h-16 text-orange-600" />
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-700 mb-8 max-w-md mx-auto">
            Delivered right to your doorstep in minutes
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => nextStep(2)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <p className="text-sm text-gray-500 mt-6">
            Join thousands of satisfied customers
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Welcome;