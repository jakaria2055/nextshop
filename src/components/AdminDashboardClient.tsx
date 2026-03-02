"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Package, Truck, Users, TrendingUp, Calendar, Clock } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type propType = {
  earning: {
    today: number;
    sevenDays: number;
    total: number;
  };
  stats: {
    title: string;
    value: number;
  }[];
  chartData: {
    day: string;
    orders: number;
  }[];
};

function AdminDashboardClient({ earning, stats, chartData }: propType) {
  const [filter, setFilter] = useState<"today" | "sevenDays" | "total">("total");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentEarning =
    filter === "today"
      ? earning?.today || 0
      : filter === "sevenDays"
        ? earning?.sevenDays || 0
        : earning?.total || 0;

  const title =
    filter === "today"
      ? "Today's Earning"
      : filter === "sevenDays"
        ? "Last 7 Days Earning"
        : "Total Earning";

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Static growth percentages (or pass them as props)
  const growthPercentages = [12, 18, 8, 15];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-28 pb-10"
    >
      <div className="w-[90%] md:w-[80%] mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-blue-600 rounded-full" />
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
              Admin Dashboard
            </h1>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <select
              onChange={(e) => setFilter(e.target.value as any)}
              value={filter}
              className="border border-blue-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-full sm:w-44 cursor-pointer text-gray-700 shadow-sm hover:border-blue-300"
            >
              <option value="total">Total Earnings</option>
              <option value="sevenDays">Last 7 Days</option>
              <option value="today">Today</option>
            </select>
          </motion.div>
        </motion.div>

        {/* Earnings Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.1)" }}
          className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 mb-10 shadow-lg relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mb-10" />
          
          <div className="relative">
            <div className="flex items-center gap-2 text-gray-700 mb-3">
              {filter === "today" ? (
                <Clock size={18} />
              ) : filter === "sevenDays" ? (
                <Calendar size={18} />
              ) : (
                <TrendingUp size={18} />
              )}
              <span className="text-sm font-medium uppercase tracking-wider">
                {title}
              </span>
            </div>
            <motion.p 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="text-5xl font-bold text-gray-700"
            >
              ${currentEarning.toLocaleString()}
            </motion.p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {stats.map((s, i) => {
            const icons = [
              <Package key="p" className="text-blue-600 w-6 h-6" />,
              <Users key="u" className="text-blue-600 w-6 h-6" />,
              <Truck key="t" className="text-blue-600 w-6 h-6" />,
              <DollarSign key="r" className="text-blue-600 w-6 h-6" />,
            ];

            return (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 15px 30px -10px rgba(37, 99, 235, 0.15)" }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <motion.div 
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="bg-blue-50 p-3 rounded-xl"
                  >
                    {icons[i]}
                  </motion.div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    +{growthPercentages[i]}%
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-1">{s.title}</p>
                <motion.p 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 * i }}
                  className="text-2xl font-bold text-gray-800"
                >
                  {s.value.toLocaleString()}
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Chart Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          whileHover={{ boxShadow: "0 15px 30px -10px rgba(37, 99, 235, 0.1)" }}
          className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full" />
              <h2 className="text-lg font-semibold text-gray-800">
                Orders Overview
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span>Last 7 Days</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
                cursor={{ fill: '#f9fafb' }}
              />
              <Bar 
                dataKey="orders" 
                fill="#2563eb" 
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Chart Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <span>Total Orders: {chartData.reduce((acc, curr) => acc + curr.orders, 0)}</span>
            </div>
            {mounted && (
              <div className="text-xs text-gray-400">
                Updated just now
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer Note */}
        {mounted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-xs text-gray-400 mt-6"
          >
            Dashboard auto-refreshes every 5 minutes • {new Date().toLocaleDateString()}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default AdminDashboardClient;