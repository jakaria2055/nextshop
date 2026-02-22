"use client";
import React from "react";

import { motion } from "framer-motion";

function AdminDashboardClient() {
  return (
    <div className="pt-28 w-[90%] md:w-[80%] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 text-center sm:text-left">
        <motion.h1 className="text-3xl md:text-4xl font-bold text-blue-700">
          📟 Admin DashBoard
        </motion.h1>

        <select className="border border-gray-500 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition w-full sm:w-auto">
            <option value="last 7 days">Last 7 Days</option>
            <option value="today">Today</option>
            <option value="total">Total</option>
        </select>
      </div>
    </div>
  );
}

export default AdminDashboardClient;
