"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Package, Clock, CheckCircle, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminOrderCard from "@/components/AdminOrderCard";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/userModel";
import { motion, AnimatePresence } from "framer-motion";

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

function ManageOrders() {
  const [orders, setOrders] = useState<IOrder[]>();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "out of delivery" | "delivered"
  >("all");
  const router = useRouter();

  useEffect(() => {
    const getOrders = async () => {
      try {
        setLoading(true);
        const result = await axios.get("/api/admin/get-orders");
        setOrders(result.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket?.on("new-order", (newOrder) => {
      setOrders((prev) => [newOrder, ...prev!]);
    });
    socket.on("order-assigned", ({ orderId, assignedDeliveryBoy }) => {
      setOrders((prev) =>
        prev?.map((o) =>
          o._id == orderId ? { ...o, assignedDeliveryBoy } : o,
        ),
      );
    });
    return () => {
      socket.off("new-order");
      socket.off("order-assigned");
    };
  }, []);

  // Filter orders based on status
  const filteredOrders = orders?.filter((order) =>
    filter === "all" ? true : order.status === filter,
  );

  // Statistics
  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o) => o.status === "pending").length || 0,
    outForDelivery:
      orders?.filter((o) => o.status === "out of delivery").length || 0,
    delivered: orders?.filter((o) => o.status === "delivered").length || 0,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 w-full relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300 rounded-full blur-3xl"
      />

      {/* HEADERS */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/80 shadow-md border-b border-blue-100 z-50"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
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
              Manage Orders
            </motion.h1>
          </div>

          {/* Stats Cards */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100"
            >
              <Package className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Total: {stats.total}
              </span>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-100"
            >
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                Pending: {stats.pending}
              </span>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100"
            >
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Out: {stats.outForDelivery}
              </span>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl border border-green-100"
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Delivered: {stats.delivered}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16 space-y-8 relative z-10">
        {/* Filter Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center md:justify-start"
        >
          {["all", "pending", "out of delivery", "delivered"].map(
            (status, index) => (
              <motion.button
                key={status}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * index, type: "spring" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm ${
                  filter === status
                    ? status === "pending"
                      ? "bg-yellow-500 text-white shadow-yellow-200"
                      : status === "out of delivery"
                        ? "bg-blue-500 text-white shadow-blue-200"
                        : status === "delivered"
                          ? "bg-green-500 text-white shadow-green-200"
                          : "bg-blue-600 text-white shadow-blue-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {status === "all"
                  ? "All Orders"
                  : status === "out of delivery"
                    ? "Out for Delivery"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ),
          )}
        </motion.div>

        {/* Orders List */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Loading Skeleton
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
                  >
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                        <div className="h-4 bg-blue-200 rounded"></div>
                        <div className="h-4 bg-blue-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : filteredOrders?.length === 0 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="inline-block p-4 bg-blue-50 rounded-full mb-4"
                >
                  <Package className="w-12 h-12 text-blue-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Orders Found
                </h3>
                <p className="text-gray-400">
                  There are no {filter === "all" ? "" : filter} orders to
                  display
                </p>
              </motion.div>
            ) : (
              filteredOrders?.map((order, index) => (
                <motion.div
                  key={order._id?.toString() || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.01 }}
                  className="transform-gpu"
                >
                  <AdminOrderCard order={order} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ManageOrders;
