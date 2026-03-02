"use client";
import { Leaf, ShoppingBasketIcon, Smartphone, Truck } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function HeroSection() {
  const slides = [
    {
      id: 1,
      icon: <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-lg" />,
      title: "Fresh natural Groceries",
      subtitle:
        "Fresh fruits, vegetables, meat, chicken and daily essentials delivered to you.",
      btnText: "Shop Now",
      bg: "/image/fresh_groceries.jpg",
      color: "from-green-500 to-green-600",
    },
    {
      id: 2,
      icon: <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-lg" />,
      title: "Fast & Reliable Delivery",
      subtitle:
        "Get your groceries delivered quickly and safely, right to your doorstep.",
      btnText: "Order Now",
      bg: "/image/online_shopping.jpg",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 3,
      icon: <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-purple-400 drop-shadow-lg" />,
      title: "Shop Anytime Anywhere",
      subtitle:
        "Convenient shopping experience from your phone, tablet, or computer—anytime you want.",
      btnText: "Start Shopping",
      bg: "/image/online_shopping.jpg",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [slides.length, isHovered]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div 
      className="relative w-[98%] mx-auto mt-28 h-[85vh] rounded-3xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Animation */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 }
          }}
          className="absolute inset-0"
        >
          <Image
            src={slides[current].bg}
            fill
            alt={slides[current].title}
            priority
            className="object-cover scale-105 group-hover:scale-100 transition-transform duration-7000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all border border-white/30"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all border border-white/30"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white px-4 z-20">
        <motion.div 
          key={current}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="flex flex-col items-center justify-center gap-6 max-w-4xl"
        >
          {/* Icon with Glassmorphism Effect */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="relative"
          >
            {/* Glassmorphism Container */}
            <div className="relative backdrop-blur-xl bg-white/10 p-8 rounded-full shadow-2xl border border-white/30">
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
              
              {/* Icon */}
              <div className="relative z-10">
                {slides[current].icon}
              </div>
            </div>
            
            {/* Outer glow rings */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-white/20 blur-xl -z-10"
            />
          </motion.div>

          {/* Title with gradient */}
          <motion.h1 
            variants={textVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg"
          >
            {slides[current].title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={textVariants}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-200 max-w-2xl leading-relaxed drop-shadow"
          >
            {slides[current].subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            variants={textVariants}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className={`mt-4 bg-gradient-to-r ${slides[current].color} text-white px-8 py-3.5 rounded-full font-semibold shadow-lg transition-all flex items-center gap-2 border border-white/20`}
          >
            <ShoppingBasketIcon className="w-5 h-5" />
            {slides[current].btnText}
          </motion.button>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="group relative"
          >
            <div
              className={`h-2 rounded-full transition-all ${
                current === index ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
            {current === index && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -top-1 left-0 w-full h-4 rounded-full bg-white/20 blur-sm"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        key={current}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 5, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${slides[current].color} z-30`}
      />
    </div>
  );
}

export default HeroSection;