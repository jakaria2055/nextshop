"use client"
import mongoose from "mongoose";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

function GroceryItemCard({ item }: { item: IGrocery }) {
  return (
  <motion.div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
    <div className="relative w-full aspect-4/3 bg-gray-50 overflow-hidden group ">
        <Image src={item.image} fill alt={item.name} sizes="(max-width:768px) 100vw, 25vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
    </div>
    {item.name}
  </motion.div>
  );
}

export default GroceryItemCard;
