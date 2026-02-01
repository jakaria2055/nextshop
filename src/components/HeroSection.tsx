"use client";
import { Leaf, ShoppingBasketIcon, Smartphone, Truck } from "lucide-react";
import { AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";


function HeroSection() {

  const slides = [
    {
      id: 1,
      icon: (
        <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg" />
      ),
      title: "Fresh natural Groceries 🥦",
      subtitle:
        "Fresh-fruits, vegetables, meat, chicken and daily essentials delivered to you.",
      btnText: "Shop Now",
      bg: "/image/fresh_groceries.jpg",
    },
    {
      id: 2,
      icon: (
        <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />
      ),
      title: "Fast & Reliable Delivery 🚚",
      subtitle:
        "Get your groceries delivered quickly and safely, right to your doorstep.",
      btnText: "Order Now",
      bg: "/image/online_shopping.jpg",
    },
    {
      id: 3,
      icon: (
        <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-purple-400 drop-shadow-lg" />
      ),
      title: "Shop Anytime Anywhere 📱",
      subtitle:
        "Convenient shopping experience from your phone, tablet, or computer—anytime you want.",
      btnText: "Start Shopping",
      bg: "/image/online_shopping.jpg", 
    },
  ];

  //   {
  //     id: 1,
  //     icon: (
  //       <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg" />
  //     ),
  //     title: "Fresh natural Groceries 🥦",
  //     subtitle:
  //       "Fresh-fruits, vegetables, meat, chicken and daily essentials delivered to you.",
  //     btnText: "Shop Now",
  //     bg: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=800&fit=crop", // Fresh groceries
  //   },
  //   {
  //     id: 2,
  //     icon: (
  //       <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />
  //     ),
  //     title: "Fast & Reliable Delivery 🚚",
  //     subtitle:
  //       "Get your groceries delivered quickly and safely, right to your doorstep.",
  //     btnText: "Order Now",
  //     bg: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&h=800&fit=crop", // Delivery
  //   },
  //   {
  //     id: 3,
  //     icon: (
  //       <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-purple-400 drop-shadow-lg" />
  //     ),
  //     title: "Shop Anytime Anywhere 📱",
  //     subtitle:
  //       "Convenient shopping experience from your phone, tablet, or computer—anytime you want.",
  //     btnText: "Start Shopping",
  //     bg: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop", // Online shopping
  //   },
  // ];

  const [current, setCurrent] = useState(0); // Start from 0

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]); 

  return (
    <div className="relative w-[98%] mx-auto mt-32 h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={slides[current].bg}
            fill
            alt="slides"
            priority
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"/>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
        <motion.div className="flex flex-col items-center justify-center gap-6 max-w-3xl">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-full shadow-lg">{slides[current].icon}</div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">{slides[current].title}</h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl">{slides[current].subtitle}</p>

            <motion.div className="mt-4 bg-white text-blue-700 hover:bg-blue-100 px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 flex items-center gap-2">
                <ShoppingBasketIcon className="w-5 h-5"/>
                {slides[current].btnText}
            </motion.div>
        </motion.div>
      </div>

       {/*  Add slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === index ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>

    </div>
  );
}

export default HeroSection;
