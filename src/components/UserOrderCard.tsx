"use client";
import { IOrder } from "@/models/orderModel";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  Truck,
  TruckElectric,
} from "lucide-react";
import Image from "next/image";

function UserOrderCard({ order }: { order: IOrder }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "out for delivery":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-700 border border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-300";
    }
  };

  return (
    <motion.div className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-100 px-5 py-4 bg-linear-to-r from-blue-50 to-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order{" "}
            <span className="text-blue-700 font-bold underline">
              #{order?._id?.toString()?.slice(-6)}
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* PAYMENT STATUS */}
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${
              order.isPaid
                ? "bg-green-100 text-blue-700 border-blue-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>

          {/* DELIVERY STATUS */}
          <span
            className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(order.status)}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {order.paymentMethod == "cod" ? (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <TruckElectric className="text-blue-600" size={16} />
            Cash on Delivery
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <CreditCard size={16} className="text-blue-600" />
            Online Payment
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <MapPin size={16} className="text-blue-600" />
          <span className="truncate">{order.address.fullAddress}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-blue-700 transition"
          >
            <span className="flex items-center gap-2">
              <Package size={16} className="text-blue-600" />
              {expanded ? "Hide Items" : `View ${order.items.length} Items`}
            </span>

            {expanded ? (
              <ChevronUp size={16} className="text-blue-600" />
            ) : (
              <ChevronDown size={16} className="text-blue-600" />
            )}
          </button>

          <motion.div
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover border border-gray-200"
                    />

                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} x {item.unit}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800"><span className="text-xs text-gray-400">BDT:</span> {Number(item.price) * item.quantity}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Truck size={16}  className="text-blue-700"/>
            <span>Delivery: {order.status}</span>
          </div>
          <div className="font-semibold">
            Total: {order.totalAmount} <span className="text-xs text-gray-400">BDT</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserOrderCard;
