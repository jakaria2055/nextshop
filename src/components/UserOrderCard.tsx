"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Truck,
  TruckElectric,
  UserCheck,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { getSocket } from "@/lib/socket";
import { IUser } from "@/models/userModel";
import { useRouter } from "next/navigation";

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

function UserOrderCard({ order }: { order: IOrder }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "out of delivery":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-700 border border-green-300";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={14} className="text-yellow-600" />;
      case "out of delivery":
        return <Truck size={14} className="text-blue-600" />;
      case "delivered":
        return <Package size={14} className="text-green-600" />;
      default:
        return null;
    }
  };

  useEffect((): any => {
    const socket = getSocket();
    socket.on("order-status-update", (data) => {
      if (data.orderId.toString() === order?._id?.toString()) {
        setStatus(data.status);
      }
    });

    return () => socket.off("order-status-update");
  }, [order._id]);

  return (
    <motion.div
      whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.2)" }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Header Section */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-blue-100 px-5 py-4 bg-gradient-to-r from-blue-50/50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order{" "}
            <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-bold">
              #{order?._id?.toString()?.slice(-8).toUpperCase()}
            </span>
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Calendar size={12} className="text-blue-500" />
            <p className="text-xs text-gray-500">
              {new Date(order.createdAt!).toLocaleDateString()} • {new Date(order.createdAt!).toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* PAYMENT STATUS */}
          {status !== "delivered" && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 ${
                order.isPaid
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-red-100 text-red-700 border-red-300"
              }`}
            >
              <CreditCard size={12} />
              {order.isPaid ? "Paid" : "Unpaid"}
            </motion.span>
          )}

          {/* DELIVERY STATUS */}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`px-3 py-1 text-xs font-semibold border rounded-full flex items-center gap-1 ${getStatusColor(status)}`}
          >
            {getStatusIcon(status)}
            {status}
          </motion.span>
        </div>
      </motion.div>

      {/* Content Section - Only show if not delivered */}
      {status !== "delivered" && (
        <div className="p-5 space-y-4">
          {/* Payment Method */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-gray-700 text-sm bg-blue-50/50 p-2 rounded-lg"
          >
            {order.paymentMethod == "cod" ? (
              <>
                <TruckElectric className="text-blue-600" size={16} />
                <span className="font-medium">Cash on Delivery</span>
              </>
            ) : (
              <>
                <CreditCard size={16} className="text-blue-600" />
                <span className="font-medium">Online Payment</span>
              </>
            )}
          </motion.div>

          {/* Delivery Boy Info */}
          {order.assignedDeliveryBoy && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <UserCheck className="text-blue-600" size={18} />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {order.assignedDeliveryBoy.name}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Phone size={12} className="text-blue-500" />
                      {order.assignedDeliveryBoy.mobile}
                    </p>
                  </div>
                </div>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`tel:${order.assignedDeliveryBoy.mobile}`}
                  className="bg-blue-600 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                  Call Now
                </motion.a>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                onClick={() =>
                  router.push(`/user/track-order/${order._id?.toString()}`)
                }
              >
                <TruckElectric size={18} />
                <span>Track Delivery</span>
              </motion.button>
            </motion.div>
          )}

          {/* Address */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-2 text-gray-700 text-sm bg-gray-50 p-3 rounded-lg"
          >
            <MapPin size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">{order.address.fullAddress}</span>
          </motion.div>

          {/* Items Section */}
          <div className="border-t border-blue-100 pt-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => setExpanded((prev) => !prev)}
              className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition"
            >
              <span className="flex items-center gap-2">
                <Package size={16} className="text-blue-600" />
                {expanded ? "Hide Items" : `View ${order.items.length} Item${order.items.length > 1 ? 's' : ''}`}
              </span>

              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {expanded ? (
                  <ChevronUp size={16} className="text-blue-600" />
                ) : (
                  <ChevronDown size={16} className="text-blue-600" />
                )}
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    {order.items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, backgroundColor: "#f0f9ff" }}
                        className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} x {item.unit}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-blue-700">
                          ৳ {Number(item.price) * item.quantity}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="border-t border-blue-100 pt-3 flex justify-between items-center text-sm font-semibold text-gray-800"
          >
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-blue-600" />
              <span className="text-gray-600">Delivery Status:</span>
              <motion.span
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  status === "pending" 
                    ? "bg-yellow-100 text-yellow-700" 
                    : status === "out of delivery"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {status}
              </motion.span>
            </div>
            <div className="text-blue-700 font-bold">
              ৳ {order.totalAmount}
            </div>
          </motion.div>
        </div>
      )}

      {/* Delivered State */}
      {status === "delivered" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 text-center bg-gradient-to-b from-green-50 to-white"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-3"
          >
            <Package size={48} className="text-green-500" />
          </motion.div>
          <h3 className="text-lg font-bold text-green-700 mb-1">Order Delivered!</h3>
          <p className="text-sm text-gray-600">
            Thank you for shopping with us. Hope to see you again!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-md"
          >
            Shop Again
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default UserOrderCard;