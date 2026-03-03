"use client";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart, increaseQuantity, decreaseQuantity } from "@/redux/cartSlice";

interface IGrocery {
  _id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

function GroceryItemCard({ item }: { item: IGrocery }) {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData } = useSelector((state: RootState) => state.cart);
  const cartItem = cartData.find((i) => i._id.toString() == item._id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={item.image}
          fill
          alt={item.name}
          sizes="(max-width:768px) 100vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 hover:scale-105"
        />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
          <p className="text-xs font-medium text-blue-600">{item.category}</p>
        </div>

        {/* Unit Badge */}
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
          {item.unit}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-10">
          {item.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">Price</span>
          <span className="text-base font-bold text-blue-600">৳{item.price}</span>
        </div>

        {/* Add to Cart Section */}
        {!cartItem ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </motion.button>
        ) : (
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white hover:bg-blue-100 transition-colors"
              onClick={() => dispatch(decreaseQuantity(item._id))}
            >
              <Minus size={14} className="text-blue-600" />
            </motion.button>
            
            <span className="text-sm font-semibold text-gray-700">
              {cartItem.quantity}
            </span>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white hover:bg-blue-100 transition-colors"
              onClick={() => dispatch(increaseQuantity(item._id))}
            >
              <Plus size={14} className="text-blue-600" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default GroceryItemCard;