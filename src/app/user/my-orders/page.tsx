"use client";
import { IOrder } from "@/models/orderModel";
import axios from "axios";
import { ArrowLeft, PackageSearch, ShoppingBagIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import UserOrderCard from "@/components/UserOrderCard";

function MyOrder() {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const result = await axios.get("/api/user/my-orders");
        setOrders(result.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-600">
        <span className="text-lg font-medium animate-pulse tracking-wide">
          Loading your orders...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-white to-gray-100 min-h-screen w-full">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative">
        {/* HEARDERS */}
        <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-sm border-b z-50">
          <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
            <button
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition"
              onClick={() => router.push("/")}
            >
              <ArrowLeft size={24} className="text-blue-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
          </div>
        </div>

        {/* BODY */}
        {orders?.length == 0 ? (
          <div className="pt-20 flex flex-col items-center text-center">
            <PackageSearch size={70} className="text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              No Orders Found!
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Start Shopping to View Your Orders.{" "}
            </p>
            <button onClick={()=>router.push("/")} className="flex justify-center items-center mt-5 w-50 px-2 py-2 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white">
              <ShoppingBagIcon />
              Go for Shooping
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {
              orders?.map((order, index)=>(
                <motion.div key={index}>
                  <UserOrderCard order={order} />
                </motion.div>
              ))
            }

          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrder;
