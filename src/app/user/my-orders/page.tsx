"use client";

import axios from "axios";
import {
  ArrowLeft,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import UserOrderCard from "@/components/UserOrderCard";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/userModel";

export interface IOrder {
  _id?: string;
  user: string;
  items: [
    {
      grocery: string;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  isPaid: boolean;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  address: {
    fullName: string;
    mobile: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  assignment?: string;
  assignedDeliveryBoy?: IUser;
  status: "pending" | "out of delivery" | "delivered";
  createdAt?: Date;
  updatedAt?: Date;
}

function MyOrder() {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "out of delivery" | "delivered"
  >("all");

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const result = await axios.get("/api/user/my-orders");
        setOrders(result.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getMyOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id?.toString() === orderId.toString()
            ? { ...o, assignedDeliveryBoy }
            : o,
        ),
      );
    });

    return () => {
      socket.off("order-assigned");
    };
  }, []);

  // Filter orders based on status
  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    if (filter === "all") return orders;
    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  console.log("Current filter:", filter);
  console.log("Filtered orders count:", filteredOrders.length);
  console.log("Total orders:", orders.length);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <PackageSearch size={50} className="text-blue-600" />
          </motion.div>
          <motion.p
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-lg font-medium text-blue-700"
          >
            Loading your orders...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-br from-blue-50 via-white to-blue-50/30 min-h-screen w-full relative overflow-hidden"
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

      <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative z-10">
        {/* HEADER */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/80 shadow-md border-b border-blue-100 z-50"
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 active:scale-95 transition-all shadow-sm"
                onClick={() => router.push("/")}
              >
                <ArrowLeft size={24} className="text-blue-600" />
              </motion.button>
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent"
              >
                My Orders
              </motion.h1>
            </div>

            {/* Order Stats */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200"
            >
              <span className="text-sm font-medium text-blue-700">
                {filter === "all"
                  ? `Total: ${orders.length}`
                  : `${filter}: ${filteredOrders.length}`}
              </span>
            </motion.div>
          </div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto px-4 pb-2 flex gap-2 overflow-x-auto"
          >
            {(["all", "pending", "out of delivery", "delivered"] as const).map(
              (status, index) => (
                <motion.button
                  key={status}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    console.log("Setting filter to:", status);
                    setFilter(status);
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filter === status
                      ? status === "pending"
                        ? "bg-yellow-500 text-white"
                        : status === "out of delivery"
                          ? "bg-blue-500 text-white"
                          : status === "delivered"
                            ? "bg-green-500 text-white"
                            : "bg-blue-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {status === "all" ? "All Orders" : status}
                </motion.button>
              ),
            )}
          </motion.div>
        </motion.div>

        {/* BODY */}
        <div className="mt-32">
          {filteredOrders.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="pt-10 flex flex-col items-center text-center"
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
                <PackageSearch size={80} className="text-blue-500 mb-4" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                No {filter !== "all" ? filter : ""} Orders Found!
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {filter === "all"
                  ? "Start shopping to see your orders here."
                  : `You don't have any ${filter} orders.`}
              </p>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/")}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-lg"
              >
                <ShoppingBag size={18} />
                Start Shopping
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <UserOrderCard key={order._id?.toString()} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default MyOrder;
