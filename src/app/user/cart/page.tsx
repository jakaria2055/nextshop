"use client"
import {
  ArrowBigLeft,
  Minus,
  Plus,
  ShoppingBasketIcon,
  Trash2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/cartSlice";
import { useRouter } from "next/navigation";

function Cart() {
  const { cartData, subTotal, deliveryFee, finalTotal } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 py-8"
    >
      <div className="w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-8 mb-24 relative">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="absolute -top-2 left-0 z-10"
        >
          <Link
            href={"/"}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-medium transition-all group"
          >
            <motion.div
              animate={{ x: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            >
              <ArrowBigLeft size={20} />
            </motion.div>
            <span className="hidden sm:inline group-hover:underline">Back Home</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.h2 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent text-center mb-10"
        >
          Your Cart Items
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block ml-2"
          >
            🛒
          </motion.span>
        </motion.h2>

        {cartData.length == 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100"
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
            >
              <ShoppingBasketIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            </motion.div>
            <p className="text-gray-600 text-lg mb-6">
              Your Cart is Empty. Go for Shopping...
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={"/"}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-blue-800 transition-all inline-block font-medium shadow-md hover:shadow-lg"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ITEMS LIST */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 100, 
                      damping: 12,
                      delay: index * 0.1 
                    }}
                    layout
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.2)",
                      borderColor: "#93c5fd"
                    }}
                    className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {/* IMAGE */}
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative w-28 h-28 sm:w-24 sm:h-24 md:w-28 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-white"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-3 transition-transform duration-300"
                      />
                    </motion.div>

                    {/* PRODUCT INFO */}
                    <div className="mt-4 sm:mt-0 sm:ml-4 flex-1 text-center sm:text-left">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded-full mt-1">
                        {item.unit}
                      </p>
                      <p className="text-blue-700 font-bold mt-2 text-sm sm:text-base">
                        ৳ {Number(item.price) * item.quantity}
                      </p>
                    </div>

                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center justify-center sm:justify-end gap-2 mt-3 sm:mt-0 bg-blue-50 px-2 py-1 rounded-full">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#dbeafe" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(decreaseQuantity(item._id))}
                        className="bg-white p-1.5 rounded-full hover:bg-blue-100 transition-all border border-blue-200"
                      >
                        <Minus size={14} className="text-blue-700" />
                      </motion.button>
                      <motion.span 
                        key={item.quantity}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="font-semibold text-gray-800 w-8 text-center"
                      >
                        {item.quantity}
                      </motion.span>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "#dbeafe" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dispatch(increaseQuantity(item._id))}
                        className="bg-white p-1.5 rounded-full hover:bg-blue-100 transition-all border border-blue-200"
                      >
                        <Plus size={14} className="text-blue-700" />
                      </motion.button>
                    </div>

                    {/* DELETE BUTTON */}
                    <motion.button
                      whileHover={{ scale: 1.1, color: "#ef4444" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="sm:ml-4 mt-3 sm:mt-0 text-red-400 hover:text-red-600 transition-all p-2"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* BILL SECTION */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 h-fit sticky top-24 border border-blue-100 flex flex-col"
            >
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                Order Summary
              </h2>
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                Order over ৳1000 to get free delivery
              </p>

              <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-between items-center py-1"
                >
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                    ৳ {subTotal}
                  </span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-between items-center py-1"
                >
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={`font-semibold px-3 py-1 rounded-full ${deliveryFee === 0 ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-700'}`}>
                    ৳ {deliveryFee}
                  </span>
                </motion.div>
                
                <motion.hr 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6 }}
                  className="my-3 border-blue-100"
                />
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-between font-bold text-lg sm:text-xl"
                >
                  <span className="text-gray-800">Final Total</span>
                  <span className="text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-1 rounded-full">
                    ৳ {finalTotal}
                  </span>
                </motion.div>
              </div>

              <motion.button 
                onClick={() => router.push("/user/checkout")}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-full hover:from-blue-600 hover:to-blue-800 transition-all font-semibold text-sm sm:text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight size={18} />
                </motion.div>
              </motion.button>

              {/* Payment Icons */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center gap-2 mt-4"
              >
                <div className="w-8 h-5 bg-blue-100 rounded text-[8px] flex items-center justify-center text-blue-700 font-bold">VISA</div>
                <div className="w-8 h-5 bg-blue-100 rounded text-[8px] flex items-center justify-center text-blue-700 font-bold">MC</div>
                <div className="w-8 h-5 bg-blue-100 rounded text-[8px] flex items-center justify-center text-blue-700 font-bold">BKASH</div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Cart;